import { AttachmentInfo, GhostlyError, GhostlyRequest, Model, Template, View, WindowInfo } from './types';

let source: Window | null = null;
let events: Array<MessageEvent<GhostlyRequest>> = [];
let handler: ((event: MessageEvent<GhostlyRequest>) => void) | null = null;

if (typeof addEventListener === 'function') { // Don't crash in non-DOM environments
    addEventListener("message", (event: MessageEvent<GhostlyRequest>) => {
        if (Array.isArray(event.data) && /^ghostly[A-Z]/.test(event.data[0])) {
            handler ? handler(event) : events.push(event);
        }
    });
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ghostly {
    /**
     * @private
     * @internal
     */
    export const defaults: Template = {
        ghostlyLoad(_url: string): void {
            // Do nothing
        },

        ghostlyInit(_model: Model): never {
            throw new GhostlyError('ghostlyInit: This method must be implemented!');
        },

        ghostlyRender(_view: View): never {
            throw new GhostlyError('ghostlyRender: This method must be implemented!');
        },

        ghostlyFetch(_attachmentInfo: AttachmentInfo): never {
            throw new GhostlyError('ghostlyFetch: This method must be implemented!');
        },

        ghostlyInfo(): WindowInfo {
            const { width, height } = getComputedStyle(document.documentElement);

            return {
                documentStyle: { width, height }
            }
        },

        ghostlyEnd(): void {
            // Do nothing
        },
    }

    /**
     * Initializes Ghostly and activates a [[Template]] implementation.
     *
     * @param impl The Ghostly interface implementation to use for this template.
     */
    export function init(impl: Template): void {
        if (handler) {
            throw new GhostlyError("ghostly.init: Ghostly already initialized!");
        }
        else if (!impl) {
            throw new GhostlyError("ghostly.init: Missing GhostlyTemplate implementation!");
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

    /**
     * @deprecated
     * @internal
     */
    export const template = init;

    /**
     * Send a custom message to the controlling application/driver.
     *
     * Note: This method is only valid any of the [[Template]] implementation methods is executing.
     *
     * @param message The message to send, or `null` for just letting the driver know you're still alive.
     */
    export function notify(message: object | null): void {
        if (!source) {
            throw new GhostlyError(`ghostly.notify: No Ghostly operation is currently in progress`, message);
        }
        else if (typeof message !== 'object') {
            throw new GhostlyError(`ghostly.notify: Message must be an object`, message);
        }
        else {
            source.postMessage(['ghostlyEvent', message], "*");
        }
    }

    /**
     * Deactivates the [[Template]] implementation.
     *
     * @param impl The implementation that was previously installed by the [[init]] method.
     */
    export function destroy(impl: Template): void {
        void impl;
        handler = null;
    }

    /**
     * Helper method that can be used to parse a [[Model]] object as JSON, HTML or XML.
     *
     * @param model A model received by [[ghostlyInit]].
     */
    export function parse<T extends object | Document>(model: Model): T {
        const contentType = model.contentType.replace(/;.*/, '').trim();

        if (typeof model.document === 'string') {
            if (/^(application\/json|[^/]+\/[^+]+\+json)$/.test(contentType)) {
                return JSON.parse(model.document);
            }
            else if (contentType === 'text/html' || contentType === 'image/svg+xml') {
                return new DOMParser().parseFromString(model.document, contentType) as T;
            }
            else if (/^(text\/xml|application\/xml|[^/]+\/[^+]+\+xml)$/.test(contentType)) {
                return new DOMParser().parseFromString(model.document, 'application/xml') as T;
            }
            else {
                throw new GhostlyError('ghostly.parse: Cannot parse ' + contentType + ' documents', model);
            }
        }
        else if (model.document && typeof model.document === 'object') {
            return model.document as T;
        }

        throw new GhostlyError(`ghostly.parse: Cannot parse ${typeof model.document} documents as ${model.contentType}`, model);
    }
}
