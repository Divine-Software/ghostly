import { AttachmentInfo, GhostlyError, GhostlyEvent, GhostlyPacket, GhostlyRequest, GhostlyResponse, GhostlyTypes, Model, ModelInfo, OnGhostlyEvent, Template, View, PreviewResult, PreviewCommand } from './types';

/** Helper class to invoke the defined protocol methods using a user-defined [[sendMessage]] implementation. */
export abstract class TemplateDriver implements Template {
    protected _template?: string;

    async ghostlyLoad(template: string): Promise<void> {
        await this.sendMessage([ 'ghostlyLoad', template] );
        this._template = template;
    }

    async ghostlyInit(model: Model): Promise<ModelInfo | undefined> {
        const info = await this.sendMessage([ 'ghostlyInit', model ]) as ModelInfo | null;

        if (info) { // Validate ResultInfo
            if (typeof info !== 'object' ||
                typeof info.name !== 'string' ||
                info.description !== undefined && typeof info.description !== 'string' ||
                info.attachments !== undefined && !Array.isArray(info.attachments)) {
                throw new GhostlyError(`${this._template}: ghostlyInit did not return a valid ResultInfo object`, info);
            }

            for (const ai of info.attachments ?? []) {
                if (typeof ai.contentType !== 'string' ||
                    typeof ai.name !== 'string' ||
                    ai.description !== undefined && typeof ai.description !== 'string') {
                    throw new GhostlyError(`${this._template}: ghostlyInit returned an invalid AttachmentInfo record`, ai);
                }
            }
        }

        return info ?? undefined;
    }

    async ghostlyRender(view: View): Promise<GhostlyTypes> {
        return await this.sendMessage([ 'ghostlyRender', view ])
    }

    async ghostlyFetch(info: AttachmentInfo): Promise<GhostlyTypes> {
        return await this.sendMessage([ 'ghostlyFetch', info ]);
    }

    async ghostlyPreview(command: PreviewCommand = {}): Promise<PreviewResult> {
        const info = await this.sendMessage([ 'ghostlyPreview', command ]) as PreviewResult;

        if (typeof info?.documentStyle?.height !== 'string' ||
            typeof info?.documentStyle?.width  !== 'string') {
            throw new GhostlyError(`ghostlyPreview returned an invalid ViewInfo record`, info);
        }

        return info;
    }

    async ghostlyEnd(): Promise<void> {
        await this.sendMessage([ 'ghostlyEnd', null ]);
    }

    /**
     * Abstract method that must be provided by subclasses. Should send the request to the template, wait for response
     * and then unpack and return the result.
     *
     * @param request The raw request to send.
     * @returns       The unpacked response.
     */
    protected abstract sendMessage(request: GhostlyRequest): Promise<GhostlyTypes>;
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/** An object that holds metainfo and the attachment response. Returned by [[renderPreview]]. */
export interface PreviewAttachment extends AttachmentInfo {
    /** The unpacked response to the [[ghostlyFetch]] request. Will be `null` if the template returned nothing. */
    data: GhostlyTypes;
}

/** A utility class for rendering a template as HTML to an IFrame in a web browser (not using Ghostly Engine. */
export class PreviewDriver extends TemplateDriver {
    private _onGhostlyEvent: OnGhostlyEvent;

    /**
     * @param _target         The name of the IFrame to control.
     * @param _onGhostlyEvent The default event handler to use. Defauts to just logging the event to the console.
     */
    constructor(protected _target: string, _onGhostlyEvent?: OnGhostlyEvent) {
        super();

        this._onGhostlyEvent = _onGhostlyEvent ?? (() => console.info(`Event from ${this._template}:`, event));
    }

    /**
     * Renders the provided model as HTML to the target IFrame, and then returns all attachments.
     *
     * Note that all attachments are returned as-is from the template, so if an attachment is supposed to be rendered by
     * the engine, `data` will be null. Only attachments where the template returns actual data will work.
     *
     * Note that [[ghostlyEnd]] will not be invoked by this method, since that would affect the preview result.
     *
     * @param template       The URL to the Ghostly template to use.
     * @param document       The model data, as JSON or a string.
     * @param contentType    The model's media type, used as an indication to the template how `document` should be parsed.
     * @param params         Optional view params (as JSON).
     * @param onGhostlyEvent Optional event handler to use. Will fallback to the default event handler if unspecified.
     * @returns              An array of [[PreviewAttachment]] objects representing all attachments the template
     * produced.
     */
    async renderPreview(template: string, document: string | object, contentType: string, params?: unknown, onGhostlyEvent?: OnGhostlyEvent): Promise<PreviewAttachment[]> {
        const target = this.target();

        if (template.indexOf('#') < 0) {
            template += '#';
        }

        await new Promise<void>((resolve, reject) => {
            const onLoad  = (_ev: Event)     => (cleanUp(), resolve());
            const onError = (ev: ErrorEvent) => (cleanUp(), reject(ev.error ?? ev));
            const cleanUp = () => {
                target.removeEventListener('load',  onLoad);
                target.removeEventListener('error', onError);
            }

            target.addEventListener('load',  onLoad);
            target.addEventListener('error', onError);

            target.contentWindow!.location.href = template;

            if (template.replace(/#.*/, '') === this._template?.replace(/#.*/, '')) {
                // URL not really changed, so no 'load' event will be triggered; resolve immediately instead
                onLoad(null!);
            }
        });

        const oldEventHandler = this._onGhostlyEvent;
        this._onGhostlyEvent  = onGhostlyEvent ?? oldEventHandler;

        try {
            const result: PreviewAttachment[] = [];

            if (template !== this._template) {
                await this.ghostlyLoad(template);
            }

            const info = await this.ghostlyInit({ document, contentType });

            for (const ai of info?.attachments ?? []) {
                result.push({ ... ai, data: await this.ghostlyFetch(ai) });
            }

            await this.ghostlyRender({ contentType: 'text/html; charset="utf-8"', params })
            target.style.height = (await this.ghostlyPreview()).documentStyle.height;

            return result;
        }
        finally {
            this._onGhostlyEvent = oldEventHandler;
        }
    }

    /**
     * Clears the preview IFrame by loading `about:blank`.
     */
    async clearPreview(): Promise<void> {
        const target = this.target();

        target.contentWindow!.location.href = 'about:blank';

        while (true) {
            try {
                await sleep(10);

                if (target.contentWindow!.location.href === 'about:blank') {
                    break;
                }
            }
            catch (err) {
                // Keep waiting ...
            }
        }

        delete this._template;
    }

    /**
     * Prompt the user to print current view.
     */
    print(): void {
        this.ghostlyPreview({ print: true })
            .catch((err) => console.info(`Failed to print ${this._template}:`, err));
    }

    /**
     * Returns the target IFrame based on the `_target` constructor parameter. May be overridden.
     *
     * @returns The IFrame to preview the template in.
     */

    protected target(): HTMLIFrameElement {
        const target = document.querySelector<HTMLIFrameElement>(`iframe[name = ${this._target}]`);

        if (!target) {
            throw new GhostlyError(`No iframe named '${this._target}' found!`);
        }

        return target;
    }

    /**
     * A browser-only implementation that just sends the message and directly unpacks the response.
     *
     * @param request The raw request to send.
     * @returns       The unpacked response.
     */
    protected sendMessage(request: GhostlyRequest): Promise<GhostlyTypes> {
        return sendGhostlyMessage(this.target().contentWindow!, request, (ev) => this._onGhostlyEvent(ev))
            .then((packet) => parseGhostlyPacket(request, packet));
    }
}

/**
 * Sends a command to the Ghostly template and marshals the result so it can be transferred from browser to Node.js.
 *
 * NOTE: This function must be self-contained and serializable, since the Ghostly Engine will inject it into the
 * Playwright browser instance! No external helper functions or too fancy JS/TS allowed (including GhostlyError).
 *
 * @param target         The window where the Ghostly template is running.
 * @param request        The command to send.
 * @param onGhostlyEvent An optional handler that will be invoked when a the template calls [[notify]].
 * @param timeout        An optional timeout, in seconds, to wait for a response, before an error is thrown. Defaults to 10 s.
 * @returns              The raw response packet. Must be unpacked using [[parseGhostlyPacket]].
 *
 * @throws RangeError    The command timed out.
 * @throws TypeError     The template returned an illegal response packet.
 *
 * @see parseGhostlyPacket
 * @see TemplateDriver
 * @see PreviewDriver
 *
 */
 export function sendGhostlyMessage(target: Window, request: GhostlyRequest, onGhostlyEvent?: OnGhostlyEvent, timeout?: number): Promise<GhostlyPacket> {
    return new Promise((resolve, reject) => {
        let watchdog = -1;

        const resetWatchdog = () => {
            clearTimeout(watchdog);
            watchdog = setTimeout(() => {
                removeEventListener('message', eventListener);
                reject(new RangeError(`sendGhostlyMessage: Command ${request[0]} timed out`));
            }, (timeout || 10) * 1000);
        }

        const uint8ArrayToString = (value: Uint8Array) => Array.from(value).map((v) => String.fromCharCode(v)).join('');

        const eventListener = (event: MessageEvent<GhostlyEvent | GhostlyResponse>) => {
            const response = event.data;

            if (Array.isArray(response) && response[0] === 'ghostlyEvent' && typeof response[1] === 'object') {
                resetWatchdog();

                if (response[1]) {
                    try {
                        onGhostlyEvent?.(response[1]);
                    }
                    catch (err) {
                        console.error(`sendGhostlyMessage() failed to propagate event to onGhostlyEvent() handler`, event, err);
                    }
                }

                return;
            }

            clearTimeout(watchdog);
            removeEventListener('message', eventListener);

            if (!Array.isArray(response) || typeof response[0] !== 'string') {
                reject(new TypeError(`sendGhostlyMessage: Invalid response packet received for command ${request[0]}: ${response}`));
            }
            else if (response[1] instanceof Uint8Array) {
                // No Uint8Array support in Playwright; encode as string
                resolve([ response[0], uint8ArrayToString(response[1]), 'Uint8Array' ]);
            }
            else if (response[1] instanceof Object) {
                // Ensure only serializable data is sent by encoding as string
                resolve([ response[0], JSON.stringify(response[1]), 'JSON' ]);
            }
            else {
                resolve( [ response[0], response[1] ?? null ]);
            }
        };

        addEventListener('message', eventListener);
        resetWatchdog();
        target.postMessage(request, '*');
    });
}

/**
 * Unmarshals a response from [[sendGhostlyMessage]] and either returns the payload or throws an execption.
 *
 * @param request  The request object that was sent via [[sendGhostlyMessage]].
 * @param response The raw response object returned by [[sendGhostlyMessage]].
 * @returns        An unpacked response.

 * @throws GhostlyError
 *
 * @see sendGhostlyMessage
 */
export function parseGhostlyPacket(request: GhostlyRequest, response: GhostlyPacket): GhostlyTypes {
    const stringToUint8Array = (value: string) => Uint8Array.from(Array.from(value).map((c) => c.charCodeAt(0)));

    const result = typeof response[1] === 'string' ?
        ( response[2] === 'JSON'       ? JSON.parse(response[1]) as object
        : response[2] === 'Uint8Array' ? stringToUint8Array(response[1])
        : response[1] )
        : null;

    if (response[0] === 'ghostlyACK') {
        return result;
    }
    else {
        throw new GhostlyError(`${request[0]} failed: ${response[0]}`, result);
    }
}
