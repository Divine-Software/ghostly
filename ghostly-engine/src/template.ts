import { parseGhostlyPacket, sendGhostlyMessage } from '@divine/ghostly-runtime';
import { AttachmentInfo, GhostlyRequest, GhostlyTypes, OnGhostlyEvent, PaperSize, ModelInfo, View, ViewportSize } from '@divine/ghostly-runtime/lib/src/types'; // Avoid DOM types leaks
import { promises as fs } from 'fs';
import { Browser, Page } from 'playwright-chromium';
import packageJSON from '../package.json';
import { EngineConfig, RenderResult, TemplateEngine } from './engine';
import { minify } from 'html-minifier';

const domPurifyJS = fs.readFile(require.resolve('dompurify/dist/purify.min.js'), { encoding: 'utf8' });

export interface Worker {
    id:        number;
    load:      number;
    browser:   Browser;
    pageCache: (Page | undefined)[];
}

interface GhostlyProxyWindow extends Window {
    sendGhostlyMessage: typeof sendGhostlyMessage;
    DOMPurify: { sanitize(dirty: string, options: { WHOLE_DOCUMENT: boolean }): string; }
}

interface GhostlyWindow extends Window {
    __ghostly_message_proxy__: GhostlyProxyWindow
}

export class TemplateEngineImpl implements TemplateEngine {
    private _url:  string;
    private _hash: string;

    constructor(private _config: EngineConfig, private _workers: (Worker | undefined)[], url: string) {
        const [base, ...frag] = url.split('#');

        this._url  = base;
        this._hash = frag.join('#');
    }

    get log(): Console {
        return this._config.logger;
    }

    async render(document: string | object, contentType: string, format: string, params: unknown, onGhostlyEvent?: OnGhostlyEvent): Promise<Buffer> {
        return (await this.renderViews(document, contentType, [{ contentType: format, params: params }], false, onGhostlyEvent))[0].data;
    }

    async renderViews(document: string | object, contentType: string, views: View[], attachments: boolean, onGhostlyEvent?: OnGhostlyEvent): Promise<RenderResult[]> {
        const worker = this._selectWorker();
        const result = [] as RenderResult[];
        const events = [] as object[];

        // Return events if custom handler not provider
        onGhostlyEvent ??= (event) => events.push(event);

        try {
            ++worker.load;

            // Find a cached template ...
            let page = worker.pageCache.find((page) => !!page && page.url() === this._url);

            try {
                if (page) {
                    this.log.info(`${this._url}: Using cached template.`);
                    worker.pageCache = worker.pageCache.filter((p) => p !== page);
                }
                else {
                    // ... or create a new one
                    this.log.info(`${this._url}: Creating new template.`);
                    page = await this._createPage(worker, onGhostlyEvent);
                }

                try {
                    await page.evaluate((hash) => history.replaceState(null, '', `#${hash}`), this._hash);

                    // Send document/model to template
                    this.log.info(`${this._url}: Initializing ${contentType} model.`);
                    const info = await this._sendMessage(page, ['ghostlyInit', { document, contentType }], onGhostlyEvent) as ModelInfo | null;

                    if (info) { // Validate ResultInfo
                        if (typeof info !== 'object' ||
                            typeof info.name !== 'string' ||
                            info.description !== undefined && typeof info.description !== 'string' ||
                            info.attachments !== undefined && !Array.isArray(info.attachments)) {
                            throw new Error(`${this._url}: ghostlyInit did not return a valid ResultInfo object: ${JSON.stringify(info)}`);
                        }

                        for (const ai of info.attachments ?? []) {
                            if (typeof ai.contentType !== 'string' ||
                                typeof ai.name !== 'string' ||
                                ai.description !== undefined && typeof ai.description !== 'string') {
                                throw new Error(`${this._url}: ghostlyInit returned an invalid AttachmentInfo record: ${JSON.stringify(ai)}`);
                            }
                        }
                    }

                    // Render all views
                    for (const view of deleteUndefined(views) /* Ensure undefined values do not overwrite defaults */) {
                        result.push({
                            type:        'view',
                            name:        info?.name,
                            description: info?.description,
                            contentType: view.contentType,
                            data:        await this._renderViewOrAttachment(view, null, page, onGhostlyEvent),
                        });
                    }

                    // Render all attachments
                    if (info && attachments) {
                        for (const ai of info.attachments ?? []) {
                            result.push({
                                type:        'attachment',
                                contentType: ai.contentType,
                                name:        ai.name,
                                description: ai.description,
                                data:        await this._renderViewOrAttachment(ai, ai, page, onGhostlyEvent),
                            });
                        }
                    }

                    // Add events to result, if no onGhostlyEvent handler was provided
                    result.push(...events.map((event) => ({ type: 'event' as const, 'contentType': 'application/json', data: Buffer.from(JSON.stringify(event))})));
                }
                finally {
                    // Silently ignore ghostlyEnd errors, since only v2 templates implement this method
                    await this._sendMessage(page, ['ghostlyEnd', null], onGhostlyEvent).catch(() => null);
                }

                // Return template to page cache if there were no errors
                if (this._config.pageCache) {
                    this.log.info(`${this._url}: Returning template to page cache.`);
                    worker.pageCache.unshift(page);
                    page = worker.pageCache.length > this._config.pageCache ? worker.pageCache.pop() : undefined;
                }
            }
            finally {
                if (page && this._config.pageCache) {
                    this.log.info(`${this._url}: Evicting template ${page.url().replace(/#.*/, '')} from page cache.`);
                }

                await page?.close();
            }
        }
        finally {
            --worker.load;
        }

        return result;
    }

    private async _renderViewOrAttachment(view: View, info: AttachmentInfo | null, page: Page, onGhostlyEvent: OnGhostlyEvent | undefined): Promise<Buffer> {
        const dpi = view.dpi || 96;
        const ps: Required<PaperSize> = { format: 'A4', orientation: 'portrait', ...view.paperSize };
        const dim = this._paperDimensions(view.contentType === 'application/pdf' ? ps : view.paperSize, dpi)
        const vps: Required<ViewportSize> = { ...dim, ...view.viewportSize };
        const clip = view.viewportSize?.width || view.viewportSize?.height ? { x: 0, y: 0, ...vps } : undefined;

        this.log.info(`${this._url}: Rendering ${info ? `attachment '${info.name}'` : 'view'} as ${view.contentType} (${vps.width}x${vps.height} @ ${dpi} DPI).`);
        await page.setViewportSize(vps);

        const data = info
            ? await this._sendMessage(page, ['ghostlyFetch', info], onGhostlyEvent)
            : await this._sendMessage(page, ['ghostlyRender', view], onGhostlyEvent)

        if (data instanceof Buffer) {
            return data;
        }
        else if (data instanceof Uint8Array) {
            return Buffer.from(data.buffer);
        }
        else if (typeof data === 'string') {
            return Buffer.from(data);
        }
        else if (!data) {
            switch (view.contentType) {
                case 'text/html': {
                    let content = await page.content();

                    for (const transform of view.htmlTransforms ?? ['sanitize', 'minimize']) {
                        this.log.info(`${this._url}: Applying HTML transform '${transform}'.`);

                        if (transform === 'sanitize') {
                            const doctype = /^<!DOCTYPE[^[>]*(\[[^\]]*\])?[^>]*>/i.exec(content)?.[0] ?? ''; // Preserve DOCTYPE
                            content = doctype + await ((window: GhostlyWindow) => page.evaluate((dirty) => {
                                return window.__ghostly_message_proxy__.DOMPurify.sanitize(dirty, { WHOLE_DOCUMENT: true });
                            }, content))(null!);
                        }
                        else if (transform === 'minimize') {
                            content = minify(content, {
                                collapseBooleanAttributes: true,
                                collapseWhitespace: true,
                                conservativeCollapse: true,
                                decodeEntities: true,
                                minifyCSS: true,
                                preserveLineBreaks: true,
                                removeAttributeQuotes: true,
                                removeComments: true,
                                removeScriptTypeAttributes: true,
                                removeStyleLinkTypeAttributes: true,
                                sortAttributes: true,
                                sortClassName:  true,
                            });
                        } else {
                            throw new Error(`${this._url}: Unknown HTML transform '${transform}'`);
                        }
                    }

                    return Buffer.from(content);
                }

                case 'text/plain':
                    return Buffer.from(await page.innerText('css=body'));

                case 'application/pdf':
                    return await page.pdf({
                        format:    ps.format,
                        landscape: ps.orientation === 'landscape',
                    });

                case 'image/jpeg':
                    return await page.screenshot({ fullPage: true, type: 'jpeg', clip });

                case 'image/png':
                    return await page.screenshot({ fullPage: true, type: 'png', clip });

                default:
                    throw info
                        ? new Error(`${this._url}: ghostlyFetch did not return a result for attachment ${JSON.stringify(info)}`)
                        : new Error(`${this._url}: ghostlyRender did not return a result for view ${JSON.stringify(view)}`)
            }
        }
        else {
            throw info
                ? new Error(`${this._url}: ghostlyFetch returned an unexpected object for attachment ${JSON.stringify(info)}: ${data}`)
                : new Error(`${this._url}: ghostlyRender returned an unexpected object for view ${JSON.stringify(view)}: ${data}`)
        }
    }

    private _selectWorker(): Worker {
        let best: Worker | null = null;

        for (const worker of this._workers) {
            if (worker && (!best || worker.load < best.load)) {
                best = worker;
            }
        }

        if (!best) {
            throw new Error(`${this._url}: No workers alive`);
        }

        return best;
    }

    private _paperDimensions(paperSize: PaperSize | undefined, dpi: number): Required<ViewportSize> {
        if (!paperSize?.format) {
            return { width: 800, height: 600 };
        }

        let width, height;

        switch (paperSize.format) {
            case "A0":       width = 841; height = 1189; break;
            case "A1":       width = 594; height = 841;  break;
            case "A2":       width = 420; height = 594;  break;
            case "A3":       width = 297; height = 420;  break;
            case "A4":       width = 210; height = 297;  break;
            case "A5":       width = 148; height = 210;  break;
            case "A6":       width = 105; height = 148;  break;
            case "Letter":   width = 216; height = 279;  break;
            case "Legal":    width = 216; height = 356;  break;
            case "Tabloid":  width = 432; height = 279;  break;
            case "Ledger":   width = 279; height = 432;  break;

            default:
                throw new TypeError(`Invalid paper format: ${paperSize.format}`);
        }

        if (paperSize.orientation === 'landscape') {
            [ width, height ] = [ height, width ];
        }

        // Convert from mm to pixels
        width  = Math.round(width  / 25.4 * dpi)
        height = Math.round(height / 25.4 * dpi)

        return { width, height };
    }

    private async _createPage(worker: Worker, onGhostlyEvent: OnGhostlyEvent | undefined): Promise<Page> {
        const page = await worker.browser.newPage({
            userAgent: `Ghostly/${packageJSON.version} ${browserVersion(worker.browser)}`,
        });

        await page.route('**/*', (route, req) => {
            this.log.debug(`${this._url}: Loading ${req.url()}`);

            if (this._config.templatePattern.test(req.url())) {
                route.continue();
            }
            else {
                this.log.error(`${this._url}: Template accessed a disallowed URL: ${req.url()} did not match ${this._config.templatePattern}`);
                route.abort('addressunreachable');
            }
        });

        page.on('pageerror', (error) => {
            this.log.error(`${this._url}: [pageerror]: ${error}`);
        });

        page.on('dialog', (dialog) => {
            this.log.warn(`${this._url}: [${dialog.type()}] ${dialog.message()}`)
            dialog.dismiss();
        });

        page.on('console', (msg) => {
            const method = (this.log as any)[msg.type()];
            (typeof method === 'function' ? method : this.log.warn).call(this.log, `${this._url}: [console] ${msg.text()}`);
        });

        await page.goto(this._url, { waitUntil: 'load' });

        // Create the Ghostly message proxy
        await (async (window: GhostlyWindow) => page.evaluate(([sendGhostlyMessage, domPurifyJS]) => {
            try {
                window.__ghostly_message_proxy__ = window.open('', '', 'width=0,height=0') as GhostlyProxyWindow;
                window.__ghostly_message_proxy__.document.open().write(`<script type='text/javascript'>
                    ${domPurifyJS}
                    ${sendGhostlyMessage}
                </script>`);
                window.__ghostly_message_proxy__.document.close();
            }
            catch (_ignored) {
                throw new Error(`Failed to create Ghostly message proxy!`);
            }
        }, [sendGhostlyMessage.toString(), await domPurifyJS]))(null!);
        await this._sendMessage(page, ['ghostlyLoad', this._url], onGhostlyEvent);
        return page;
    }

    private async _sendMessage(page: Page, request: GhostlyRequest, onGhostlyEvent: OnGhostlyEvent | undefined): Promise<GhostlyTypes> {
        const response = await ((window: GhostlyWindow) => page.evaluate(([request, timeout]) => {
            try {
                const events: object[] = []; // Batch all events since I don't know how to propagate them in real-time

                return window.__ghostly_message_proxy__.sendGhostlyMessage(window, request, (data) => events.push(data), timeout)
                    .then((packet) => ({ packet, events}));
            }
            catch (err) {
                throw new Error(`Ghostly message proxy not found or it's failing: ${err}`);
            }
        }, [request, this._config.timeout] as const))(null!);

        response.events.forEach((event) => onGhostlyEvent?.(event));
        return parseGhostlyPacket(request, response.packet);
    }
}

export function browserVersion(browser: Browser): string {
    return `${browser.constructor.name}/${browser.version()}`;
}

export function deleteUndefined<T extends object>(obj: T): T {
    for (const prop in obj) {
        if (obj[prop] === undefined) {
            delete obj[prop];
        }
        else if (typeof obj[prop] === 'object') {
            deleteUndefined(obj[prop] as unknown as object);
        }
    }

    return obj;
}
