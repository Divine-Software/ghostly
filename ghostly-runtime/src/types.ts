export interface Template {
    ghostlyLoad?(url: string): void | Promise<void>;
    ghostlyInit(model: Model): void | Promise<void>;
    ghostlyRender(view: View): Uint8Array | string | null | Promise<Uint8Array | string | null>;
}

/** The module (data) that should be rendered by the template */
export interface Model {
    /** The raw document, either as a string or JSON-serializable object */
    document:    string | object;

    /** The document's content-type, to be used if `document` is a string */
    contentType: string;
}

export interface View {
    contentType:   string;
    params:        unknown;
    dpi?:          number;
    viewportSize?: ViewportSize;
    paperSize?:    PaperSize;
}

export type OnGhostlyEvent = (event: object) => void;

export type PaperFormat  = "A0" | "A1" | "A2" | "A3" | "A4" | "A5" | "A6" | "Letter" | "Legal" | "Tabloid" | "Ledger";
export type PaperSize    = { format?: PaperFormat, orientation?: 'portrait' | 'landscape' };
export type ViewportSize = { width?: number, height?: number };

export type GhostlyRequest  = [ 'ghostlyInit',   Model  ] |
                              [ 'ghostlyRender', View   ] |
                              [ 'ghostlyLoad',   string ];
export type GhostlyEvent    = [ 'ghostlyEvent',  object ];
export type GhostlyResponse = [ 'ghostlyACK',    string | Uint8Array | object | null ] |
                              [ 'ghostlyNACK',   string | Uint8Array | object | null ];
export type GhostlyPacket   = [ string, string | null, ('Uint8Array' | 'JSON')? ];
