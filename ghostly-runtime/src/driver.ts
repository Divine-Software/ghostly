import type { GhostlyPacket, GhostlyRequest, GhostlyResponse } from './types';

/**
 * Convenience function to invoke a command, for pure-browser environments.
 *
 * @param target   The window where the Ghostly template is running.
 * @param request  The command to send.
 * @param timeout  An optional timeout, in seconds, to wait for a response, before an error is thrown. Defaults to 10 s.
 *
 * @see sendGhostlyMessage
 * @see parseGhostlyPacket
 */
export function executeGhostlyCommand(target: Window, request: GhostlyRequest, timeout?: number): Promise<Uint8Array | string | null> {
    return sendGhostlyMessage(target, request, timeout).then((packet) => parseGhostlyPacket(request, packet));
}

/**
 * Sends a command to the Ghostly template and marshals the result so it can be transferred from browser to NodeJS.
 *
 * NOTE: This function must be self-contained and serializable, since `ghostly-engine` will inject it into the
 * Playwright browser instance! No external helper functions or too fancy JS/TS allowed.
 *
 * @param target   The window where the Ghostly template is running.
 * @param request  The command to send.
 * @param timeout  An optional timeout, in seconds, to wait for a response, before an error is thrown. Defaults to 10 s.
 *
 * @see executeGhostlyCommand
 *
 */
 export function sendGhostlyMessage(target: Window, request: GhostlyRequest, timeout?: number): Promise<GhostlyPacket> {
    const uint8ArrayToString = (value: Uint8Array) => Array.from(value).map((v) => String.fromCharCode(v)).join('');

    return new Promise((resolve, reject) => {
        const watchdog = setTimeout(() => {
            removeEventListener('message', eventListener);
            reject(new Error(`sendGhostlyMessage: Command ${request[0]} timed out`));
        }, (timeout || 10) * 1000);

        const eventListener = (event: MessageEvent<GhostlyResponse>) => {
            const response = event.data;

            clearTimeout(watchdog);
            removeEventListener('message', eventListener);

            if (!Array.isArray(response) || typeof response[0] !== 'string') {
                reject(new Error(`sendGhostlyMessage: Invalid response packet received for command ${request[0]}: ${response}`));
            }
            else if (response[1] instanceof Uint8Array) {
                // No Uint8Array support in Playwright; encode as string
                resolve([response[0], uint8ArrayToString(response[1]), 'Uint8Array']);
            }
            else {
                resolve(response as GhostlyPacket);
            }
        };

        addEventListener('message', eventListener);
        target.postMessage(request, '*');
    });
}

/**
 * Unmarshals a response from `sendGhostlyMessage()` and either returns the payload or throws an execption.
 *
 * @param request
 * @param response
 *
 * @see sendGhostlyMessage
 */
export function parseGhostlyPacket(request: GhostlyRequest, response: GhostlyPacket): Uint8Array | string | null {
    const stringToUint8Array = (value: string) => Uint8Array.from(Array.from(value).map((c) => c.charCodeAt(0)));

    const result = typeof response[1] === 'string'
        ? response[2] === 'Uint8Array' ? stringToUint8Array(response[1]) : response[1]
        : null;

    if (response[0] !== 'ghostlyACK') {
        throw new Error(`${request[0]} failed: ${response[0]}: ${result}`);
    }
    else {
        return result;
    }
}
