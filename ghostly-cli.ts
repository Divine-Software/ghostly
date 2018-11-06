import commander    from 'commander';
import childProcess from 'child_process';
import daemon       from 'daemonize-process';
import fs           from 'mz/fs';
import http         from 'http';
import os           from 'os';
import packageJSON  from './package.json';
import phantomjs    from 'phantomjs-prebuilt';

import { logger, Engine, EngineConfig } from './ghostly';

function parseArgs(): commander.Command {
    const argv = commander
        .usage('[options] [document]')
        .description('Render a Ghostly template or start a Ghostly HTTP server.')
        .version(packageJSON.version);

    function check(cond: boolean, message: string) {
        if (!cond) {
            argv.outputHelp();
            throw `Argument error: ${message}.`;
        }
    }

    function int(arg: string) {
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
        .option('-T, --template-pattern <regexp>',        'restrict template URIs to this regular expression')
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
        check(!argv.user,    '--user can only be used in --http mode');
        check(!argv.pidfile, '--pidfile can only be used in --http mode');
    }

    check(!!argv.http != !!argv.template, 'Either --http or --template must be specified, but not both');

    return argv;
}

export async function $main(): Promise<void> {
    const argv = parseArgs()

    if (argv.debug) {
        logger(console);
    }

    let config: Partial<EngineConfig> = {};

    function arg(name: keyof EngineConfig, type: Function) {
        if (argv[name] !== undefined) config[name] = type(argv[name]);
    }

    arg('templatePattern', RegExp);
    arg('pageCache',       Number);
    arg('phantomPath',     String);
    arg('portBase',        Number);
    arg('relaunchDelay',   Number);
    arg('tempDir',         String);
    arg('workers',         Number);

    let engine = new Engine(config);

    if (argv.template) {
        let template = (await engine.$start()).template(argv.template);

        for (const file of argv.args) {
            const data   = await fs.readFile(file !== '-' ? file : '/dev/stdin');
            const result = await template.$render(data.toString(), argv.contentType || 'application/json', argv.format || 'text/html', null);

            if (argv.output) {
                await fs.writeFile(argv.output, result);
            }
            else {
                await new Promise((resolve, reject) => process.stdout.write(result) ? resolve() : process.stdout.once('drain', resolve).once('error', reject));
            }
        }
    }
    else if (argv.http) {
        let server = http.createServer((request, response) => engine.httpRequestHandler(request, response));

        const address = await new Promise<{port: number, address: string}>((resolve, _reject) => {
            server.listen(argv.http[1], argv.http[0], () => resolve(server.address()));
        });

        console.log(`Listening for requests on http://${address.address}:${address.port}/`);

        if (argv.pidfile) {
            daemon();
            fs.writeFileSync(argv.pidfile, process.pid);
        }

        if (argv.user) {
            process.setgid(Number(childProcess.execSync(`id -g ${argv.user}`)));
            process.setuid(argv.user);
        }

        process.once('SIGINT', () => server.close());
        process.once('SIGTERM', () => server.close());
        process.once('SIGBREAK', () => server.close());

        try {
            // Launch workers
            await engine.$start();

            // Wait for server to exit or fail
            await new Promise((resolve, reject) => server.once('close', resolve).once('error', reject));
        }
        finally {
            // Shut down workers
            await engine.$stop();
        }
    }
}
