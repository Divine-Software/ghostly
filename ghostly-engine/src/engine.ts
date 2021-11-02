import { GhostlyError, OnGhostlyEvent, View } from '@divine/ghostly-runtime/build/src/types'; // Avoid DOM types leaks
import { IncomingMessage, OutgoingHttpHeaders, ServerResponse } from 'http';
import playwright from 'playwright-chromium';
import stream from 'stream';
import url from 'url';
import { browserVersion, deleteUndefined, TemplateEngineImpl, Worker } from './template';

const nullConsole = new console.Console(new stream.PassThrough());

/** Ghostly Template configuration. */
export interface TemplateConfig {
    /** A `Console` to use for debug logging. */
    logger: Console;

    /** A regular expression that all template network requests must match, or else they will be forbidden. */
    templatePattern: RegExp;

    /** Timeout while waiting for a command response from the template. Defaults to 10 s.
     *
     *  NOTE: Any call by the template to [[ghostly.notify]] will reset the watchdog and start counting from 0 again!
     */
    timeout: number;
}

/** Ghostly Engine configuration. */
export interface EngineConfig extends TemplateConfig {
    /** What browser to use for rendering. Defaults to 'chromium'. */
    browser: 'chromium' | 'firefox' | 'webkit';

    /** Override browser executable path. */
    browserPath: string | null;

    /** Override the default browser locale. Defaults to system locale or `en-US`. */
    locale: string;

    /** If specified, the maximum number of cached templates to keep. */
    pageCache: number;

    /** Number of seconds to keep cached template around. Defaults to 60 seconds. */
    pageMaxAge: number;

    /** A delay (in seconds) to wait before attempting to restart a crashed browser. Defaults to 1 s. */
    relaunchDelay: number;

    /** Override the default browser time zone. Defaults to system time zone or `UTC`. */
    timeZone: string;

    /** The number of browser instances to launch. Defaults to 1. */
    workers: number;
}

/** A result part from the template. Returned when using the [[TemplateEngine]] API. */
export interface RenderResult {
    /** What kind of result this is. */
    type: 'attachment' | 'event' | 'view';

    /** The result's media type. */
    contentType: string;

    /** The result, as a Buffer. */
    data: Buffer;

    /** The name of the result, if present (*including* file extension). */
    name?: string;

    /** A descriptipn of the result, if present. */
    description?: string;
}

/** A result part from the template. Returned when using the HTTP API. */
export interface WSRenderResult extends Omit<RenderResult, 'data'> {
    /** The result, as a Base64-encoded string. */
    data: string;
}

/** The source document and parameters that should be rendered. */
export interface RenderRequest {
    /** The model to render, as a string or embedded JSON object. */
    document: string | object;

    /** The model's media type. Used when `document` is a string. */
    contentType: string;

    /** What views to render. */
    views: View[];

    /** Set to `true` if attachments, if any, should be generated as well. */
    attachments?: boolean;

    /** The locale to use when rendering. Defaults to the [[EngineConfig]] locale. */
    locale?: string;

    /** The time zone to use when rendering. Defaults to the [[EngineConfig]] time zone. */
    timeZone?: string;
}

/** The HTTP request message. */
export interface WSRenderRequest extends RenderRequest {
    /** URL to the template to use. */
    template: string;
}

/** The HTTP response message. */
export type WSRenderResponse = WSRenderResult[];

/** The HTTP response message if the HTTP status is not 2xx. */
export interface WSErrorResponse {
    message: string;
}

/** The Template Engine API. */
export interface TemplateEngine {
    /**
     * Render a single view from a model (with no attachments) and return the result as a `Buffer`.
     *
     * @param document        The model to render.
     * @param contentType     The model's media type.
     * @param format          The media type of the view to render (`text/html`, `image/png`, `application/pdf` ...).
     * @param params          Optional view params as parsed JSON.
     * @param onGhostlyEvent  Optional callback to invoke if the template emits an event using [[notify]].
     * @returns               A `Buffer` containing the rendered document.
     * @throws GhostlyError   Template-related errors.
     * @throws Error          Other internal errors.
     */
    render(document: string | object, contentType: string, format: string, params?: unknown, onGhostlyEvent?: OnGhostlyEvent): Promise<Buffer>;

    /**
     * Render multiple views and/or attachments from a model and return the results as a [[RenderResult]] array.
     *
     * @param request         Render parameters/options.
     * @param onGhostlyEvent  Optional callback to invoke if the template emits an event using [[notify]].
     * @returns               A `Buffer` containing the rendered document.
     * @throws GhostlyError   Template-related errors.
     * @throws Error          Other internal errors.
     */
     renderRequest(request: RenderRequest, onGhostlyEvent?: OnGhostlyEvent): Promise<RenderResult[]>;

    /**
     * Render multiple views and/or attachments from a model and return the results as a [[RenderResult]] array.
     *
     * @param document        The model to render.
     * @param contentType     The model's media type.
     * @param views           View definitions.
     * @param attachments     Set to `true` if you also want to render the attachments (if any).
     * @param onGhostlyEvent  Optional callback to invoke if the template emits an event using [[notify]].
     * @returns               A `Buffer` containing the rendered document.
     * @throws GhostlyError   Template-related errors.
     * @throws Error          Other internal errors.
     * @deprecated            Use [[renderRequest]] instead.
     */
    renderViews(document: string | object, contentType: string, views: View[], attachments: boolean, onGhostlyEvent?: OnGhostlyEvent): Promise<RenderResult[]>;
}

/** Holds an HTTP response (a result or an error). */
export class WSResponse {
    /** The HTTP status code. */
    public status: number;

    /** The response body (an error message, a `Buffer` or a [[RenderResult]] array). */
    public body: string | Buffer | RenderResult[];

    /** HTTP headers to send. Includes the `Content-Type` header. */
    public headers?: OutgoingHttpHeaders;

    /**
     * @private
     * @internal
     */
    constructor(status: number, body: string | Buffer | RenderResult[], headers?: OutgoingHttpHeaders) {
        this.status  = status;
        this.body    = body;
        this.headers = headers;
    }
}

/** The Ghostly Engine API. */
export class Engine {
    private _config: EngineConfig;
    private _workers: Worker[];
    private _cleaner?: NodeJS.Timeout;

    /**
     * Constructs a Ghostly Engine instance.
     *
     * @param config Optional Ghostly Engine configuration.
     */
    constructor(config: Partial<EngineConfig> = {}) {
        const intl = Intl.DateTimeFormat().resolvedOptions();

        this._config = {
            timeout:         10,
            logger:          nullConsole,
            templatePattern: /.*/,
            browser:         'chromium',
            browserPath:     null,
            relaunchDelay:   1,
            workers:         1,
            pageCache:       0,
            pageMaxAge:      60,
            locale:          intl.locale || 'en-US',
            timeZone:        intl.timeZone !== 'Etc/Unknown' && intl.timeZone || 'UTC',
            ...deleteUndefined(config)
        };

        this._workers = [];
    }

    private get log(): Console {
        return this._config.logger;
    }

    /**
     * Launch the configured number of browser instances and get ready for work.
     */
    async start(): Promise<this> {
        await this._launchWorkers(this._config.workers);

        this._cleaner = setInterval(() => {
            TemplateEngineImpl.purgeExpiredPages(this._workers, this._config);
        }, 1000).unref();

        return this;
    }

    /**
     * Close all running browser instances and clean up internal resources.
     */
    async stop(): Promise<this> {
        clearInterval(this._cleaner!);

        await Promise.all(this._workers.map(async (worker, index) => {
            try {
                delete this._workers[index];
                await worker?.browser.close();
            }
            catch (err) {
                this.log.warn(`Worker ${worker?.id}: Failed to close browser: ${err}.`);
            }
        }));

        return this;
    }

    /**
     * Create a [[TemplateEngine]] instance using the specified Ghostly template URL.
     *
     * @param uri    The URL of the Ghostly template to use.
     * @param config Optional [[TemplateConfig]] parameters to override from base [[EngineConfig]].
     */
    template(uri: string, templateConfig: Partial<TemplateConfig> = {}): TemplateEngine {
        const config = { ...this._config, ...deleteUndefined(templateConfig) };

        uri = url.resolve(`file://${process.cwd()}/`, uri);

        if (!config.templatePattern.test(uri)) {
            throw new GhostlyError(`Template URL is not allowed: ${uri} did not match ${config.templatePattern}`);
        }

        return new TemplateEngineImpl(config, this._workers, uri);
    }

    /**
     * Handle an incoming HTTP request and serialize the result accordingly.
     *
     * This method can either be used directly as a Node.js HTTP `RequestListener`, or as a utility method. If
     * `response` is specified, the result will be serialized as `Buffer`/[[WSRenderResponse]]/[[WSErrorResponse]],
     * depending on the request and its outcome. In either case, the raw [[WSResponse]] will be returned as well.
     *
     * The Web Service/HTTP interface supports three different processing modes:
     *
     * 1.  `GET` requests. The following query parameters should be specified:
     *     * `template`:    URL of template to render.
     *     * `view`:        Media type of view to render.
     *     * `params`:      Optional view params as (URL-encoded) JSON.
     *     * `document`:    The model to render, as a string.
     *     * `contentType`: The model's media type.
     *
     *     The response will be the rendered view.
     *
     * 2.  `POST` requests that includes a `template` query parameter:
     *     * `template`:    URL of template to render.
     *     * `view`:        Media type of view to render.
     *     * `params`:      Optional view params as (URL-encoded) JSON.
     *
     *     The request body should be the model. The response will be the rendered view.
     *
     * 3.  `POST` request with no query parameters.
     *
     *     The request body should be a JSON-encoded [[WSRenderRequest]] message, and the response(s) will be returned
     *     as [[WSRenderResponse]], i.e. a [[WSRenderResult]] array, which can also include attachments and events
     *     emitted from the template.
     *
     * @param request   The Node.js HTTP request to handle.
     * @param response  If specified, the response will be serialized and written to this `ServerResponse` object.
     * @param pathName  The URL path to match. Defaults to '/'.
     * @returns         A [[WSResponse]] representation of the result.
     *
     * @see [[WSRenderRequest]]
     * @see [[WSRenderResponse]]
     * @see [[WSRenderResult]]
     * @see [[WSErrorResponse]]
     */
    async httpRequestHandler(request: IncomingMessage, response?: ServerResponse, pathName?: string): Promise<WSResponse> {
        let result: WSResponse;

        try {
            result = await this._handleRequest(request, pathName);
        }
        catch (ex: any) {
            result = ex instanceof WSResponse ? ex : new WSResponse(500, ex.message || `Unknown error: ${ex}`);
        }

        if (response) {
            let body: object;

            if (typeof result.body !== 'object') {
                body = { message: String(result.body) };
            }
            else if (result.body instanceof Array) {
                body = result.body.map<WSRenderResult>((rr) => ({
                    type:        rr. type,
                    contentType: rr.contentType,
                    data:        rr.data.toString('base64'),
                    name:        rr.name,
                    description: rr.description,
                }));
            }
            else {
                body = result.body;
            }

            response.writeHead(result.status, { 'Content-Type': 'application/json', ...result.headers });
            response.end(body instanceof Buffer ? body : JSON.stringify(body));
        }

        return result;
    }

    private async _handleRequest(request: IncomingMessage, pathName = '/'): Promise<WSResponse> {
        let body: string | undefined;
        let views: View[];

        const uri = url.parse(request.url!, true);

        if (uri.pathname !== pathName) {
            throw new WSResponse(404, `Resource ${uri.pathname} not found`);
        }

        let template    = uri.query['template'] as string | undefined;
        let document    = uri.query['document'] as string | object | undefined;
        let contentType = (uri.query['contentType'] || 'application/json') as string;
        let view        = uri.query['view'] as string | undefined;
        let params      = uri.query['params'] && JSON.parse(uri.query['params'] as string) as unknown;
        let attachments = false;
        let locale      = undefined as string | undefined;
        let timeZone    = undefined as string | undefined;

        if (request.method !== 'GET' && request.method !== 'HEAD' && request.method !== 'POST') {
            throw new WSResponse(405, 'Only GET, HEAD and POST requests are accepted');
        }

        if ((request.method === 'GET' || request.method === 'HEAD') && (!template || !document || !view)) {
            throw new WSResponse(400, `GET/HEAD requests must supply at least the 'template', 'document' and 'view' query params`);
        }

        if (request.method === 'POST' && document) {
            throw new WSResponse(400, `POST requests must not supply the 'document' query param`);
        }

        if (!!template !== !!view) {
            throw new WSResponse(400, `The 'template' and 'view' query params must be specified together`);
        }

        if (!template && params) {
            throw new WSResponse(400, `The 'params' query param may only be specified if 'template' is too`);
        }

        if (request.method === 'POST') {
            contentType = request.headers['content-type'] as string;

            if (!contentType) {
                throw new WSResponse(400, 'Missing Content-Type request header');
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
            let message: WSRenderRequest;

            if (contentType !== 'application/json') {
                throw new WSResponse(415, `Only application/json requests are accepted when the 'template' query param is missing`);
            }

            try {
                message = JSON.parse(body as string);
            }
            catch (ex) {
                throw new WSResponse(400, `Failed to parse body as JSON: ${ex}`);
            }

            if (typeof message !== 'object' || message instanceof Array) {
                throw new WSResponse(422, 'Expected a JSON object');
            }

            if (typeof message.template !== 'string') {
                throw new WSResponse(422, `The 'template' JSON property is required and should be a string`);
            }
            else if (!(message.views instanceof Array)) {
                throw new WSResponse(422, `The 'views' JSON property is required and should be an array`);
            }

            template    = message.template;
            document    = message.document;
            contentType = message.contentType || 'application/json';
            locale      = message.locale;
            timeZone    = message.timeZone;
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
        catch (ex: any) {
            throw new WSResponse(403, ex.message);
        }

        try {
            const results = await tpl.renderRequest({ document: document!, contentType, views, attachments, locale, timeZone }, undefined);

            if (view) {
                const vr = results.filter((rr) => rr.type === 'view');

                if (vr.length !== 1) {
                    throw new Error(`Expected 1 rendered view but got ${vr.length}`);
                }

                return new WSResponse(200, results[0]!.data, { 'Content-Type': results[0]!.contentType });
            }
            else {
                return new WSResponse(200, results);
            }
        }
        catch (ex: any) {
            throw new WSResponse(500, ex instanceof GhostlyError ? `${ex.message}: ${JSON.stringify(ex.data)}` : ex.message);
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

        const browserType = playwright[this._config.browser];

        if (!browserType || typeof browserType.launch !== 'function') {
            throw new Error(`Unsupported browser ${this._config.browser}`);
        }

        const browser = await browserType.launch({
            executablePath: this._config.browserPath ?? undefined
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
