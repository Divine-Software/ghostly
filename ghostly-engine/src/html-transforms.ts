import { GhostlyError, HTMLTransform, View } from '@divine/ghostly-runtime';
import { ContentType } from '@divine/headers';
import { guessContentType, HEADERS, StringParser, URI } from '@divine/uri';
import csso from 'csso';
import { Element, Parent, Root } from 'hast';
import fromString from 'hast-util-from-string';
import hasProperty from 'hast-util-has-property';
import isCSSLink from 'hast-util-is-css-link';
import isElement from 'hast-util-is-element';
import isJavascript from 'hast-util-is-javascript';
import javascriptTypes from 'hast-util-is-javascript/index.json';
import isScriptSupporting from 'hast-util-script-supporting';
import urlAttributes from 'html-url-attributes';
import rehype, { RehypeOptions } from 'rehype';
import minifyWhitespace from 'rehype-minify-whitespace';
import minifyPreset from 'rehype-preset-minify';
import RelateUrl from 'relateurl';
import svgo from 'svgo';
import js2svg from 'svgo/lib/svgo/js2svg';
import svg2js from 'svgo/lib/svgo/svg2js';
import uglify from 'uglify-js';
import { Attacher, Preset } from 'unified';
import visit from 'unist-util-visit';
import { URL } from 'url';
import { EngineConfig } from './engine';

const DEFAULT_TRANSFORMS: HTMLTransform[] = ['inline', 'noscript', 'minimize'];

export type HTMLTransformsConfig = Pick<EngineConfig, 'logger' | 'templatePattern'>

export class HTMLTransforms {
    constructor(private _url: string, private _config: HTMLTransformsConfig, private _sanitizer: (content: string, fragment: boolean) => Promise<string>) {

    }

    private get log(): Console {
        return this._config.logger;
    }

    async apply(html: string, view: View): Promise<string> {
        try {
            return await this.processHTML(html, this._url, view.htmlTransforms ?? DEFAULT_TRANSFORMS);
        }
        catch (err) {
            throw new GhostlyError(`${this._url}: ${err.message}`, err);
        }
    }

    /**
     * Processes an HTML document by applying the specified transforms.
     *
     * @param html       The HTML document to process.
     * @param url        The URL of the document. Note: when inlining, the `<base>` element will also be respected.
     * @param transforms The transforms to appy to the document.
     * @returns          The processed document.
     */
    private async processHTML(html: string, url: string, transforms: HTMLTransform[]): Promise<string> {
        const pipeline = rehype().use({ settings: {
            upperDoctype: true,
        }});

        for (const transform of transforms) {
            pipeline.use(() => () => {
                this.log.info(`${this._url}: Applying HTML transform '${transform}'.`);
            });

            switch (transform) {
                case 'identity':
                    // Do nothing
                    break;

                case 'inline':
                    pipeline.use(this.htmlInliner(transforms));
                    break;

                case 'noscript':
                    pipeline.use(this.htmlNoScript());
                    break;

                case 'sanitize':
                    pipeline.use(this.htmlSanitizer(pipeline));
                    break;

                case 'minimize':
                    pipeline.use(this.htmlMinifier())
                    break;

                default:
                    throw new TypeError(`Unknown HTML transform '${transform}'`);
            }
        }

        return String(await pipeline.process({ contents: html, path: url }));
    }

    private htmlInliner(defaultTransforms: HTMLTransform[]): Attacher {
        return () => async (tree, file): Promise<void> => {
            let baseURL = new URL(file.path ?? file.cwd);
            const tasks: Promise<void>[] = [];

            // Use <base> element, if present
            visit(tree, 'element', (node): void | boolean => {
                if (element(node) && isElement(node, 'base') && hasProperty(node, 'href')) {
                    baseURL = new URL(String(node.properties!['href']), baseURL);
                    return visit.EXIT;
                }
            });

            // Find resources to inline
            visit(tree, 'element', (node) => {
                if (element(node)) {
                    // Check elements for magic attribute
                    const properties = node.properties!;
                    const inlineAttr = parseTransforms(properties['ghostly-inline']?.toString(), defaultTransforms);
                    delete properties['ghostly-inline'];

                    if (inlineAttr) {
                        if (isCSSLink(node) && hasProperty(node, 'href')) { // <link rel=stylesheet href=... ghostly-inline ...>
                            tasks.push(this.inlineResource(baseURL, String(properties['href']), inlineAttr).then(({ body, mime }) => {
                                properties['type'] = mime.toString();
                                fromString(node, body.toString());
                            }));

                            delete properties['href'];
                            delete properties['rel'];
                            node.tagName = 'style';
                        }
                        else if (isJavascript(node) && hasProperty(node, 'src')) { // <script src=... ghostly-inline ...>
                            tasks.push(this.inlineResource(baseURL, String(properties['src']), inlineAttr).then(({ body, mime }) => {
                                properties['type'] = mime.toString();
                                fromString(node, body.toString());
                            }));

                            delete properties['src'];
                        }
                        else {
                            throw new SyntaxError(`Don't know how to process <${node.tagName} ghostly-inline ...> elements`);
                        }
                    }

                    // Find URLs with ?ghostly-inline query param
                    for (const prop in properties) {
                        if (hasOwnProperty(urlAttributes, prop) && isElement(node, urlAttributes[prop])) {
                            const urlToInline = String(properties[prop]);
                            const inlineParam = parseTransforms(new URL(urlToInline, baseURL), defaultTransforms);

                            if (inlineParam) {
                                tasks.push(this.inlineResource(baseURL, urlToInline, inlineParam).then(({ body, mime }) => {
                                    properties[prop] = makeDataURI(body, mime);
                                }));
                            }
                        }
                    }
                }
            });

            await Promise.all(tasks);
        }
    }

    private htmlNoScript(): Attacher {
        return () => (tree) => {
            const trash: [Parent, Element][] = [];

            visit(tree, 'element', (node, _index, parent) => {
                if (element(parent) && element(node)) {
                    if (isScriptSupporting(node) && node.properties?.['ghostly-noscript'] !== 'false') {
                        trash.push([parent, node]);
                    }

                    delete node.properties?.['ghostly-noscript'];
                }
            });

            for (const [parent, node] of trash) {
                parent.children.splice(parent.children.indexOf(node), 1)
            }
        };
    }

    private htmlSanitizer(pipeline: ReturnType<typeof rehype>): Attacher {
        return () => async (tree) => {
            const dirty = pipeline.stringify(tree);
            const clean = await this._sanitizer(dirty, false);
            const nodes = pipeline.parse(clean) as Root;

            if (!nodes.children.some((c) => c.type === 'doctype')) {
                nodes.children = [...(tree as Root).children.filter((c) => c.type === 'doctype'), ...nodes.children];
            }

            return nodes;
        };
    }

    private htmlMinifier(): Preset & { settings: RehypeOptions } {
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

                omitOptionalTags: true,
                quoteSmart: true,
                preferUnquoted: true,
                collapseEmptyAttributes: true,
                closeEmptyElements: true,
                tightSelfClosing: true,
                tightCommaSeparatedLists: true,
            }
        }
    }

    private async inlineResource(base: URL, href: string, transforms: HTMLTransform[]): Promise<{ body: string | Buffer, mime: ContentType }> {
        const url = new URL(href, base);
        url.searchParams.delete('ghostly-inline');
        url.hash = '';

        if (!this._config.templatePattern.test(url.href)) {
            throw new Error(`URL to inlined resource is not allowed: ${url.href} did not match ${this._config.templatePattern}`);
        }

        const body = await new URI(url).load<Buffer>(ContentType.bytes);
        const mime = guessContentType(url.pathname, body[HEADERS]?.['content-type']) ?? ContentType.bytes;
        const text = () => new StringParser(mime).parse((async function* () { yield body })());

        if (mime.type === 'application/javascript' || mime.type === 'text/javascript') {
            const body = await this.processJavaScript(await text(), url, transforms);

            return { body, mime: mime.setParam('charset', undefined) };
        }
        else if (mime.type === 'text/css') {
            const body = await this.processStylesheet(await text(), base, url, transforms);

            return { body, mime: mime.setParam('charset', undefined) };
        }
        else if (mime.type === 'image/svg+xml') {
            const body = await this.processSVG(await text(), base, url, transforms);

            return { body, mime };
        }
        else {
            return { body, mime };
        }
    }

    /**
     * Processes a JavaScript file by applying the 'minimize' transform, if present. No other transforms apply to JS
     * files.
     *
     * @param script      The JavaScript code to process.
     * @param url         The URL of the script.
     * @param transforms  The transforms to appy to the script. 'inline' is a no-ops for JS scripts.
     * @returns           The processed script.
     */
    private async processJavaScript(script: string, url: URL, transforms: HTMLTransform[]): Promise<string> {
        for (const transform of transforms) {
            switch (transform) {
                case 'identity':
                    // Do nothing
                    break;

                case 'inline':
                case 'noscript':
                    // These transforms do not apply to raw JS content
                    break;

                case 'sanitize':
                    script = '';
                    break;

                case 'minimize': {
                    script = this.jsMinimizer(script, url);
                    break;
                }

                default:
                    throw new TypeError(`Unknown JavsScript transform '${transform}'`);
            }
        }

        return script;
    }

    private jsMinimizer(script: string, url: URL): string {
        const output = uglify.minify({ [url.href]: script });

        if (output.error) {
            throw output.error;
        }
        else {
            return output.code.replace(/;$/, '');
        }
    }

    /**
     * Processes a link URL by rebasing it if relative, and, optionally, inlining it.
     *
     * @param href        The link to process. May be realtive.
     * @param base        The (new) base URL. Differs from `url` if this link comes from a previously inlined document.
     * @param url         The document where the link comes from.
     * @param transforms  The transforms to apply to the link. If 'inline' is included, the link will be converted to an
     *                    data: URI.
     * @returns           The processed link.
     */
     private async processLink(href: string, base: URL, url: URL, transforms: HTMLTransform[]): Promise<string> {
        const abs = new URL(href, url);
        const ops = transforms.includes('inline') ? parseTransforms(abs, transforms) : undefined;

        if (ops) {
            const { body, mime } = await this.inlineResource(base, abs.href, ops);

            return makeDataURI(body, mime);
        }
        else {
            const output = /^[a-zA-Z][^:]*:\/\//.test(href) ? RelateUrl.ABSOLUTE       // Keep absolute URLs
                                     : href.startsWith('/') ? RelateUrl.ROOT_RELATIVE  // Keep absolute paths
                                                            : RelateUrl.PATH_RELATIVE;

            return RelateUrl.relate(base.href, abs.href, { removeDirectoryIndexes: false, output });
        }
    }

    /**
     * Processes a stylesheet by updating all relative URLs and, optionally, applying the 'inline' and 'minimize'
     * transforms.
     *
     * @param css         The CSS document to process.
     * @param base        The (new) base URL. Differs from `url` if this stylesheet was previously inlined.
     * @param url         The original URL of the CSS document.
     * @param transforms  The transforms to appy to the document. 'noscript'/'sanitize' are no-ops for CSS documents.
     * @returns           The processed stylesheet.
     */
    private async processStylesheet(css: string, base: URL, url: URL, transforms: HTMLTransform[]): Promise<string> {
        const tasks: Promise<void>[] = [];
        let minimize = false;

        for (const transform of transforms) {
            switch (transform) {
                case 'identity':
                case 'inline':
                case 'noscript':
                case 'sanitize':
                    break;

                case 'minimize':
                    minimize = true;
                    break;

                default:
                    throw new TypeError(`Unknown CSS transform '${transform}'`);
            }
        }

        let stylesheet = csso.syntax.parse(css, { filename: url.href, parseRulePrelude: minimize /* No shortcuts when minifying as well */ })

        // Rebase or inline URLs
        csso.syntax.walk(stylesheet, (cn, item, list) => {
            if (cn.type === 'Atrule' && cn.name === 'import' && cn.prelude?.type === 'AtrulePrelude') {
                const child = cn.prelude?.children.first()

                if (child?.type === 'String') {
                    tasks.push(this.processLink(child.value.slice(1, -1), base, url, transforms).then((href) => {
                        child.value = JSON.stringify(href);
                    }));
                }
            }
            else if (cn.type === 'Atrule' && cn.name === 'charset') {
                list.remove(item);
            }
            else if (cn.type === 'Url') {
                const value = cn.value.type === 'String' ? cn.value.value.slice(1, -1) : cn.value.value;

                tasks.push(this.processLink(value, base, url, transforms).then((href) => {
                    cn.value.value = JSON.stringify(href);
                }));
            }
        });

        await Promise.all(tasks);

        // Minimize stylesheet
        if (minimize) {
            stylesheet = (csso.syntax as any).compress(stylesheet).ast;
        }

        return csso.syntax.generate(stylesheet)
    }

    private async processSVG(svg: string, base: URL, url: URL, transforms: HTMLTransform[]): Promise<string> {
        for (const transform of transforms) {
            switch (transform) {
                case 'identity':
                    // Do nothing
                    break;

                case 'inline': {
                    const root = svg2js(svg);

                    if (root.error) {
                        throw new Error(`Failed to parse SVG document at ${url}: ${root.error}`);
                    }

                    const inliner = async (node: JSAPI) => {
                        if (node.attributes?.['href']) {
                            node.attributes['href'] = await this.processLink(node.attributes['href'], base, url, transforms);
                        }

                        await Promise.all(node.children?.map(inliner) ?? []);
                        return node;
                    }

                    svg = js2svg(await inliner(root), {}).data;
                }
                break;

                case 'noscript':
                    svg = svgo.optimize(svg, { plugins: [{
                        name: 'svgNoScript',
                        type: 'perItem',
                        fn: (item) => {
                            const remove = item.isElem('script') && !item.hasAttr('ghostly-noscript', 'false');
                            item.removeAttr('ghostly-noscript');

                            return !remove;
                        }
                    }]}).data;
                    break;

                case 'sanitize':
                    svg = await this._sanitizer(svg, true);
                    break;

                case 'minimize':
                    svg = svgo.optimize(svg, {
                        plugins: [
                            { name: 'preset-default', params: {  overrides: { // Try to use only a safe subset
                                    'cleanupIDs':                 false,
                                    'convertPathData':            false,
                                    'convertShapeToPath':         false,
                                    'convertTransform':           false,
                                    'moveGroupAttrsToElems':      false,
                                    'removeUnknownsAndDefaults':  false,
                                    'removeUselessDefs':          false,
                                    'removeUselessStrokeAndFill': false,
                                    'removeViewBox':              false,
                                }
                            }},
                            { name: 'svgMinifyScript', type: 'perItem', fn: (item) => {
                                if (item.isElem('script') && !item.hasAttr('href') && (item.children?.[0].type === 'text' || item.children?.[0].type === 'cdata')) {
                                    if (!item.hasAttr('type') || javascriptTypes.includes(item.attributes['type'].toLowerCase())) {
                                        // Kind of like the minifyStyles plugin, but for JS
                                        const scriptJS = item.children[0].value;
                                        const minified = this.jsMinimizer(scriptJS, url);

                                        item.children[0].type  = /[&'"<>]/.test(minified) ? 'cdata' : 'text';
                                        item.children[0].value = minified;
                                        item.removeAttr('type');
                                    }
                                }
                            }},
                        ],
                    }).data;
                    break;

                default:
                    throw new TypeError(`Unknown SVG transform '${transform}'`);
            }
        }

        return svg;
    }
}

function element(node: any): node is Element {
    return node && typeof node === 'object' && node.type === 'element' && typeof node.tagName === 'string';
}

const hasOwnProperty = Object.prototype.hasOwnProperty.call.bind(Object.prototype.hasOwnProperty);

function parseTransforms(transforms: string | undefined | null | URL, defaultTransforms: HTMLTransform[]): HTMLTransform[] | undefined {
    transforms = transforms instanceof URL ? transforms.searchParams.get('ghostly-inline') : transforms;

    return transforms === 'false' ? undefined :
           transforms === ''      ? defaultTransforms :
           transforms?.split(',').map((t) => t.trim() as HTMLTransform);
}

function makeDataURI(body: string | Buffer, mime: ContentType): string {
    let enc = ';base64,' + Buffer.from(body).toString('base64');

    if (mime.baseType === 'text' || mime.subType === 'javascript' || mime.type.endsWith('+xml') || mime.type.endsWith('+json')) {
        const uri = ',' + encodeURI(body.toString()).replace(/\?/g, '%3F').replace(/#/g, '%23');

        enc = uri.length < enc.length ? uri : enc;
    }

    return `data:${mime.toString()}${enc}`;
}
