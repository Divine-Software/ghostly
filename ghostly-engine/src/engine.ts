import type { OnGhostlyEvent, View } from '@divine/ghostly-runtime/lib/src/types'; // Avoid DOM types leaks
import http from 'http';
import playwright from 'playwright-chromium';
import stream from 'stream';
import url from 'url';
import { browserVersion, TemplateEngineImpl, Worker } from './template';

const nullConsole = new console.Console(new stream.PassThrough());

export interface EngineConfig {
    browser:         string;
    logger:          Console;
    pageCache:       number;
    relaunchDelay:   number;
    templatePattern: RegExp;
    timeout:         number;
    workers:         number;
}

export interface RenderResult {
    type:         'attachment' | 'event' | 'view';
    contentType:  string;
    data:         Buffer;
    name?:        string;
    description?: string;
}

export interface HTTPRenderResult extends Omit<RenderResult, 'data'> {
    /** The result, base64-encoded */
    data: string;
}

export interface HTTPRenderRequest {
    template:     string;
    document:     string | object;
    contentType:  string;
    views:        View[];
    attachments?: boolean;
}

export type HTTPRenderResponse = HTTPRenderResult[];

export interface HTTPErrorResponse {
    message: string;
}

export interface TemplateEngine {
    render(document: string | object, contentType: string, format: string, params: unknown, onGhostlyEvent?: OnGhostlyEvent): Promise<Buffer>;
    renderViews(document: string | object, contentType: string, views: View[], attachments: boolean, onGhostlyEvent?: OnGhostlyEvent): Promise<RenderResult[]>;
}

export class Response {
    constructor(public status: number, public body: string | Buffer | RenderResult[], public headers?: http.OutgoingHttpHeaders) {}
}

export class Engine {
    private _config: EngineConfig;
    private _workers: (Worker | undefined)[];

    constructor(config: Partial<EngineConfig> = {}) {
        this._config = {
            timeout:         10,
            logger:          nullConsole,
            templatePattern: /.*/,
            browser:         'chromium',
            relaunchDelay:   1,
            workers:         1,
            pageCache:       0,
            ...config
        };

        this._workers = [];
    }

    get log(): Console {
        return this._config.logger;
    }

    async start(): Promise<this> {
        await this._launchWorkers(this._config.workers);
        return this;
    }

    async stop(): Promise<this> {
        for (const worker of this._workers) {
            if (worker) {
                try {
                    await worker.browser.close();
                }
                catch (err) {
                    this.log.warn(`Worker ${worker.id}: Failed to close browser: ${err}.`);
                }
            }
        }

        return this;
    }

    template(uri: string): TemplateEngine {
        uri = url.resolve(`file://${process.cwd()}/`, uri);

        if (!this._config.templatePattern.test(uri)) {
            throw new Error(`Template URL is not allowed: ${uri} did not match ${this._config.templatePattern}`);
        }

        return new TemplateEngineImpl(this._config, this._workers, uri);
    }

    // GET  http://localhost:9999/?template=http://.../foo.html&view=mime/type&params={json}&document=...&contentType=mime/type
    // POST http://localhost:9999/?template=http://.../foo.html&view=mime/type&params={json}
    // POST http://localhost:9999/
    async httpRequestHandler(request: http.IncomingMessage, response?: http.ServerResponse): Promise<Response> {
        let result: Response;

        try {
            result = await this.handleRequest(request);
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

        response?.writeHead(result.status, { 'Content-Type': 'application/json', ...result.headers });
        response?.end(body instanceof Buffer ? body : JSON.stringify(body));

        return result;
    }

    async handleRequest(request: http.IncomingMessage): Promise<Response> {
        let body: string | undefined;
        let views: View[];

        const uri = url.parse(request.url!, true);

        if (uri.pathname !== '/') {
            throw new Response(404, `Resource ${uri.pathname} not found`);
        }

        let template    = uri.query.template as string | undefined;
        let document    = uri.query.document as string | object | undefined;
        let contentType = (uri.query.contentType || 'application/json') as string;
        let view        = uri.query.view as string | undefined;
        let params      = uri.query.params && JSON.parse(uri.query.params as string) as unknown;
        let attachments = false;

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
            let message: HTTPRenderRequest;

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

            template    = message.template;
            document    = message.document;
            contentType = message.contentType || 'application/json';
            views       = message.views.map((view: View) => {
                const { contentType, params, dpi, paperSize, viewportSize } = view;
                return { contentType, params, dpi, paperSize, viewportSize };
            });
            attachments = message.attachments ?? false;
        }

        let tpl: TemplateEngine;

        try {
            tpl = this.template(template);
        }
        catch (ex) {
            throw new Response(403, ex.message);
        }

        const results = await tpl.renderViews(document as string | object, contentType, views, attachments, undefined);

        if (view) {
            const vr = results.filter((rr) => rr.type === 'view');

            if (vr.length !== 1) {
                throw new Error(`Expected 1 rendered view but got ${vr.length}`);
            }

            return new Response(200, results[0].data, { 'Content-Type': results[0].contentType });
        }
        else {
            return new Response(200, results);
        }
    }

    private async _launchWorkers(count: number): Promise<Worker[]> {
        const workers: Promise<Worker>[] = [];

        for (let id = 0; id < count; ++id) {
            workers.push(this._launchWorker(id));
        }

        return await Promise.all(workers);
    }

    private async _launchWorker(id: number): Promise<Worker> {
        if (this._workers[id]) {
            this.log.info(`Worker ${id}: Already connected to ${browserVersion(this._workers[id]!.browser)}`);
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
                this.log.error(`Worker ${id}: Disconnected. Re-launching in ${this._config.relaunchDelay} seconds.`);
                setTimeout(() => this._launchWorker(id), this._config.relaunchDelay * 1000);
            }
            else {
                this.log.info(`Worker ${id}: Closed.`);
            }
        });

        this.log.info(`Worker ${id}: Connected to ${browserVersion(browser)}`);

        return this._workers[id] = {
            id:        id,
            load:      0,
            browser:   browser,
            pageCache: [],
        };
    }
}
