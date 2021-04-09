import { GhostlyError, View } from "@divine/ghostly-runtime";
import { Root } from 'hast';
import rehype, { RehypeOptions } from 'rehype';
import minifyWhitespace from 'rehype-minify-whitespace';
import minifyPreset from 'rehype-preset-minify';
import { Attacher, Preset } from 'unified';
import { EngineConfig } from './engine';

export class HTMLTransforms {
    constructor(private _url: string, private _config: EngineConfig, private _sanitizer: (content: string) => Promise<string>) {

    }

    private get log(): Console {
        return this._config.logger;
    }

    async apply(contents: string, view: View): Promise<string> {
        const pipeline = rehype().use({ settings: {
            upperDoctype: true,
        }});

        for (const transform of view.htmlTransforms ?? ['inline', 'sanitize', 'minimize']) {
            pipeline.use(() => {
                this.log.info(`${this._url}: Applying HTML transform '${transform}'.`);
            });

            if (transform === 'sanitize') {
                pipeline.use(this.sanitize(pipeline));
            }
            else if (transform === 'minimize') {
                pipeline.use(this.minify())
            }
            else {
                throw new GhostlyError(`${this._url}: Unknown HTML transform '${transform}'`, view);
            }
        }

        return String(await pipeline.process({ path: this._url, contents }));
    }


    private sanitize(pipeline: ReturnType<typeof rehype>): Attacher {
        return () => async (tree) => {
            const dirty = pipeline.stringify(tree);
            const clean = await this._sanitizer(dirty);
            const nodes = pipeline.parse(clean) as Root;

            if (!nodes.children.some((c) => c.type === 'doctype')) {
                nodes.children = [...(tree as Root).children.filter((c) => c.type === 'doctype'), ...nodes.children];
            }

            return nodes;
        };
    }

    private minify(): Preset & { settings: RehypeOptions } {
        return {
            plugins: minifyPreset.plugins.map((p) => {
                if (p === minifyWhitespace) {
                    return [ p, { newlines: true } ];
                }
                else {
                    return p;
                }
            }),

            settings: {
                entities: {
                    useShortestReferences: true,
                },

                quoteSmart: true,
                preferUnquoted: true,
                collapseEmptyAttributes: true,
                closeEmptyElements: true,
                tightSelfClosing: true,
                tightCommaSeparatedLists: true,
            }
        }
    }
}
