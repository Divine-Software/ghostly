import { GhostlyError, OnGhostlyEvent, PaperSize, View, ViewportSize } from '@divine/ghostly-runtime/build/src/types'; // Avoid DOM types leaks
import { guessFileExtension } from '@divine/uri';
import { Browser } from 'playwright-chromium';
import { EngineConfig, RenderRequest, RenderResult, TemplateEngine } from './engine';
import { PlaywrightDriver } from './playwright-driver';

export interface Worker {
    id:        number;
    load:      number;
    browser:   Browser;
    pageCache: PlaywrightDriver[];
}

export class TemplateEngineImpl implements TemplateEngine {
    private _url:  string;
    private _hash: string;

    constructor(private _config: EngineConfig, private _workers: Worker[], url: string) {
        this._url  = url.replace(/#.*/, '');
        this._hash = url.replace(/[^#]*#?/, '');
    }

    private get log(): Console {
        return this._config.logger;
    }

    async render(document: string | object, contentType: string, format: string, params: unknown, onGhostlyEvent?: OnGhostlyEvent): Promise<Buffer> {
        return (await this.renderViews(document, contentType, [{ contentType: format, params: params }], false, onGhostlyEvent))[0]!.data;
    }

    async renderViews(document: string | object, contentType: string, views: View[], attachments: boolean, onGhostlyEvent?: OnGhostlyEvent): Promise<RenderResult[]> {
        return await this.renderRequest({ document, contentType, views, attachments }, onGhostlyEvent);
    }

    async renderRequest(request: RenderRequest, onGhostlyEvent?: OnGhostlyEvent): Promise<RenderResult[]> {
        const { document, contentType, views, attachments: renderAttachments, locale, timeZone } = request;

        const worker = this._selectWorker();
        const result = [] as RenderResult[];
        const events = [] as object[];

        // Return events if custom handler not provider
        onGhostlyEvent ??= (event) => events.push(event);

        try {
            ++worker.load;

            // Find a cached template ...
            const  env = { url: this._url, locale: (locale ?? this._config.locale).toLowerCase(), timeZone: timeZone ?? this._config.timeZone };
            let driver = worker.pageCache.find((driver) => driver?.matches(env));

            try {
                if (driver) {
                    this.log.info(`${this._url}: Using cached template [${env.locale}, ${env.timeZone}].`);
                    worker.pageCache = worker.pageCache.filter((d) => d !== driver);
                }
                else {
                    // ... or create a new one
                    this.log.info(`${this._url}: Creating new template [${env.locale}, ${env.timeZone}].`);
                    driver = await new PlaywrightDriver(env, this._config).initialize(worker.browser);
                }

                await driver.withConfig(this._config, async () => {
                    // Render all views and attachments
                    result.push(...await driver!.renderViews(this._hash, document, contentType, views, !!renderAttachments, onGhostlyEvent));

                    // Add events to result, if no onGhostlyEvent handler was provided
                    result.push(...events.map((event) => ({ type: 'event' as const, 'contentType': 'application/json', data: Buffer.from(JSON.stringify(event))})));

                    // Return template to page cache if there were no errors
                    if (this._config.pageCache) {
                        worker.pageCache.unshift(driver!);
                        driver = worker.pageCache.length > this._config.pageCache ? worker.pageCache.pop() : undefined;

                        const capacity = Math.round(100 * worker.pageCache.length / this._config.pageCache);
                        this.log.info(`${this._url}: Returning template to page cache (${capacity}% full).`);
                    }
                });
            }
            finally {
                if (driver && this._config.pageCache) {
                    this.log.info(`${driver.url}: Evicting template from page cache.`);
                }

                await driver?.close();
            }
        }
        finally {
            --worker.load;
        }

        return result;
    }

    private _selectWorker(): Worker {
        let best: Worker | null = null;

        for (const worker of this._workers) {
            if (worker && (!best || worker.load < best.load)) {
                best = worker;
            }
        }

        if (!best) {
            throw new Error(`${this._url}: No workers alive`);
        }

        return best;
    }

    public static async purgeExpiredPages(workers: Worker[], config: EngineConfig): Promise<void> {
        for (const worker of workers) {
            for (const [index, driver] of worker?.pageCache.entries() ?? []) {
                if (driver?.isExpired(config)) {
                    config.logger.info(`${driver.url}: Purging expired template from page cache.`);
                    delete worker!.pageCache[index];
                    await driver.close();
                }
            }
        }
    }
}

export function paperDimensions(paperSize: PaperSize | undefined, dpi: number): Required<ViewportSize> {
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
            throw new GhostlyError(`Invalid paper format: ${paperSize.format}`, paperSize);
    }

    if (paperSize.orientation === 'landscape') {
        [ width, height ] = [ height, width ];
    }
    else if (paperSize.orientation !== 'portrait' && paperSize.orientation !== undefined) {
        throw new GhostlyError(`Invalid paper orientation: ${paperSize.orientation}`, paperSize);
    }

    // Convert from mm to pixels
    width  = Math.round(width  / 25.4 * dpi)
    height = Math.round(height / 25.4 * dpi)

    return { width, height };
}

export function browserVersion(browser: Browser): string {
    return `${browser.constructor.name}/${browser.version()}`;
}

export function deleteUndefined<T extends object>(obj: T): T {
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

export function toFilename(basename: string | undefined, contentType: string): string | undefined {
    // Only add extension if basename is non-empty string
    return basename && `${basename}.${guessFileExtension(contentType, true)}`;
}
