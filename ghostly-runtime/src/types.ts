export interface Template {
    ghostlyLoad?(url: string): void | Promise<void>;
    ghostlyInit(model: Model): void | AttachmentInfo | Promise<void | AttachmentInfo>;
    ghostlyRender(view: View): void | Uint8Array | string | null | Promise<void | Uint8Array | string | null>;
    ghostlyFetch?(attachmentInfo: AttachmentInfo): void | Uint8Array | string | null | Promise<void | Uint8Array | string | null>;
    ghostlyEnd(): void | Promise<void>;
}

/** The module (data) that should be rendered by the template */
export interface Model {
    /** The raw document, either as a string or JSON-serializable object */
    document:    string | object;

    /** The document's content-type, to be used if `document` is a string */
    contentType: string;
}

export interface ModelInfo {
    name:         string;
    description?: string;
    attachments?: AttachmentInfo[];
}

export interface View {
    contentType:     string;
    params:          unknown;
    dpi?:            number;
    paperSize?:      PaperSize;
    viewportSize?:   ViewportSize;
    htmlTransforms?: HTMLTransform[];
}

export interface AttachmentInfo extends View {
    name:         string;
    description?: string;
}

/** An Error class that can propage an extra data member back to the controlling application/driver */
export class GhostlyError extends Error {
    constructor(message: string, public data?: string | object | null) {
        super(message);

        if (Object.getPrototypeOf(this) !== GhostlyError.prototype) {
            Object.setPrototypeOf(this, GhostlyError.prototype);
        }
    }

    toString(): string {
        return `GhostlyError: ${this.message}: ${JSON.stringify(this.data)}`;
    }
}

export type OnGhostlyEvent  = (event: object) => void;

export type HTMLTransform   = 'sanitize' | 'minimize'
export type PaperFormat     = "A0" | "A1" | "A2" | "A3" | "A4" | "A5" | "A6" | "Letter" | "Legal" | "Tabloid" | "Ledger";
export type PaperSize       = { format?: PaperFormat, orientation?: 'portrait' | 'landscape' };
export type ViewportSize    = { width?: number, height?: number };

export type GhostlyRequest  = [ 'ghostlyLoad',   string         ] |
                              [ 'ghostlyInit',   Model          ] |
                              [ 'ghostlyRender', View           ] |
                              [ 'ghostlyFetch',  AttachmentInfo ] |
                              [ 'ghostlyEnd',    null           ];
export type GhostlyEvent    = [ 'ghostlyEvent',  object | null  ];
export type GhostlyResponse = [ 'ghostlyACK',    GhostlyTypes   ] |
                              [ 'ghostlyNACK',   GhostlyTypes   ];
export type GhostlyPacket   = [ string, string | null, ('Uint8Array' | 'JSON')? ];
export type GhostlyTypes    = Uint8Array | string | object | null;
