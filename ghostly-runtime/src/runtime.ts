import { AttachmentInfo, GhostlyError, GhostlyRequest, Model, PreviewCommand, PreviewResult, Template, View } from './types';

let source: Window | null = null;
let error: Error | string | null = null;
let events: Array<MessageEvent<GhostlyRequest>> = [];
let handler: ((event: MessageEvent<GhostlyRequest>) => void) | null = null;

if (typeof addEventListener === 'function') { // Don't crash in non-DOM environments
    addEventListener('message', (event: MessageEvent<GhostlyRequest>) => {
        if (Array.isArray(event.data) && /^ghostly[A-Z]/.test(event.data[0])) {
            handler ? handler(event) : events.push(event);
        }
    });

    addEventListener('error', (event) => {
        error ??= event.error ?? event.message
    });
}

function checkError() {
    try {
        if (error !== null) {
            throw error;
        }
    }
    finally {
        error = null;
    }
}

function unknownMethod(method: string): () => never {
    return () => {
        throw new GhostlyError(`${method}() is not a known method`, 'unknown-method');
    };
}

/**
 * Filters the value to allow only types that are compatible with Ghostly Engine, `postMessage()` and JSON.
 *
 * Unsupported or recursive types are replaced with `undefined` (which will later be ignored when serializing as JSON).
 * `Object.getOwnPropertyNames()` ensures `stack` and `message` of `Error` objects are passed though.
 */
function transportable(value: any, visited = new Set()): any {
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === undefined || value === null ||
        value instanceof String || value instanceof Number || value instanceof Boolean || value instanceof Date || value instanceof Uint8Array) {
         return value;
    }

    if (!visited.has(value)) {
        visited = new Set(visited);
        visited.add(value);

        if (Array.isArray(value)) {
            return value.map((item) => transportable(item, visited));
        }
        else if (typeof value === 'object') {
            return Object.getOwnPropertyNames(value).reduce((object, name) => (object[name] = transportable(value[name], visited), object), {} as any);
        }
    }

    return undefined;
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
            throw new GhostlyError('ghostlyInit() must be implemented to initialize the model');
        },

        ghostlyRender(view: View): never {
            throw new GhostlyError(`ghostlyRender() must be implemented to render the view '${view.contentType}'`);
        },

        ghostlyFetch(attachmentInfo: AttachmentInfo): never {
            throw new GhostlyError(`ghostlyFetch() must be implemented to render the attachment ${attachmentInfo.name}`);
        },

        ghostlyPreview(command: PreviewCommand = {}): PreviewResult {
            const { width, height } = getComputedStyle(document.documentElement);

            if (command.print) {
                setTimeout(() => print(), 1); // Don't block
            }

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
            throw new GhostlyError('ghostly.init: Ghostly already initialized!');
        }
        else if (!impl) {
            throw new GhostlyError('ghostly.init: Missing GhostlyTemplate implementation!');
        }

        handler = (event) => {
            const request = event.data;
            const method  = impl[request[0]] ?? ghostly.defaults[request[0]] ?? unknownMethod(request[0]) as any;
            const sender  = source = event.source as Window;

            Promise.resolve()
                .then(()    => checkError())
                .then(()    => method.call(impl, request[1]))
                .then((res) => sender.postMessage(['ghostlyACK', transportable(res) ?? null], '*'))
                .catch((err: ReferenceError | GhostlyError | unknown) => {
                    try {
                        sender.postMessage(['ghostlyNACK', transportable(err) ?? null], '*');
                    }
                    catch (ex) {
                        sender.postMessage(['ghostlyNACK', `${ex}: ${err}`], '*');
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
            source.postMessage(['ghostlyEvent', transportable(message)], '*');
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
