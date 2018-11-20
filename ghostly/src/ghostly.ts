import http         from 'http';
import packageJSON  from '../package.json';
import puppeteer    from 'puppeteer-core';
import stream       from 'stream';
import url          from 'url';

const nullConsole = new console.Console(new stream.PassThrough());
let log = nullConsole;

export interface EngineConfig {
    templatePattern: RegExp;
    chromiumPath:    string;
    relaunchDelay:   number;
    workers:         number;
    pageCache:       number;
}

interface SafeView {
    contentType: string;
    params:      unknown;
}

export interface View {
    contentType: string;
    params:      unknown;
}

export interface RenderedView {
    contentType: string;
    data: Buffer;
}

export class Response {
    constructor(public status: number, public body: string | Buffer | RenderedView[], public headers?: http.OutgoingHttpHeaders) {}
}

interface Worker {
    id:        number;
    load:      number;
    browser:   puppeteer.Browser;
    pageCache: (puppeteer.Page | undefined)[];
}

type GhostlyResponse = ['ghostlyACK' | 'ghostlyNACK', string | null, 'Uint8Array'? ];

interface GhostlyProxyWindow extends Window {
    sendMessage(command: string, data: unknown, timeout?: number): Promise<GhostlyResponse>;
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

export class Engine {
    /* private/internal */ _config: EngineConfig;
    private _workers: (Worker | undefined)[];

    constructor(config: Partial<EngineConfig> = {}) {
        this._config = {
            templatePattern: /.*/,
            chromiumPath:    puppeteer.executablePath(),
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
                    log.warn(`Failed to close worker ${worker.id}: ${err}.`);
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

        let uri = url.parse(request.url!, true);

        if (uri.pathname !== '/') {
            throw new Response(404, `Resource ${uri.pathname} not found`);
        }

        let template    = uri.query.template as string | undefined;
        let document    = uri.query.document as unknown;
        let contentType = (uri.query.contentType || 'application/json') as string;
        let view        = uri.query.view as string | undefined;
        let params      = uri.query.params && JSON.parse(uri.query.params) as unknown;

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
            document    = message.document as unknown;
            contentType = message.contentType || 'application/json';
            views       = message.views.map((view: SafeView) => ({ contentType: String(view.contentType), params: view.params }));
        }

        let tpl: Template;

        try {
            tpl = this.template(template);
        }
        catch (ex) {
            throw new Response(403, ex.message);
        }

        const results = await tpl.$renderViews(document, contentType, views, null);

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

    /* private/internal */ _selectWorker(): Worker {
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
            log.info(`Worker ${id} already running as PID ${this._workers[id]!.browser.process().pid}`);
            return this._workers[id]!;
        }

        const browser = await puppeteer.launch({
            executablePath: this._config.chromiumPath,
        });

        const proc = browser.process();

        proc.on('exit', (code, signal) => {
            delete this._workers[id];

            if (signal && signal !== 'SIGINT') {
                log.error(`Worker ${id} was killed by signal ${signal}. Re-launching in ${this._config.relaunchDelay} seconds.`);
                setTimeout(() => this._$launchWorker(id), this._config.relaunchDelay * 1000);
            }
            else if (code) {
                log.warn(`Worker ${id} exitied with status ${code}. Re-launching in ${this._config.relaunchDelay} seconds.`);
                setTimeout(() => this._$launchWorker(id), this._config.relaunchDelay * 1000);
            }
            else {
                log.info(`Worker ${id} ${signal === 'SIGINT' ? 'interrupted': 'exited'}.`);
            }
        });

        proc.stdout.on('data', (data) => { log.info(`Worker ${id}: ${String(data).trim()}`); });
        //proc.stderr.on('data', (data) => { log.warn(`Worker ${id}: ${String(data).trim()}`); });

        log.info(`Spawned worker ${id} as PID ${proc.pid}`);

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

    async $render(document: unknown, contentType: string, format: string, params: unknown): Promise<Buffer> {
        return (await this.$renderViews(document, contentType, [{ contentType: format, params: params }], null))[0].data;
    }

    async $renderViews(document: unknown, contentType: string, views: View[], _attachments: unknown): Promise<RenderedView[]> {
        const worker = this._engine._selectWorker();
        const result = [] as RenderedView[];

        try {
            ++worker.load;

            // Find a cached template ...
            let page = worker.pageCache.find((page) => !!page && page.url() === this._url);

            try {
                if (page) {
                    log.info(`Using cached template ${this._url}.`);
                    delete worker.pageCache[worker.pageCache.indexOf(page)];
                }
                else {
                    // ... or create a new one
                    log.info(`Creating template ${this._url}.`);
                    page = await this._$createPage(worker);
                    log.info(`Created template ${this._url}.`);
                }

                // Send document/model to template
                await this._$sendMessage(page, 'ghostlyInit', { document, contentType });

                // Render all views
                for (const view of views) {
                    let buffer = await this._$sendMessage(page, 'ghostlyRender', { contentType: view.contentType, params: view.params });

                    if (!buffer) {
                        switch (view.contentType) {
                            case 'text/html':
                                buffer = Buffer.from(await page.content());
                                break;

                            case 'application/pdf':
                                buffer = await page.pdf({format: "A4", preferCSSPageSize: true, });
                                break;

                            case 'image/jpeg':
                                buffer = await page.screenshot({ fullPage: true, type: 'jpeg' });
                                break;

                            case 'image/png':
                                buffer = await page.screenshot({ fullPage: true, type: 'png' });
                                break;

                            default:
                                throw new Error(`Template ${page!.url()} did not return a result for view ${view.contentType}`)
                        }
                    }

                    result.push({ contentType: view.contentType, data: buffer });
                }

                // Return template to page cache if there were no errors
                for (let i = 0; i < this._engine._config.pageCache; ++i) {
                    if (!worker.pageCache[i]) {
                        log.info(`Returning template ${page!.url()} to page cache.`);
                        worker.pageCache[i] = page;
                        page = undefined;
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

    private async _$createPage(worker: Worker): Promise<puppeteer.Page> {
        const page = await (await worker.browser.createIncognitoBrowserContext()).newPage();

        page.setUserAgent(`${packageJSON.name}/${packageJSON.version}`);
        page.setRequestInterception(true);

        page.on('request', (req) => {
            log.debug(`${this._url}: Loading ${req.url()}`);

            if (this._engine._config.templatePattern.test(req.url())) {
                req.continue();
            }
            else {
                log.error(`${this._url}: Template accessed a disallowed URL: ${req.url()} did not match ${this._engine._config.templatePattern}`);
                req.abort();
            }
        });

        page.on('dialog', (dialog) => {
            log.warn(`${this._url}: [${dialog.type()}] ${dialog.message()}`)
            dialog.dismiss();
        });

        page.on('console', msg => {
            const method: Function = (log as any)[msg.type()];
            (typeof method === 'function' ? method : log.warn).call(log, `${this._url}: ${msg.text()}`);
        });

        await page.goto(this._url);

        // Create the Ghostly message proxy
        await ((window: GhostlyWindow, document: Document) => page.evaluate(() => {
            try {
                window.__ghostly_message_proxy__ = window.open('', '', 'width=0,height=0') as GhostlyProxyWindow;
                window.__ghostly_message_proxy__.document.open().write(`<script type='text/javascript'>${
                    function sendMessage(command: string, data: unknown, timeout?: number): Promise<GhostlyResponse> {
                        return new Promise((resolve, reject) => {
                            const watchdog = setTimeout(() => {
                                window.onmessage = null;
                                reject(`Ghostly command ${command} timed out`);
                            }, (timeout || 10) * 1000);

                            window.onmessage = (event) => {
                                const response = event.data as GhostlyResponse | [GhostlyResponse[0], Uint8Array];

                                clearTimeout(watchdog);
                                window.onmessage = null;

                                if (response && response[1] instanceof Uint8Array) {
                                    // No Uint8Array support in Puppeteer
                                    let buffer = '';

                                    for (let i = 0, array = response[1]; i < array.length; ++i) {
                                        buffer += String.fromCharCode(array[i]);
                                    }

                                    resolve([response[0], buffer, 'Uint8Array']);
                                }
                                else if (response && !response[1] && command === 'ghostlyRender' && (data as View).contentType === 'text/plain') {
                                    // No easy way to get document as text in Puppeteer
                                    resolve([response[0], document.body.innerText]);
                                }
                                else {
                                    resolve(response as GhostlyResponse);
                                }
                            };

                            window.opener.postMessage([command, data], '*');
                        });
                    }
                }</script>`);
                window.__ghostly_message_proxy__.document.close();
            }
            catch (_ignored) {
                throw 'Failed to create Ghostly message proxy!'
            }
        }))(null!, null!);

        await this._$sendMessage(page, 'ghostlyLoad', this._url);
        return page;
    }

    private async _$sendMessage(page: puppeteer.Page, command: string, data: object | string, timeout?: number): Promise<Buffer | null> {
        const response = await ((window: GhostlyWindow) => page.evaluate((command, data, timeout) => {
            try {
                return window.__ghostly_message_proxy__.sendMessage(command, data, timeout);
            }
            catch (_ignored) {
                throw 'Ghostly message proxy not found!';
            }
        }, command, data, timeout))(null!) as GhostlyResponse;

        if (response[0] !== 'ghostlyACK') {
            throw new Error(`${command} failed: ${response[1]}`);
        }
        else if (typeof response[1] === 'string' && response[2] === 'Uint8Array') {
            return Buffer.from(response[1], 'latin1');
        }
        else {
            return response[1] ? Buffer.from(response[1]) : null;
        }
    }
}
