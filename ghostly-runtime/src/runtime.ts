import type { GhostlyRequest, Model, Template, View } from './types';

let source: Window | null = null;
let events: Array<MessageEvent<GhostlyRequest>> = [];
let handler: ((event: MessageEvent<GhostlyRequest>) => void) | null = null;

if (typeof addEventListener === 'function') { // Don't crash in non-DOM environments
    addEventListener?.("message", (event: MessageEvent<GhostlyRequest>) => {
        if (Array.isArray(event.data) && /^ghostly[A-Z]/.test(event.data[0])) {
            handler ? handler(event) : events.push(event);
        }
    });
}

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

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ghostly {
    export const defaults: Template = {
        ghostlyLoad(_url: string) {
            // Do nothing
        },

        ghostlyInit(_model: Model) {
            throw new Error('ghostlyInit: This method must be implemented!');
        },

        ghostlyRender(_view: View) {
            throw new Error('ghostlyRender: This method must be implemented!');
        },
    }

    export function init(impl: Template): void {
        if (handler) {
            throw new Error("ghostly.init: Ghostly already initialized!");
        }
        else if (!impl) {
            throw new Error("ghostly.init: Missing GhostlyTemplate implementation!");
        }

        handler = (event) => {
            const request = event.data;
            const method  = impl[request[0]] ?? ghostly.defaults[request[0]] as any; // Note: can be undefined!
            const sender  = source = event.source as Window;

            Promise.resolve()
                .then(()    => method.call(impl, request[1]))
                .then((res) => sender.postMessage(['ghostlyACK', res ?? null], "*"))
                .catch((err: ReferenceError | GhostlyError | unknown) => {
                    try {
                        sender.postMessage(['ghostlyNACK', err instanceof Error ? { ...err, message: err.message } : String(err)], "*");
                    }
                    catch (ex) {
                        sender.postMessage(['ghostlyNACK', `${ex}: ${err}`], "*");
                    }
                })
                .then(() => source = null);
        };

        events.forEach(handler);
        events = [];
    }

    /** @deprecated */
    export const template = init;

    export function notify(message: object): void {
        if (!source) {
            throw new Error(`ghostly.notify: No Ghostly operation is currently in progress`);
        }
        else if (!message || typeof message !== 'object') {
            throw new TypeError(`ghostly.notify: Message must be an object`);
        }
        else {
            source.postMessage(['ghostlyEvent', message], "*");
        }
    }

    export function destroy(_impl: Template): void {
        handler = null;
    }

    export function parse(model: Model): object | Document {
        if (typeof model.document === 'string') {
            if (/^(application\/json|[^/]+\/[^+]+\+json)$/.test(model.contentType)) {
                return JSON.parse(model.document);
            }
            else if (model.contentType === 'text/html' || model.contentType === 'image/svg+xml') {
                return new DOMParser().parseFromString(model.document, model.contentType);
            }
            else if (/^(text\/xml|application\/xml|[^/]+\/[^+]+\+xml)$/.test(model.contentType)) {
                return new DOMParser().parseFromString(model.document, 'application/xml');
            }
            else {
                throw new TypeError('ghostly.parse: Cannot parse ' + model.contentType + ' documents');
            }
        }
        else if (model.document && typeof model.document === 'object') {
            return model.document;
        }

        throw new TypeError(`ghostly.parse: Cannot parse ${typeof model.document} documents as ${model.contentType}`);
    }
}
