import { GhostlyRequest, parseGhostlyPacket, sendGhostlyMessage } from '@divine/ghostly-runtime';
import { PaperSize, View, ViewportSize } from '@divine/ghostly-runtime/lib/src/types'; // Avoid DOM types leaks
import { Browser, Page } from 'playwright-chromium';
import packageJSON from '../package.json';
import { Engine, RenderedView, TemplateEngine } from './engine';

export interface Worker {
    id:        number;
    load:      number;
    browser:   Browser;
    pageCache: (Page | undefined)[];
}

interface GhostlyProxyWindow extends Window {
    sendGhostlyMessage: typeof sendGhostlyMessage;
}

interface GhostlyWindow extends Window {
    __ghostly_message_proxy__: GhostlyProxyWindow
}

function deleteUndefined<T extends object>(obj: T): T {
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

export class TemplateEngineImpl implements TemplateEngine {
    constructor(private _engine: Engine, private _url: string) {
    }

    get log(): Console {
        return this._engine['_config'].logger;
    }

    async render(document: string | object, contentType: string, format: string, params: unknown): Promise<Buffer> {
        return (await this.renderViews(document, contentType, [{ contentType: format, params: params }], null))[0].data;
    }

    async renderViews(document: string | object, contentType: string, views: View[], _attachments: unknown): Promise<RenderedView[]> {
        const worker = this._selectWorker();
        const result = [] as RenderedView[];

        try {
            ++worker.load;

            // Find a cached template ...
            let page = worker.pageCache.find((page) => !!page && page.url() === this._url)!;

            try {
                if (page) {
                    this.log.info(`${this._url}: Using cached template.`);
                    delete worker.pageCache[worker.pageCache.indexOf(page)];
                }
                else {
                    // ... or create a new one
                    this.log.info(`${this._url}: Creating new template.`);
                    page = await this._createPage(worker);
                }

                // Send document/model to template
                await this._sendMessage(page, ['ghostlyInit', { document, contentType }]);

                // Render all views
                for (const view of deleteUndefined(views) /* Ensure undefined values do not overwrite defaults */) {
                    const dpi = view.dpi || 96;
                    const ps: Required<PaperSize> = { format: 'A4', orientation: 'portrait', ...view.paperSize };
                    const dim = this._paperDimensions(view.contentType === 'application/pdf' ? ps : view.paperSize, dpi)
                    const vps: Required<ViewportSize> = { ...dim, ...view.viewportSize };
                    const clip = view.viewportSize?.width || view.viewportSize?.height ? { x: 0, y: 0, ...vps } : undefined;

                    this.log.info(`${this._url}: Rendering view ${view.contentType} (${vps.width}x${vps.height} @ ${dpi} DPI).`);

                    await page.setViewportSize(vps);

                    let buffer: Buffer;
                    const data = await this._sendMessage(page, ['ghostlyRender', view]);

                    if (data instanceof Buffer) {
                        buffer = data;
                    }
                    else if (data instanceof Uint8Array) {
                        buffer = Buffer.from(data.buffer);
                    }
                    else if (typeof data === 'string') {
                        buffer = Buffer.from(data);
                    }
                    else if (!data) {
                        switch (view.contentType) {
                            case 'text/html':
                                buffer = Buffer.from(await page.content());
                                break;

                            case 'text/plain':
                                buffer = Buffer.from(await page.innerText('css=body'));
                                break;

                            case 'application/pdf':
                                buffer = await page.pdf({
                                    format:    ps.format,
                                    landscape: ps.orientation === 'landscape',
                                });
                                break;

                            case 'image/jpeg':
                                buffer = await page.screenshot({ fullPage: true, type: 'jpeg', clip });
                                break;

                            case 'image/png':
                                buffer = await page.screenshot({ fullPage: true, type: 'png', clip });
                                break;

                            default:
                                throw new Error(`Template ${page!.url()} did not return a result for view ${view.contentType}`)
                        }
                    }
                    else {
                        throw new Error(`Template ${page!.url()} returned an unexpected object ${view.contentType}: ${data}`)
                    }

                    result.push({ contentType: view.contentType, data: buffer });
                }

                // Return template to page cache if there were no errors
                for (let i = 0; i < this._engine['_config'].pageCache; ++i) {
                    if (!worker.pageCache[i]) {
                        this.log.info(`${page.url()}: Returning template to page cache.`);
                        worker.pageCache[i] = page;
                        page = undefined!;
                        break;
                    }
                }
            }
            finally {
                if (page) {
                    await page.close();
                }
            }
        }
        finally {
            --worker.load;
        }

        return result;
    }

    private _selectWorker(): Worker {
        let best: Worker | null = null;

        for (const worker of this._engine['_workers']) {
            if (worker && (!best || worker.load < best.load)) {
                best = worker;
            }
        }

        if (!best) {
            throw new Error(`No workers alive`);
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

    private async _createPage(worker: Worker): Promise<Page> {
        const page = await worker.browser.newPage({
            userAgent: `Ghostly/${packageJSON.version} ${browserVersion(worker.browser)}`,
        });

        await page.route('**/*', (route, req) => {
            this.log.debug(`${this._url}: Loading ${req.url()}`);

            if (this._engine['_config'].templatePattern.test(req.url())) {
                route.continue();
            }
            else {
                this.log.error(`${this._url}: Template accessed a disallowed URL: ${req.url()} did not match ${this._engine['_config'].templatePattern}`);
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
        await ((window: GhostlyWindow) => page.evaluate((sendGhostlyMessage) => {
            try {
                window.__ghostly_message_proxy__ = window.open('', '', 'width=0,height=0') as GhostlyProxyWindow;
                window.__ghostly_message_proxy__.document.open().write(`<script type='text/javascript'>${sendGhostlyMessage}</script>`);
                window.__ghostly_message_proxy__.document.close();
            }
            catch (_ignored) {
                throw 'Failed to create Ghostly message proxy!'
            }
        }, sendGhostlyMessage.toString()))(null!);

        await this._sendMessage(page, ['ghostlyLoad', this._url]);
        return page;
    }

    private async _sendMessage(page: Page, request: GhostlyRequest, timeout?: number): Promise<string | Uint8Array | null> {
        const response = await ((window: GhostlyWindow) => page.evaluate(([request, timeout]) => {
            try {
                return window.__ghostly_message_proxy__.sendGhostlyMessage(window, request, timeout);
            }
            catch (err) {
                throw `Ghostly message proxy not found or it's failing: ${err}`;
            }
        }, [request, timeout] as const))(null!);

        return parseGhostlyPacket(request, response);
    }
}

export function browserVersion(browser: Browser): string {
    return `${browser.constructor.name}/${browser.version()}`;
}
