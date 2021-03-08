import { Engine, EngineConfig, HTMLTransform, View } from '@divine/ghostly-engine';
import { SysConsole } from '@divine/sysconsole';
import childProcess from 'child_process';
import commander from 'commander';
import daemon from 'daemonize-process';
import { promises as fs, writeFileSync } from 'fs';
import http from 'http';
import { AddressInfo } from 'net';
import os from 'os';
import path from 'path';
import packageJSON from '../package.json';

const sysconsole = new SysConsole({ syslog: false, showFile: false });

function parseArgs() {
    const cmd = commander
        .usage('[options] [document]')
        .description('Render a Ghostly template or start a Ghostly HTTP server.')
        .version(packageJSON.version);

    function check(cond: boolean, message: string) {
        if (!cond) {
            cmd.outputHelp();
            console.error(`Argument error: ${message}.`);
            process.exit(64);
        }
    }

    // function float(arg: string) {
    //     const rc = parseFloat(arg);
    //     check(!isNaN(rc), `${arg} is not a number`);
    //     return rc;
    // }

    function int(arg: string) {
        const rc = parseInt(arg);
        check(!isNaN(rc), `${arg} is not a number`);
        return rc;
    }

    const argv = cmd
        .option('    --content-type <content-type>',                  'input document format [application/json]')
        .option('-d, --debug',                                        'enable debug logging')
        .option('    --format <content-type>',                        'template output format [text/html]')
        .option('    --render-dpi <dpi>',                             'dots per inch when rendering images [96]', int)
        .option('    --render-width <pixels>',                        'width of rendered image in pixels', int)
        .option('    --render-height <pixels>',                       'height of rendered image in pixels', int)
        .option('    --render-format <paper-size>',                   'physical size of rendered PDF [A4]')
        .option('    --render-orientation <portrait|landscape>',      'whether to render in portrait or landscape mode [portrait]')
        .option('    --render-html-transforms <list>',                'comma-separated list of HTML transformations to apply [sanitize,minimize]')
        .option('-H, --http <host:port>',                             'run an HTTP server on this host and port')
        .option('-o  --output <file>',                                'template output filename [standard output]')
        .option('-O  --output-dir <directory>',                       'attachments output directory [disabled]')
        .option('    --page-cache <num>',                             'each worker keeps <num> pages cached [0]', int)
        .option('    --browser <chromium|firefox|webkit[:<file>]',    'Specify browser to use (with optional exe path override)')
        .option('    --pidfile <file>',                               'fork and write PID to this file')
        .option('    --relaunch-delay <seconds>',                     'delay in seconds before relaunching a crashed worker [1]', int)
        .option('-t, --template <url>',                               'execute this Ghostly template')
        .option('-T, --template-pattern <regexp>',                    'restrict template URIs to this regular expression')
        .option('-u, --user <user>',                                  'run as this user')
        .option('    --workers <num>',                                'number of worker processes [1]', int)
        .parse(process.argv)
        .opts();

    if (argv.template) {
        check(cmd.args.length >= 1, 'No input document specified');
        check(cmd.args.length <= 1, 'Only one input document may be specified');
    }
    else {
        check(!cmd.args.length,            'Cannot specify document without --template');
        check(!argv.contentType,           '--content-type requires --template');
        check(!argv.format,                '--format requires --template');
        check(!argv.renderDpi,             '--render-dpi requires --template');
        check(!argv.renderWidth,           '--render-width requires --template');
        check(!argv.renderHeight,          '--render-height requires --template');
        check(!argv.renderFormat,          '--render-format requires --template');
        check(!argv.renderOrientation,     '--render-orientation requires --template');
        check(!argv.renderHtmlTransforms,  '--render-html-transforms requires --template');
        check(!argv.output,                '--output requires --template');
        check(!argv.outputDir,             '--output-dir requires --template');
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

    return { cmd, argv };
}

export async function main(): Promise<void> {
    const { cmd, argv } = parseArgs()

    const config: Partial<EngineConfig> = {};

    if (argv.debug) {
        config.logger = sysconsole;
    }

    const [ browserType, ...browserPath ] = argv.browser?.split(':') ?? [];
    config.browser     = browserType;
    config.browserPath = browserPath.join(':') || undefined;

    function arg<T>(name: keyof EngineConfig, type: (value: string) => T) {
        if (argv[name] !== undefined) (config as any /* why?? */)[name] = type(argv[name]);
    }

    arg('templatePattern', RegExp);
    arg('pageCache',       Number);
    arg('relaunchDelay',   Number);
    arg('workers',         Number);

    const engine = new Engine(config);

    if (argv.template) {
        const template = (await engine.start()).template(argv.template);

        for (const file of cmd.args) {
            const view: View = {
                contentType:    argv.format || 'text/html',
                params:         null,
                dpi:            argv.renderDpi,
                paperSize:      { format: argv.renderFormat, orientation: argv.renderOrientation },
                viewportSize:   { width: argv.renderWidth, height: argv.renderHeight },
                htmlTransforms: (argv.renderHtmlTransforms as string)?.split(',').map(t => t.trim()).filter(t => !!t) as HTMLTransform[],
            };

            const evlog  = (data: object) => sysconsole.notice(data);
            const data   = await fs.readFile(file !== '-' ? file : '/dev/stdin');
            const result = (await template.renderViews(data.toString(), argv.contentType || 'application/json', [ view ], !!argv.outputDir, evlog));

            // Write rendered view (which is always the first RenderResult)
            if (argv.output) {
                await fs.writeFile(argv.output, result[0].data);
            }
            else {
                await new Promise<void>((resolve, reject) => process.stdout.write(result[0].data) ? resolve() : process.stdout.once('drain', resolve).once('error', reject));
            }

            // Write attachments
            for (const rr of result) {
                if (argv.outputDir && rr.type === 'attachment' && rr.name) {
                    await fs.writeFile(path.resolve(argv.outputDir, rr.name), rr.data);
                }
            }
        }
    }
    else if (argv.http) {
        const server = http.createServer((request, response) => engine.httpRequestHandler(request, response));

        const address = await new Promise<{port: number, address: string}>((resolve, _reject) => {
            server.listen(argv.http[1], argv.http[0], () => resolve(server.address() as AddressInfo));
        });

        sysconsole.log(`Listening for requests on http://${address.address}:${address.port}/`);

        if (argv.pidfile) {
            daemon();
            writeFileSync(argv.pidfile, process.pid);
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
            await engine.start();

            // Wait for server to exit or fail
            await new Promise((resolve, reject) => server.once('close', resolve).once('error', reject));
        }
        finally {
            // Shut down workers
            await engine.stop();
        }
    }
}
