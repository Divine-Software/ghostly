import { GhostlyRequest, parseGhostlyPacket, sendGhostlyMessage } from '@divine/ghostly-runtime';
import type { PaperSize, View, ViewportSize } from '@divine/ghostly-runtime/lib/src/types'; // Avoid DOM types leaks
import http from 'http';
import playwright, { Browser, Page } from 'playwright-chromium';
import stream from 'stream';
import url from 'url';
import packageJSON from '../package.json';

export { Model, PaperFormat, PaperSize, View, ViewportSize } from '@divine/ghostly-runtime/lib/src/types'; // Avoid DOM types leaks

const nullConsole = new console.Console(new stream.PassThrough());
let log = nullConsole;

export interface EngineConfig {
    templatePattern: RegExp;
    browser:         string;
    relaunchDelay:   number;
    workers:         number;
    pageCache:       number;
}

export interface RenderedView {
    contentType: string;
    data:        Buffer;
}

export class Response {
    constructor(public status: number, public body: string | Buffer | RenderedView[], public headers?: http.OutgoingHttpHeaders) {}
}

interface Worker {
    id:        number;
    load:      number;
    browser:   Browser;
    pageCache: (Page | undefined)[];
}

type GhostlyResponse = ['ghostlyACK' | 'ghostlyNACK', string | null, 'Uint8Array'? ];

interface GhostlyProxyWindow extends Window {
    sendGhostlyMessage: typeof sendGhostlyMessage;
}

interface GhostlyWindow extends Window {
    __ghostly_message_proxy__: GhostlyProxyWindow
}

export function logger(newLog?: Console | null): Console {
    try {
        return log;
    }
    finally {
        if (newLog !== undefined) log = newLog || nullConsole;
    }
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

function browserVersion(browser: Browser): string {
    return `${browser.constructor.name}/${browser.version()}`;
}

export class Engine {
    private _config: EngineConfig;
    private _workers: (Worker | undefined)[];

    constructor(config: Partial<EngineConfig> = {}) {
        this._config = {
            templatePattern: /.*/,
            browser:         'chromium',
            relaunchDelay:   1,
            workers:         1,
            pageCache:       0,
            ...config
        };

        this._workers = [];
    }

    async $start(): Promise<this> {
        await this._$launchWorkers(this._config.workers);
        return this;
    }

    async $stop(): Promise<this> {
        for (const worker of this._workers) {
            if (worker) {
                try {
                    await worker.browser.close();
                }
                catch (err) {
                    log.warn(`Worker ${worker.id}: Failed to close browser: ${err}.`);
                }
            }
        }

        return this;
    }

    template(uri: string): Template {
        uri = url.resolve(`file://${process.cwd()}/`, uri);

        if (!this._config.templatePattern.test(uri)) {
            throw new Error(`Template URL is not allowed: ${uri} did not match ${this._config.templatePattern}`);
        }

        return new Template(this, uri);
    }

    // GET  http://localhost:9999/?template=http://.../foo.html&view=mime/type&params={json}&document=...&contentType=mime/type
    // POST http://localhost:9999/?template=http://.../foo.html&view=mime/type&params={json}
    // POST http://localhost:9999/
    httpRequestHandler(request: http.IncomingMessage, response: http.ServerResponse) {
        this.$httpRequestHandler(request, response);
    }

    async $httpRequestHandler(request: http.IncomingMessage, response: http.ServerResponse): Promise<Response> {
        let result: Response;

        try {
            result = await this.$handleRequest(request);
        }
        catch (ex) {
            result = ex instanceof Response ? ex : new Response(500, ex.message || `Unknown error: ${ex}`);
        }

        let body: object;

        if (typeof result.body !== 'object') {
            body = { message: String(result.body) };
        }
        else if (result.body instanceof Array) {
            body = result.body.map((rr) => ({ contentType: rr.contentType, data: rr.data.toString('base64') }));
        }
        else {
            body = result.body;
        }

        response.writeHead(result.status, { 'Content-Type': 'application/json', ...result.headers });
        response.end(body instanceof Buffer ? body : JSON.stringify(body));

        return result;
    }

    async $handleRequest(request: http.IncomingMessage): Promise<Response> {
        let body: string | undefined;
        let views: View[];

        const uri = url.parse(request.url!, true);

        if (uri.pathname !== '/') {
            throw new Response(404, `Resource ${uri.pathname} not found`);
        }

        let template    = uri.query.template as string | undefined;
        let document    = uri.query.document as string | undefined;
        let contentType = (uri.query.contentType || 'application/json') as string;
        let view        = uri.query.view as string | undefined;
        let params      = uri.query.params && JSON.parse(uri.query.params as string) as unknown;

        if (request.method !== 'GET' && request.method !== 'HEAD' && request.method !== 'POST') {
            throw new Response(405, 'Only GET, HEAD and POST requests are accepted');
        }

        if ((request.method === 'GET' || request.method === 'HEAD') && (!template || !document || !view)) {
            throw new Response(400, `GET/HEAD requests must supply at least the 'template', 'document' and 'view' query params`);
        }

        if (request.method === 'POST' && document) {
            throw new Response(400, `POST requests must not supply the 'document' query param`);
        }

        if (!!template !== !!view) {
            throw new Response(400, `The 'template' and 'view' query params must be specified together`);
        }

        if (!template && params) {
            throw new Response(400, `The 'params' query param may only be specified if 'template' is too`);
        }

        if (request.method === 'POST') {
            contentType = request.headers['content-type'] as string;

            if (!contentType) {
                throw new Response(400, 'Missing Content-Type request header');
            }

            body = await new Promise<string>((resolve, reject) => {
                let data = '';

                request.on('data', (chunk) => {
                    data += chunk;
                });

                request.on('end', () => {
                    resolve(data);
                });

                request.on('error', (error) => {
                    reject(error);
                });
            });
        }

        if (template) {
            document = document || body;
            views    = [{ contentType: view!, params: params }];
        }
        else {
            let message;

            if (contentType !== 'application/json') {
                throw new Response(415, `Only application/json requests are accepted when the 'template' query param is missing`);
            }

            try {
                message = JSON.parse(body as string);
            }
            catch (ex) {
                throw new Response(400, `Failed to parse body as JSON: ${ex}`);
            }

            if (typeof message !== 'object' || message instanceof Array) {
                throw new Response(422, 'Expected a JSON object');
            }

            if (typeof message.template !== 'string') {
                throw new Response(422, `The 'template' JSON property is required and should be a string`);
            }
            else if (!(message.views instanceof Array)) {
                throw new Response(422, `The 'views' JSON property is required and should be an array`);
            }

            template    = message.template as string;
            document    = message.document;
            contentType = message.contentType || 'application/json';
            views       = message.views.map((view: View) => {
                const { contentType, params, dpi, paperSize, viewportSize } = view;
                return { contentType, params, dpi, paperSize, viewportSize };
            });
        }

        let tpl: Template;

        try {
            tpl = this.template(template);
        }
        catch (ex) {
            throw new Response(403, ex.message);
        }

        const results = await tpl.$renderViews(document as string | object, contentType, views, null);

        if (view) {
            if (results.length !== 1) {
                throw new Error(`Expected 1 result but got ${results.length}`);
            }

            return new Response(200, results[0].data, { 'Content-Type': results[0].contentType });
        }
        else {
            return new Response(200, results);
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
            throw new Error(`No workers alive`);
        }

        return best;
    }

    private async _$launchWorkers(count: number): Promise<Worker[]> {
        const workers: Promise<Worker>[] = [];

        for (let id = 0; id < count; ++id) {
            workers.push(this._$launchWorker(id));
        }

        return await Promise.all(workers);
    }

    private async _$launchWorker(id: number): Promise<Worker> {
        if (this._workers[id]) {
            log.info(`Worker ${id}: Already connected to ${browserVersion(this._workers[id]!.browser)}`);
            return this._workers[id]!;
        }

        const [ type, ...path ] = this._config.browser.split(':');
        const browserType = playwright[type as 'chromium' | 'firefox' | 'webkit']

        if (!browserType || typeof browserType.launch !== 'function') {
            throw new Error(`Unsupported browser ${this._config.browser}`);
        }

        const browser = await browserType.launch({
            executablePath: path.join(':'),
        });

        browser.on('disconnected', () => {
            if (this._workers[id]) {
                delete this._workers[id];
                log.error(`Worker ${id}: Disconnected. Re-launching in ${this._config.relaunchDelay} seconds.`);
                setTimeout(() => this._$launchWorker(id), this._config.relaunchDelay * 1000);
            }
            else {
                log.info(`Worker ${id}: Closed.`);
            }
        });

        log.info(`Worker ${id}: Connected to ${browserVersion(browser)}`);

        return this._workers[id] = {
            id:        id,
            load:      0,
            browser:   browser,
            pageCache: [],
        };
    }
}

class Template {
    constructor(private _engine: Engine, private _url: string) {
    }

    async $render(document: string | object, contentType: string, format: string, params: unknown): Promise<Buffer> {
        return (await this.$renderViews(document, contentType, [{ contentType: format, params: params }], null))[0].data;
    }

    async $renderViews(document: string | object, contentType: string, views: View[], _attachments: unknown): Promise<RenderedView[]> {
        const worker = this._engine['_selectWorker']();
        const result = [] as RenderedView[];

        try {
            ++worker.load;

            // Find a cached template ...
            let page = worker.pageCache.find((page) => !!page && page.url() === this._url)!;

            try {
                if (page) {
                    log.info(`${this._url}: Using cached template.`);
                    delete worker.pageCache[worker.pageCache.indexOf(page)];
                }
                else {
                    // ... or create a new one
                    log.info(`${this._url}: Creating new template.`);
                    page = await this._$createPage(worker);
                }

                // Send document/model to template
                await this._$sendMessage(page, ['ghostlyInit', { document, contentType }]);

                // Render all views
                for (const view of deleteUndefined(views) /* Ensure undefined values do not overwrite defaults */) {
                    const dpi = view.dpi || 96;
                    const ps: Required<PaperSize> = { format: 'A4', orientation: 'portrait', ...view.paperSize };
                    const dim = Template.paperDimensions(view.contentType === 'application/pdf' ? ps : view.paperSize, dpi)
                    const vps: Required<ViewportSize> = { ...dim, ...view.viewportSize };
                    const clip = view.viewportSize?.width || view.viewportSize?.height ? { x: 0, y: 0, ...vps } : undefined;

                    log.info(`${this._url}: Rendering view ${view.contentType} (${vps.width}x${vps.height} @ ${dpi} DPI).`);

                    await page.setViewportSize(vps);

                    let buffer: Buffer;
                    const data = await this._$sendMessage(page, ['ghostlyRender', view]);

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
                        log.info(`${page.url()}: Returning template to page cache.`);
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

    public static paperDimensions(paperSize: PaperSize | undefined, dpi: number): Required<ViewportSize> {
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

    private async _$createPage(worker: Worker): Promise<Page> {
        const page = await worker.browser.newPage({
            userAgent: `Ghostly/${packageJSON.version} ${browserVersion(worker.browser)}`,
        });

        await page.route('**/*', (route, req) => {
            log.debug(`${this._url}: Loading ${req.url()}`);

            if (this._engine['_config'].templatePattern.test(req.url())) {
                route.continue();
            }
            else {
                log.error(`${this._url}: Template accessed a disallowed URL: ${req.url()} did not match ${this._engine['_config'].templatePattern}`);
                route.abort('addressunreachable');
            }
        });

        page.on('pageerror', (error) => {
            log.error(`${this._url}: [pageerror]: ${error}`);
        });

        page.on('dialog', (dialog) => {
            log.warn(`${this._url}: [${dialog.type()}] ${dialog.message()}`)
            dialog.dismiss();
        });

        page.on('console', (msg) => {
            const method = (log as any)[msg.type()];
            (typeof method === 'function' ? method : log.warn).call(log, `${this._url}: [console] ${msg.text()}`);
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

        await this._$sendMessage(page, ['ghostlyLoad', this._url]);
        return page;
    }

    private async _$sendMessage(page: Page, request: GhostlyRequest, timeout?: number): Promise<string | Uint8Array | null> {
        const response = await ((window: GhostlyWindow) => page.evaluate(([request, timeout]) => {
            try {
                return window.__ghostly_message_proxy__.sendGhostlyMessage(window, request, timeout);
            }
            catch (err) {
                throw `Ghostly message proxy not found or it's failing: ${err}`;
            }
        }, [request, timeout] as const))(null!) as GhostlyResponse;

        return parseGhostlyPacket(request, response);
    }
}
