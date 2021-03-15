/** The Ghostly Template API. */
export interface Template {
    /**
     * This optional method will be invoked once the template has been loaded by the browser, or each time the fragment
     * part (hash) changes in a cached template.
     *
     * @param url The template URL (including fragment).
     */
    ghostlyLoad?(url: string): void | Promise<void>;

    /**
     * Used to supply the model (data) that the template should render from.
     *
     * @param model The model to render.
     * @returns     Optional metainfo about the model and the attachments that can be produced.
     */
    ghostlyInit(model: Model): void | ModelInfo | Promise<void | ModelInfo>;

    /**
     * Asks the template to render a specific view. This call should not return or resolve until the view is stable and
     * fully rendered.
     *
     * @param view The view to render.
     * @returns    The view as raw binary data, a string, a JSON object, or nothing (in which case the Ghostly Engine
     *             will construct a response).
     */
    ghostlyRender(view: View): void | GhostlyTypes | Promise<void | GhostlyTypes>;

    /**
     * Asks the template to render an attachment. This call should not return or resolve until the attachment is stable
     * and fully rendered.
     *
     * @param attachmentInfo The attchment to render.
     * @returns              The attachment as raw binary data, a string, a JSON object, or nothing (in which case the Ghostly Engine
     *                       will construct a response).
     */
    ghostlyFetch?(attachmentInfo: AttachmentInfo): void | GhostlyTypes | Promise<void | GhostlyTypes>;

    /** This method is used by the [[PreviewDriver]] to print and to find out the preferred size of the IFrame. */
    ghostlyPreview?(command?: PreviewCommand): PreviewResult | Promise<PreviewResult>;

    /**
     * This optional method is invoked when all processing of the model is done. May be used to purge caches and other
     * resources.
     */
    ghostlyEnd?(): void | Promise<void>;
}

/** The module (data) that should be rendered by the template. */
export interface Model {
    /** The raw document, either as a string or JSON-serializable object. */
    document:    string | object;

    /** The document's media type, to be used if `document` is a string. */
    contentType: string;
}

/** Metadata about a [[Model]], optionally returned by [[ghostlyInit]]. */
export interface ModelInfo {
    /** The name of the model (*excluding* file extension). Will be used to construct file names. */
    name: string;

    /** An optional description of the model. */
    description?: string;

    /** Information about attachments that the template can produce. */
    attachments?: AttachmentInfo[];
}

/** A view of the model that the template should render. */
export interface View<Params = unknown> {
    /** The view's type (for instance, `text/html` or `application/pdf`). */
    contentType: string;

    /** Optional view params. */
    params?: Params;

    /** The resolution be used when rendering the view. Used for viewport size calculations. */
    dpi?: number;

    /** The paper size to be used when rendering documents. */
    paperSize?: PaperSize;

    /** The size of the viewport to use, in pixels. Will be calculated from `dpi` and `paperSize`, if not provided. */
    viewportSize?: ViewportSize;

    /** An array of transformations to apply when producing HTML results. Defaults to `[ sanitize, minimize ]`. */
    htmlTransforms?: HTMLTransform[];
}

/** Metadata about an attachment. */
export interface AttachmentInfo<Params = unknown> extends View<Params> {
    /** The name of the attachment (*including* file extension).*/
    name: string;

    /** An optional description of the attachment. */
    description?: string;
}

export interface PreviewCommand {
    print?: boolean;
}

export interface PreviewResult {
    documentStyle: {
        width:  string;
        height: string;
    }
}

/** An Error class that can propage an extra data member back to the controlling application/driver. */
export class GhostlyError extends Error {
    constructor(message: string, public data?: string | object | null) {
        super(message);

        if (Object.getPrototypeOf(this) !== GhostlyError.prototype) {
            Object.setPrototypeOf(this, GhostlyError.prototype);
        }
    }

    toString(): string {
        return `GhostlyError: ${this.message}: ${this.data instanceof Error ? String(this.data) : JSON.stringify(this.data)}`;
    }
}

export type OnGhostlyEvent  = (event: object) => void;

/**
 * An operation to apply to the HTML view before returning the result.
 *
 * * `sanitize`: Removes all scripts or otherwise dangerous markup.
 * * `minimize`: Minifies the HTML and CSS.
 */
export type HTMLTransform   = 'sanitize' | 'minimize'

export type PaperFormat     = "A0" | "A1" | "A2" | "A3" | "A4" | "A5" | "A6" | "Letter" | "Legal" | "Tabloid" | "Ledger";
export type PaperSize       = { format?: PaperFormat, orientation?: 'portrait' | 'landscape' };
export type ViewportSize    = { width?: number, height?: number };

export type GhostlyRequest  = [ 'ghostlyLoad',    string         ] |
                              [ 'ghostlyInit',    Model          ] |
                              [ 'ghostlyRender',  View           ] |
                              [ 'ghostlyFetch',   AttachmentInfo ] |
                              [ 'ghostlyPreview', PreviewCommand ] |
                              [ 'ghostlyEnd',     null           ];
export type GhostlyEvent    = [ 'ghostlyEvent',   object | null  ];
export type GhostlyResponse = [ 'ghostlyACK',     GhostlyTypes   ] |
                              [ 'ghostlyNACK',    GhostlyTypes   ];
export type GhostlyPacket   = [ string, string | null, ('Uint8Array' | 'JSON')? ];
export type GhostlyTypes    = Uint8Array | string | object | null;
