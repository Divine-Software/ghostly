import { parseGhostlyPacket, sendGhostlyMessage, TemplateDriver } from '@divine/ghostly-runtime';
import { AttachmentInfo, GhostlyError, GhostlyRequest, GhostlyTypes, OnGhostlyEvent, PaperSize, View, ViewportSize } from '@divine/ghostly-runtime/build/src/types'; // Avoid DOM types leaks
import { ContentType } from '@divine/headers';
import { Parser } from '@divine/uri';
import { promises as fs } from 'fs';
import { Browser, Page } from 'playwright-chromium';
import packageJSON from '../package.json';
import { EngineConfig, RenderResult } from './engine';
import { HTMLTransforms } from './html-transforms';
import { browserVersion, deleteUndefined, paperDimensions, toFilename } from './template';

const domPurifyJS = fs.readFile(require.resolve('dompurify/dist/purify.min.js'), { encoding: 'utf8' });

interface GhostlyProxyWindow extends Window {
    sendGhostlyMessage: typeof sendGhostlyMessage;
    DOMPurify: { sanitize(dirty: string, options: { ALLOW_UNKNOWN_PROTOCOLS: boolean, WHOLE_DOCUMENT: boolean }): string; }
}

interface GhostlyWindow extends Window {
    __ghostly_message_proxy__: GhostlyProxyWindow
}

export class PlaywrightDriver extends TemplateDriver {
    private _expires: number;
    private _page!: Page;
    private _error?: GhostlyError;
    private _onGhostlyEvent?: OnGhostlyEvent;

    constructor(public url: string, private _config: EngineConfig) {
        super();

        this._expires = Date.now() + _config.pageMaxAge * 1000;
    }

    isExpired(): boolean {
        return Date.now() > this._expires;
    }

    private get log(): Console {
        return this._config.logger;
    }

    async initialize(browser: Browser): Promise<this> {
        const context = await browser.newContext({
            userAgent: `Ghostly/${packageJSON.version} ${browserVersion(browser)}`,
        });

        context.on('page', (page) => {
            /* async */ page.route('**/*', (route, req) => {
                this.log.debug(`${this.url}: Loading ${req.url()}`);

                if (this._config.templatePattern.test(req.url())) {
                    route.continue();
                }
                else {
                    this.log.error(`${this.url}: Template accessed a forbidden URL: ${req.url()} did not match ${this._config.templatePattern}`);
                    route.abort('addressunreachable');
                }
            });

            page.on('pageerror', (error) => {
                this.log.error(`${this.url}: [pageerror]: ${error}`);

                // Close page so request terminates directly
                this._error = new GhostlyError(`${this.url}: Unhandled error in template`, error);
                /* async */ page.close();
            });

            page.on('dialog', (dialog) => {
                this.log.warn(`${this.url}: [${dialog.type()}] ${dialog.message()}`)
                dialog.dismiss();
            });

            page.on('console', async (msg) => {
                const method = (this.log as any)[msg.type()] as Console['log'];
                const params = await Promise.all(msg.args().map((arg) => arg.jsonValue().catch(() => arg.toString())));

                (typeof method === 'function' ? method : this.log.warn).call(this.log, `${this.url}: [console]`, ...params);
            });
        });

        this._page = await context.newPage();

        return this;
    }

    async renderViews(hash: string, document: string | object, contentType: string, views: View[], renderAttachments: boolean, onGhostlyEvent?: OnGhostlyEvent): Promise<RenderResult[]> {
        const template = `${this.url}#${hash}`;
        const result: RenderResult[] = [];

        try {
            this._onGhostlyEvent = onGhostlyEvent;

            if (!this._template /* ghostlyLoad not yet called */) {
                // Always specify fragment on initial load, because otherwise `window.location.hash = ''` will trigger an event
                await this._page.goto(template, { waitUntil: 'load' });

                // Create the Ghostly message proxy
                await (async (window: GhostlyWindow) => this._page.evaluate(([sendGhostlyMessage, domPurifyJS]) => {
                    try {
                        window.__ghostly_message_proxy__ = window.open('', '', 'width=0,height=0') as GhostlyProxyWindow;
                        window.__ghostly_message_proxy__.document.open().write(`<script type='text/javascript'>
                            ${domPurifyJS}
                            ${sendGhostlyMessage}
                        </script>`);
                        window.__ghostly_message_proxy__.document.close();
                    }
                    catch (_ignored) {
                        throw new Error(`${this.url}: Failed to create Ghostly message proxy!`);
                    }
                }, [sendGhostlyMessage.toString(), await domPurifyJS]))(null!);
            }

            // Set fragment
            await this._page.evaluate((hash) => window.location.hash = hash, hash);

            // Call ghostlyLoad if new template or hash differs
            if (template !== this._template) {
                this.log.info(`${this.url}: Initializing page with fragment '#${hash}'.`);
                await this.ghostlyLoad(template);
            }

            // Send document/model to template
            this.log.info(`${this.url}: Initializing ${contentType} model.`);
            const info = await this.ghostlyInit({ document, contentType });

            const attachments: RenderResult[] = [];

            // Render all attachments first (matching PreviewDriver behaviour)
            if (renderAttachments) {
                for (const ai of info?.attachments ?? []) {
                    attachments.push({
                        type:        'attachment',
                        contentType: ai.contentType,
                        name:        ai.name,
                        description: ai.description,
                        data:        await this._renderViewOrAttachment(ai, ai),
                    });
                }
            }

            // Render all views
            for (const view of deleteUndefined(views) /* Ensure undefined values do not overwrite defaults */) {
                result.push({
                    type:        'view',
                    name:        toFilename(info?.name, view.contentType),
                    description: info?.description,
                    contentType: view.contentType,
                    data:        await this._renderViewOrAttachment(view, null),
                });
            }

            // Add attchments to result array (after the views)
            result.push(...attachments);
        }
        catch (err) {
            this.log.error(`${this.url}: renderViews failed: ${this._error ?? err}`);
            throw this._error ?? err;
        }
        finally {
            // Silently ignore ghostlyEnd errors, since only v2 templates implement this method
            await this.ghostlyEnd().catch(() => null);

            delete this._error;
            delete this._onGhostlyEvent;
        }

        return result;
    }

    private async _renderViewOrAttachment(view: View, info: AttachmentInfo | null): Promise<Buffer> {
        const ct = ContentType.create(view.contentType);
        const dpi = view.dpi || 96;
        const ps: Required<PaperSize> = { format: 'A4', orientation: 'portrait', ...view.paperSize };
        const dim = paperDimensions(ct.type === 'application/pdf' ? ps : view.paperSize, dpi)
        const vps: Required<ViewportSize> = { ...dim, ...view.viewportSize };
        const clip = view.viewportSize?.width || view.viewportSize?.height ? { x: 0, y: 0, ...vps } : undefined;

        this.log.info(`${this.url}: Rendering ${info ? `attachment '${info.name}'` : 'view'} as ${ct.type} (${vps.width}x${vps.height} @ ${dpi} DPI).`);
        await this._page.setViewportSize(vps);

        let data = info
            ? await this.ghostlyFetch(info)
            : await this.ghostlyRender(view);

        if (data instanceof Buffer) {
            return data;
        }
        else if (data instanceof Uint8Array) {
            return Buffer.from(data.buffer);
        }
        else if (data === null || data === undefined) {
            switch (ct.type) {
                case 'text/html': {
                    const sanitizer = (dirty: string, fragment: boolean) => ((window: GhostlyWindow) => this._page.evaluate(([dirty, fragment]) => {
                        return window.__ghostly_message_proxy__.DOMPurify.sanitize(dirty, { ALLOW_UNKNOWN_PROTOCOLS: true, WHOLE_DOCUMENT: !fragment });
                    }, [dirty, fragment] as const))(null!);

                    data = await new HTMLTransforms(this.url, this._config, sanitizer).apply(await this._page.content(), view);
                    break;
                }

                case 'text/plain':
                    data = await this._page.innerText('css=body');
                    break;

                case 'application/pdf':
                    return await this._page.pdf({
                        format:    ps.format,
                        landscape: ps.orientation === 'landscape',
                    });

                case 'image/jpeg':
                    return await this._page.screenshot({ fullPage: true, type: 'jpeg', clip });

                case 'image/png':
                    return await this._page.screenshot({ fullPage: true, type: 'png', clip });

                default:
                    throw info
                        ? new GhostlyError(`${this.url}: ghostlyFetch did not return a result for attachment '${info.name}'`, info)
                        : new GhostlyError(`${this.url}: ghostlyRender did not return a result for view '${view.contentType}'`, view)
            }
        }

        try {
            return (await Parser.serializeToBuffer(data, ct))[0];
        }
        catch (err) {
            throw info
                    ? new GhostlyError(`${this.url}: ghostlyFetch returned an unexpected object for attachment '${info.name}': ${data}`, err)
                    : new GhostlyError(`${this.url}: ghostlyRender returned an unexpected object for view '${view.contentType}': ${data}`, err)
        }
    }

    async close(): Promise<void> {
        await this._page.close().catch((err) => this.log.error(err));
    }

    protected async sendMessage(request: GhostlyRequest): Promise<GhostlyTypes> {
        const response = await ((window: GhostlyWindow) => this._page.evaluate(([request, timeout]) => {
            try {
                const events: object[] = []; // Batch all events since I don't know how to propagate them in real-time

                return window.__ghostly_message_proxy__.sendGhostlyMessage(window, request, (data) => events.push(data), timeout)
                    .then((packet) => ({ packet, events}));
            }
            catch (err) {
                throw new Error(`${this.url}: Ghostly message proxy not found or it's failing: ${err}`);
            }
        }, [request, this._config.timeout] as const))(null!);

        response.events.forEach((event) => this._onGhostlyEvent?.(event));

        return parseGhostlyPacket(request, response.packet);
    }
}
