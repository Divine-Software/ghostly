
'use strict'

const childProcess = require('child_process');
const crypto       = require('crypto');
const fs           = require('fs');
const http         = require('http');
const net          = require('net');
const os           = require('os');
const packageJSON  = require('./package.json');
const path         = require('path');
const stream       = require('stream');
const url          = require('url');

var logger;

exports.logger = function(log) {
    try {
        return logger;
    }
    finally {
        if (log !== undefined) logger = log || new console.Console(stream.PassThrough());
    }
}

exports.logger(null);

class Engine {
    constructor(config) {
        this._config = Object.assign({
            templatePattern: /.*/,
            phantomPath:     'phantomjs',
            portBase:        null,
            relaunchDelay:   1,
            tempDir:         os.tmpdir(),
            workers:         1,
            pageCache:       0,
        }, config);
        this._workers = [];
    }

    $start() {
        return this._$launchWorkers(this._config.workers)
            .then(() => this);
    }

//    $stop() {
//        this._workers.forEach((w) => w.process.kill());
//    }

    template(uri) {
        uri = url.resolve(`file://${process.cwd()}/`, uri);

        if (!this._config.templatePattern.test(uri)) {
            throw new Error(`Template URL is not allowed: ${uri} did not match ${this._config.templatePattern}`);
        }

        return new Template(this, uri);
    }

    // GET  http://localhost:9999/?template=http://.../foo.html&view=mime/type&params={json}&document=...&contentType=mime/type
    // POST http://localhost:9999/?template=http://.../foo.html&view=mime/type&params={json}
    // POST http://localhost:9999/
    httpRequestHandler(request, response) {
        let template, document, contentType, views;

        Promise.resolve()
            .then(() => {
                let uri = url.parse(request.url, true);

                if (uri.pathname === '/') {
                    template    = uri.query.template;
                    document    = uri.query.document;
                    contentType = uri.query.contentType || 'application/json';

                    let view    = uri.query.view;
                    let params  = uri.query.params && JSON.parse(uri.query.params);

                    if (request.method !== 'GET' && request.method !== 'HEAD' && request.method !== 'POST') {
                        throw [405, 'Only GET, HEAD and POST requests are accepted'];
                    }

                    if ((request.method === 'GET' || request.method === 'HEAD') && (!template || !document || !view)) {
                        throw [400, `GET/HEAD requests must supply at least the 'template', 'document' and 'view' query params`];
                    }

                    if (request.method === 'POST' && document) {
                        throw [400, `POST requests must not supply the 'document' query param`];
                    }

                    if (!!template !== !!view) {
                        throw [400, `The 'template' and 'view' query params must be specified together`];
                    }

                    if (!template && params) {
                        throw [400, `The 'params' query param may only be specified if 'template' is too`];
                    }

                    if (view) {
                        views = [{ contentType: view, params: params }];
                    }
                }
                else {
                    throw [404, `Resource ${resource.pathname} not found`];
                }

                if (request.method === 'POST') {
                    return request.body || new Promise((resolve, reject) => {
                        let body = '';

                        request.on('data', (data) => {
                            body += data;
                        });

                        request.on('end', () => {
                            resolve(body);
                        });

                        request.on('error', (error) => {
                            reject(error);
                        });
                    });
                }
            })
            .then((body) => {
                let returnCT = template && views[0].contentType;

                if (!document && !request.headers['content-type']) {
                    throw [400, 'Missing Content-Type request header'];
                }

                if (template && !document) {
                    document    = body;
                    contentType = request.headers['content-type'];
                }
                else if (!template) {
                    if (request.headers['content-type'] !== 'application/json') {
                        throw [415, `Only application/json requests are accepted when the 'template' query param is missing`];
                    }

                    try {
                        body = JSON.parse(body);
                    }
                    catch (ex) {
                        throw [400, `Failed to parse body as JSON: ${ex}`];
                    }

                    if (typeof body !== 'object' || body instanceof Array) {
                        throw [422, 'Expected a JSON object'];
                    }

                    if (typeof body.template !== 'string') {
                        throw [422, `The 'template' JSON property is required and should be strings`];
                    }
                    else if (!(body.views instanceof Array)) {
                        throw [422, `The 'views' JSON property is required and should be an array`];
                    }

                    template    = body.template;
                    document    = body.document;
                    contentType = body.contentType || 'application/json';
                    views       = body.views.map((view) => ({ contentType: String(view.contentType), params: view.params }));
                }

                let $render;

                try {
                    let tpl = this.template(template);

                    $render = () => tpl.$renderViews(document, contentType, views, null)
                        .then((results) => {
                            return Promise.all(results.map((result) => Template.$fileResultAsBuffer(result)));
                        })
                        .then((results) => {
                            if (returnCT) {
                                if (results.length !== 1) {
                                    throw new Error(`Expected 1 result but got ${results.length}`);
                                }

                                return [200, results[0].data, { 'Content-Type': results[0].contentType }];
                            }
                            else {
                                results.forEach((result) => {
                                    result.data = result.data.toString('base64');
                                });

                                return [200, results];
                            }
                        });
                }
                catch (ex) {
                    throw [403, ex.message];
                }

                if (views.some((view) => view.contentType === 'application/pdf')) {
                    return Engine.$withTempDir(`${this._config.tempDir}/${packageJSON.name}-`, (tempDir) => {
                        // PhantomJS can only render PDFs to disk
                        views.forEach((view, idx) => {
                            if (view.contentType === 'application/pdf') {
                                view.output = `${tempDir}/${idx}.out`;
                            }
                        });

                        return $render();
                    });
                }
                else {
                    return $render();
                }
            })
            .catch((ex) => {
                return ex instanceof Array ? ex : [500, ex.message || `Unknown error: ${ex}`];
            })
            .then((result) => {
                if (typeof result[1] !== 'object') {
                    result[1] = { message: String(result[1]) };
                }

                if (!(result[1] instanceof Buffer)) {
                    result[1] = JSON.stringify(result[1]);
                }

                response.writeHead(result[0], Object.assign({ 'Content-Type': 'application/json' }, result[2]));
                response.end(result[1]);
            });
    }

    static $getRandomPort() {
        return new Promise((resolve, reject) => {
            let server = net.createServer()
                .on('error', (error) => {
                    reject();
                });

            server.listen(0, () => {
                let port = server.address().port;

                server.close(() => {
                    resolve(port);
                });
            });
        }).catch(() => {
            return Engine.$getRandomPort(); // Try again
        });
    }

    static $withTempDir(prefix, $fn) {
        var tempDir;

        return new Promise((resolve, reject) => {
            fs.mkdtemp(prefix, (error, path) => {
                if (error) {
                    return reject(error);
                }

                resolve($fn(tempDir = path));
            });
        }).then((result) => { return Engine.$rmr(tempDir).then(() => { return result; }); },
                (error)  => { return Engine.$rmr(tempDir).then(() => { throw error; }); });
    }

    static $rmr(node) {
        return new Promise((resolve, reject) => {
            if (!node) {
                return resolve();
            }

            fs.stat(node, (error, stats) => {
                if (error) {
                    return reject(error);
                }

                if (stats.isDirectory()) {
                    fs.readdir(node, (error, files) => {
                        if (error) {
                            return reject(error);
                        }

                        resolve(Promise.all(files.map((file) => Engine.$rmr(path.join(node, file))))
                                .then(() => {
                                    return new Promise((resolve, reject) => {
                                        resolve();
                                        fs.rmdir(node, (error) => {
                                            error ? reject(error) : resolve();
                                        });
                                    });
                                }));
                    });
                }
                else {
                    resolve();
                    fs.unlink(node, (error) => {
                        error ? reject(error) : resolve();
                    });
                }
            })

        });
    }

    _$sendMessage(worker, message) {
        message = JSON.stringify(message);

        return new Promise((resolve, reject) => {
            ++worker.load;
            ++worker.counter;

            let hmac = crypto.createHmac("sha256", worker.key)
                .update([worker.counter, 'POST', '/', `localhost:${worker.port}`, 'application/json', message].join('\n'))
                .digest('hex');

            let request = http.request({
                port:    worker.port,
                method:  'POST',
                auth:    worker.counter + ':' + hmac,
                headers: {
                    'Content-Type':   'application/json',
                    'Content-Length': Buffer(message).length,
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
                    if (response.statusCode >= 400 && response.statusCode < 500) {
                        worker.process.kill();
                        return reject(new Error(`Worker returned an unexpected error: ${response.statusCode} - ${result}`));
                    }
                    else if (response.statusCode < 200 || response.statusCode >= 300) {
                        return reject(new Error(`Worker returned an error: ${response.statusCode} - ${result}`));
                    }

                    try {
                        if (response.headers['content-type'] == 'application/json') {
                            result = JSON.parse(result);
                        }

                        resolve(result);
                    }
                    catch (ex) {
                        reject(ex);
                    }
                });
            });

            request.on('error', (error) => {
                reject(error);
            })

            request.write(message);
            request.end();

            --worker.load;
        }).then(
            (result) => {
                --worker.load;
                return result;
            },
            (error) => {
                --worker.load;
                logger.error(`Failed to send request to worker ${worker.id}: ${error.message}`);
                throw error;
            }
        );
    }

    _selectWorker() {
        return this._workers.reduce((best, worker) => worker.load < best.load ? worker : best, this._workers[0]);
    }

    _$launchWorkers(count) {
        return Promise.all(Array(count).fill().map((unused, id) => this._$launchWorker(id)));
    }

    _$launchWorker(id) {
        if (this._workers[id]) {
            logger.info(`Worker ${id} already running as PID ${this._workers[id].process.pid}`);
            return Promise.resolve(this._workers[id]);
        }

        return (this._config.portBase && Promise.resolve(this._config.portBase + id) || Engine.$getRandomPort())
            .then((port) => {
                let key  = crypto.randomBytes(24).toString('base64');
                let proc = childProcess.execFile(this._config.phantomPath, [
                    '--web-security=false', path.join(__dirname, '..', 'phantomjs-template-renderer.js'), `127.0.0.1:${port}`, this._config.pageCache
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
                        logger.error(`Worker ${id} was killed by signal ${signal}. Re-launching in ${this._config.relaunchDelay} seconds.`);
                        setTimeout(() => this._$launchWorker(id), this._config.relaunchDelay * 1000);
                    }
                    else if (code != 0) {
                        logger.warn(`Worker ${id} exitied with status ${code}. Re-launching in ${this._config.relaunchDelay} seconds.`);
                        setTimeout(() => this._$launchWorker(id), this._config.relaunchDelay * 1000);
                    }
                    else {
                        logger.info(`Worker ${id} exited`);
                    }
                });

                proc.stdout.on('data', (data) => { logger.info(`Worker ${id}: ${String(data).trim()}`); });
                proc.stderr.on('data', (data) => { logger.warn(`Worker ${id}: ${String(data).trim()}`); });

                // Send key to phantomjs-renderer.js
                proc.stdin.write(key + '\n');

                this._workers[id] = {
                    counter: 0,
                    id:      id,
                    key:     key,
                    load:    0,
                    port:    port,
                    process: proc,
                };

                return new Promise((resolve, reject) => {
                    logger.info(`Spawned worker ${id} as PID ${proc.pid}`);

                    proc.stdout.once('data', () => {
                        resolve(this._workers[id]);
                    });
                });
            });
    }
}

class Template {
    constructor(engine, url) {
        this._engine = engine;
        this._url    = url;
    }

    $render(document, contentType, format, params) {
        return Engine.$withTempDir(`${this._engine._config.tempDir}/${packageJSON.name}-`, (tempDir) => {
            return this.$renderViews(document, contentType,
                                     [ { contentType: format, params: params, output: `${tempDir}/default.out` } ],
                                     null)
                .then((result) => {
                    return Template.$fileResultAsBuffer(result[0]);
                })
                .then((result) => {
                    return result.data;
                });
        });
    }

    $renderViews(document, contentType, views, attachments) {
        return this._engine._$sendMessage(this._engine._selectWorker(), {
            template:    this._url,
            document:    document,
            contentType: contentType,
            views:       views,
            attachments: attachments,
        }).then((results) => {
            results.forEach((result, idx) => {
                result.contentType = views[idx].contentType;

                if (result.text) {
                    result.data = Buffer.from(result.text);
                    delete result.text;
                }
                else if (result.binary) {
                    result.data = Buffer.from(result.binary, 'base64');
                    delete result.binary;
                }
            });

            return results;
        });
    }

    static $fileResultAsBuffer(result) {
        if (result.file) {
            return new Promise((resolve, reject) => {
                fs.readFile(result.file, (error, data) => {
                    result.data = data;
                    delete result.file;

                    error ? reject(error) : resolve(result);
                });
            });
        }
        else {
            return Promise.resolve(result);
        }
    }
}

exports.Engine = Engine;
