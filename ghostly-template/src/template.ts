import type { GhostlyRequest, Model, Template, View } from './types';

let events: Array<MessageEvent<GhostlyRequest>> = [];
let handler: ((event: MessageEvent<GhostlyRequest>) => void) | null = null;

if (typeof addEventListener === 'function') { // Don't crash in non-DOM environments
    addEventListener?.("message", (event: MessageEvent<GhostlyRequest>) => {
        if (Array.isArray(event.data) && /^ghostly[A-Z]/.test(event.data[0])) {
            handler ? handler(event) : events.push(event);
        }
    });
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ghostly {
    export const defaults: Template = {
        ghostlyLoad(_url: string) {
            // Do nothing
        },

        ghostlyInit(_source: Model) {
            throw new Error('ghostlyInit() must be implemented!');
        },

        ghostlyRender(_view: View) {
            throw new Error('ghostlyRender() must be implemented!');
        },
    }

    export function init(impl: Template): void {
        if (handler) {
            throw new Error("Ghostly already initialized!");
        }
        else if (!impl) {
            throw new Error("Missing GhostlyTemplate implementation!");
        }

        handler = (event) => {
            const request = event.data;
            const method  = impl[request[0]] ?? ghostly.defaults[request[0]] as any; // Note: can be undefined!
            const source  = event.source as Window;

            Promise.resolve()
                .then(()    => method.call(impl, request[1]))
                .then((res) => source.postMessage(['ghostlyACK', res ?? null], "*"))
                .catch((err: ReferenceError | unknown) => {
                    try {
                        source.postMessage(['ghostlyNACK', err instanceof Error ? err.toString() : err ?? null], "*");
                    }
                    catch (ex) {
                        source.postMessage(['ghostlyNACK', `${ex.message}: ${err}`], "*");
                    }
                });
        };

        events.forEach(handler);
        events = [];
    }

    /** @deprecated */
    export const template = init;

    export function destroy(_impl: Template) {
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
                throw new TypeError('Cannot parse ' + model.contentType + ' documents');
            }
        }
        else if (model.document && typeof model.document === 'object') {
            return model.document;
        }

        throw new TypeError(`Cannot parse ${typeof model.document} documents as ${model.contentType}`);
    }
}
