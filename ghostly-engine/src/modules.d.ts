/* eslint-disable import/no-duplicates */

declare module 'rehype-preset-minify' {
    import { RehypeOptions } from 'rehype';
    import { Plugin } from 'unified';

    export const plugins: Plugin[];
    export const settings: RehypeOptions;
}

declare module 'rehype-minify-whitespace' {
    import { Attacher } from 'unified';

    const attacher: Attacher;
    export = attacher;
}

declare module 'hast-util-is-css-link' {
    import { Node } from 'hast';

    function cssLink(node: Node): boolean;
    export = cssLink;
}

declare module 'hast-util-has-property' {
    import { Node } from 'hast';

    function hasProperty(node: Node, name: string): boolean;
    export = hasProperty;
}

declare module 'html-url-attributes' {
    const attributes: { [attr: string]: string[] }
    export = attributes;
}

declare module 'hast-util-is-element' {
    import { Node, Parent } from 'hast';
    import { Test } from 'unist-util-is';

    function isElement<T extends Node>(node: Node, test?: Test<T> | Array<Test<T>>, index?: number, parent?: Parent, context?: any): boolean;
    export = isElement;
}

declare module 'hast-util-is-javascript' {
    import { Node } from 'hast';

    function javascript(node: Node): boolean;
    export = javascript;
}

declare module 'hast-util-script-supporting' {
    import { Node } from 'hast';

    function scriptSupporting(node: Node): Node;
    export = scriptSupporting;
}

declare module 'hast-util-from-string' {
    import { Node } from 'hast';

    function fromString(node: Node, value?: string | null): Node;
    export = fromString;
}

interface JSAPI {
    type: 'root' | 'doctype' | 'instruction' | 'comment' | 'cdata' | 'element' | 'text';
    name?: string;
    data?: {
        doctype: string;
    },
    value?: string;
    attributes?: { [attr: string]: string | undefined };
    children?: JSAPI[];
    error?: string;
}

declare module 'svgo/lib/svgo/svg2js' {
    function svg2js(content: string | Buffer): JSAPI;
    export = svg2js;
}

declare module 'svgo/lib/svgo/js2svg' {
    import { Js2SvgOptions, OptimizedSvg } from 'svgo';

    function js2svg(root: JSAPI, config: Js2SvgOptions): OptimizedSvg;
    export = js2svg;
}
