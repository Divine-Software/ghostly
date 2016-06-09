
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
            phantomPath:   'phantomjs',
            portBase:      null,
            relaunchDelay: 1,
            tempDir:       os.tmpdir(),
            workers:       1,
            pageCache:     0,
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
        return new Template(this, url.resolve(`file://${process.cwd()}/`, uri));
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
                    if (response.statusCode != 200) {
                        worker.process.kill();
                        return reject(new Error(`Worker returned an unexpected error: ${response.statusCode} [${result}]`));
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
        return (this._config.portBase && Promise.resolve(this._config.portBase + id) || Engine.$getRandomPort())
            .then((port) => {
                let key  = crypto.randomBytes(24).toString('base64');
                let proc = childProcess.execFile(this._config.phantomPath, [
                    '--web-security=false', path.join(__dirname, 'phantomjs-template-renderer.js'), `127.0.0.1:${port}`, this._config.pageCache
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
                
                proc.stdout.on('data', (data) => { logger.info(`Worker ${id}: ${data.trim()}`); });
                proc.stderr.on('data', (data) => { logger.warn(`Worker ${id}: ${data.trim()}`); });

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
                                            error && reject(error) || resolve();
                                        });
                                    });
                                }));
                    });
                }
                else {
                    resolve();
                    fs.unlink(node, (error) => {
                        error && reject(error) || resolve();
                    });
                }
            })

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
                    result = result[0];

                    if (result.text) {
                        return Buffer.from(result.text);
                    }
                    else if (result.binary) {
                        return Buffer.from(result.binary, 'base64');
                    }
                    else if (result.file) {
                        return new Promise((resolve, reject) => {
                            fs.readFile(result.file, (error, data) => {
                                error && reject(error) || resolve(data);
                            });
                        });
                    }
                    else {
                        throw new Error(`Failed to parse $renderViews() response: ${JSON.stringify(result)}`);
                    }
                });
        });
    }

    $renderViews(document, contentType, views, attachments) {
        return this._engine._$sendMessage(this._engine._selectWorker(), {
            template:    this._url,
            document:    document,
            contentType, contentType,
            views:       views,
            attachments: attachments,
        });
    }
}

exports.Engine = Engine;
