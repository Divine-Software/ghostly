#!/usr/bin/env node

'use strict'

const commander   = require('commander');
const daemon      = require('daemon');
const fs          = require('fs');
const ghostly     = require('./ghostly');
const os          = require('os');
const packageJSON = require('./package.json');
const phantomjs   = require('phantomjs-prebuilt');

Promise.resolve().then(() => {
    let argv = commander
        .usage('[options] [document]')
        .description('Render a Ghostly template or start a Ghostly HTTP server.')
        .version(packageJSON.version);

    function check(cond, message) {
        if (!cond) {
            argv.outputHelp();
            throw `Argument error: ${message}`;
        }
    }

    function int(arg) {
        let rc = parseInt(arg);
        check(!isNaN(rc), `${arg} is not a number`);
        return rc;
    }

    argv.option('    --content-type <content-type>',      'input document format [application/json]')
        .option('-d, --debug',                            'enable debug logging')
        .option('    --format <content-type>',            'template output format [text/html]')
        .option('-H, --http <host:port>',                 'run an HTTP server on this host and port')
        .option('-o  --output <file>',                    'template output filename [standard output]')
        .option('    --page-cache <num>',                 'each worker keeps <num> pages cached [0]', int)
        .option('    --phantom-path <file>',              'override PhantomJS/SlimerJS path', phantomjs.path)
        .option('    --pidfile <file>',                   'fork and write PID to this file')
        .option('    --port-base <port>',                 'first localhost port to use for workers [use random ports]', int)
        .option('    --relaunch-delay <seconds>',         'delay in seconds before relaunching a crashed worker [1]', int)
        .option('    --temp-dir <dir>',                   'override default directory for temporary files')
        .option('-t, --template <url>',                   'execute this Ghostly template')
        .option('-u, --user <user>',                      'run as this user')
        .option('    --workers <num>',                    'number of worker processes [1]', int)
        .parse(process.argv);

    if (argv.template) {
        check(argv.args.length >= 1, 'No input document specified');
        check(argv.args.length <= 1, 'Only one input document may be specified');
    }
    else {
        check(!argv.args.length, 'Cannot specify document without --template');
        check(!argv.contentType, '--content-type requires --template');
        check(!argv.format, '--format requires --template');
        check(!argv.output, '--output requires --template');
    }
    
    if (argv.http) {
        argv.http = ['localhost'].concat(argv.http.split(':')).splice(-2);
        argv.http[0] = argv.http[0] || os.hostname();
        check(!!Number(argv.http[1]), 'Invalid --http argument');
    }
    else {
        check(!argv.pidfile, '--pidfile can only be used in --http mode');
    }

    check(argv.http || argv.template, 'Either --http or --template must be specified');
    
    return $main(argv);
}).catch((ex) => {
    process.stdout.write(ex + '\n');
    return 64;
}).then((rc) => {
    setTimeout(() => {
        process.exit(rc || 0)
    }, 100);
});

function $main(argv) {    
    if (argv.debug) {
        ghostly.logger(console);
    }

    let engine = new ghostly.Engine(
        ['pageCache', 'phantomPath', 'portBase', 'relaunchDelay', 'tempDir', 'workers']
            .reduce((result, prop) => { argv[prop] !== undefined && (result[prop] = argv[prop]); return result; }, {})
    );

    return engine.$start()
        .then((engine) => {
            if (argv.template) {
                let template = engine.template(argv.template);

                return Promise.all(argv.args.map((file) => { // OK to use sync APIs here
                    let data = fs.readFileSync(file !== '-' ? file : process.stdin.fd).toString();

                    return template.$render(data, argv.contentType || 'application/json', argv.format || 'text/html', null)
                        .then((result) => {
                            return new Promise((resolve, reject) => {
                                if (argv.output) {
                                    fs.writeFile(argv.output, result, (error) => {
                                        error && reject(error) || resolve();
                                    });
                                }
                                else {
                                    process.stdout.write(result) ? resolve() : process.stdout.once('drain', resolve);
                                }
                            });
                        });
                }));
            }
        })
        .then(() => {
            if (argv.http) {
                console.log("TODO: Start HTTP server...");

                if (argv.pidfile) {
                    daemon();
                    fs.writeFileSync(argv.pidfile, process.pid);
                }
            }
        });
}
