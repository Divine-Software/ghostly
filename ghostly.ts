import childProcess from 'child_process';
import crypto       from 'crypto';
import fs           from 'mz/fs';
import http         from 'http';
import net          from 'net';
import os           from 'os';
import packageJSON  from './package.json';
import path         from 'path';
import stream       from 'stream';
import url          from 'url';

const nullConsole = new console.Console(new stream.PassThrough());
let log = nullConsole;

export interface EngineConfig {
    templatePattern: RegExp;
    phantomPath:     string;
    portBase?:       number;
    relaunchDelay:   number;
    tempDir:         string;
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
    output?:     string
}

export interface RenderedView {
    contentType: string;
    data: Buffer;
}

interface PhantomRenderResult {
    text?: string;
    binary?: string; // Base64-encoded
    file?: string;
}

export class Response {
    constructor(public status: number, public body: string | Buffer | RenderedView[], public headers?: http.OutgoingHttpHeaders) {}
}

interface Worker {
    counter: number;
    id:      number;
    key:     string;
    load:    number;
    port:    number;
    process: childProcess.ChildProcess;
}

export function logger(newLog?: Console | null): Console {
    try {
        return console;
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
            phantomPath:     'phantomjs',
            portBase:        undefined,
            relaunchDelay:   1,
            tempDir:         os.tmpdir(),
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
                worker.process.kill();
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
        let results: RenderedView[];

        try {
            tpl = this.template(template);
        }
        catch (ex) {
            throw new Response(403, ex.message);
        }

        if (views.some((view) => view.contentType === 'application/pdf')) { // PhantomJS can only render PDFs to disk
            results = await Engine.$withTempDir(`${this._config.tempDir}/${packageJSON.name}-`, (tempDir) => {
                views.forEach((view, idx) => {
                    if (view.contentType === 'application/pdf') {
                        view.output = `${tempDir}/${idx}.out`;
                    }
                });

                return tpl.$renderViews(document, contentType, views, null);
            });
        }
        else {
            results = await tpl.$renderViews(document, contentType, views, null);
        }

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

    static async $getRandomPort(): Promise<number> {
        try {
            return await new Promise<number>((resolve, reject) => {
                const server = net.createServer()
                    .on('error', (error) => {
                        reject(error);
                    });

                server.listen(0, () => {
                    let port = server.address().port;

                    server.close(() => {
                        resolve(port);
                    });
                });
            });
        }
        catch (_ex) {
            return Engine.$getRandomPort(); // Try again
        };
    }

    static async $withTempDir<T>(prefix: string, $fn: (path: string) => Promise<T>): Promise<T> {
        let tempDir = await fs.mkdtemp(prefix, 'utf8');

        try {
            return $fn(tempDir);
        }
        finally {
            await Engine.$rmr(tempDir);
        }
    }

    static async $rmr(node?: string): Promise<void> {
        if (node) {
            if ((await fs.stat(node)).isDirectory()) {
                for (const file of await fs.readdir(node)) {
                    await Engine.$rmr(path.join(node, file));
                }

                await fs.rmdir(node);
            }
            else {
                await fs.unlink(node);
            }
        }
    }

    /* private/internal */ async _$sendMessage(worker: Worker, message: unknown): Promise<unknown> {
        const payload = Buffer.from(JSON.stringify(message));

        try {
            ++worker.load;
            ++worker.counter;

            const [response, result] = await new Promise<[http.IncomingMessage, string]>((resolve, reject) => {
                const hmac = crypto.createHmac("sha256", worker.key)
                    .update([worker.counter, 'POST', '/', `localhost:${worker.port}`, 'application/json', payload].join('\n'))
                    .digest('hex');

                http.request({
                    port:    worker.port,
                    method:  'POST',
                    auth:    worker.counter + ':' + hmac,
                    headers: {
                        'Content-Type':   'application/json',
                        'Content-Length': payload.length,
                    },
                }, (response) => {
                    let result = '';

                    response.on('error', (error) => {
                        reject(error);
                    });

                    response.on('data', (data) => {
                        result += data;
                    });

                    response.on('end', () => {
                        resolve([response, result]);
                    });
                })
                .on('error', (error) => {
                    reject(error);
                })
                .end(payload);
            });

            if (!response.statusCode || response.statusCode >= 400 && response.statusCode < 500) {
                worker.process.kill();
                throw new Error(`Worker returned an unexpected error: ${response.statusCode} - ${result}`);
            }
            else if (response.statusCode < 200 || response.statusCode >= 300) {
                throw new Error(`Worker returned an error: ${response.statusCode} - ${result}`);
            }

            return response.headers['content-type'] == 'application/json' ? JSON.parse(result) : result;
        }
        catch (ex) {
            log.error(`Failed to send request to worker ${worker.id}: ${ex.message}`);
            throw ex;
        }
        finally {
            --worker.load;
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
            log.info(`Worker ${id} already running as PID ${this._workers[id]!.process.pid}`);
            return this._workers[id]!;
        }

        const port = this._config.portBase ? this._config.portBase + id : await Engine.$getRandomPort();
        const key  = crypto.randomBytes(24).toString('base64');
        const proc = childProcess.execFile(this._config.phantomPath, [
            '--web-security=false', path.join(__dirname, '..', 'phantomjs-template-renderer.js'), `127.0.0.1:${port}`, String(this._config.pageCache)
        ]);

        if (!proc.pid) {
            throw new Error(`Failed to launch ${this._config.phantomPath}`);
        }

        function cleanup_child() {
            proc.kill()
        }

        process.on('exit', cleanup_child);

        proc.on('exit', (code, signal) => {
            delete this._workers[id];

            process.removeListener('exit', cleanup_child);

            if (signal) {
                log.error(`Worker ${id} was killed by signal ${signal}. Re-launching in ${this._config.relaunchDelay} seconds.`);
                setTimeout(() => this._$launchWorker(id), this._config.relaunchDelay * 1000);
            }
            else if (code != 0) {
                log.warn(`Worker ${id} exitied with status ${code}. Re-launching in ${this._config.relaunchDelay} seconds.`);
                setTimeout(() => this._$launchWorker(id), this._config.relaunchDelay * 1000);
            }
            else {
                log.info(`Worker ${id} exited`);
            }
        });

        proc.stdout.on('data', (data) => { log.info(`Worker ${id}: ${String(data).trim()}`); });
        proc.stderr.on('data', (data) => { log.warn(`Worker ${id}: ${String(data).trim()}`); });

        // Send key to phantomjs-renderer.js
        proc.stdin.write(key + '\n');
        await new Promise((resolve) => proc.stdout.once('data', resolve));

        log.info(`Spawned worker ${id} as PID ${proc.pid}`);

        return this._workers[id] = {
            counter: 0,
            id:      id,
            key:     key,
            load:    0,
            port:    port,
            process: proc,
        };
    }
}

class Template {
    constructor(private _engine: Engine, private _url: string) {
    }

    async $render(document: unknown, contentType: string, format: string, params: unknown): Promise<Buffer> {
        return Engine.$withTempDir(`${this._engine._config.tempDir}/${packageJSON.name}-`, async (tempDir) => {
            return (await this.$renderViews(document, contentType, [{ contentType: format, params: params, output: `${tempDir}/default.out` }], null))[0].data;
        });
    }

    async $renderViews(document: unknown, contentType: string, views: View[], attachments: unknown): Promise<RenderedView[]> {
        const results = await this._engine._$sendMessage(this._engine._selectWorker(), {
            template: this._url,
            document: document,
            contentType: contentType,
            views: views,
            attachments: attachments,
        }) as PhantomRenderResult[];

        return await Promise.all(results.map(async (result, idx) => {
            const contentType = views[idx].contentType;

            if (result.text) {
                return { contentType, data: Buffer.from(result.text) };
            }
            else if (result.binary) {
                return { contentType, data: Buffer.from(result.binary, 'base64') };
            }
            else if (result.file) {
                return { contentType, data: await fs.readFile(result.file) };
            }
            else {
                throw new Error(`Incomplete result from PhantomJS: ${result}`);
            }
        }));
    }
}
