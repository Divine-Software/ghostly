(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define('@divine/ghostly-runtime', factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, (global['@divine'] = global['@divine'] || {}, global['@divine']['ghostly-runtime'] = factory()));
}(this, (function () { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	var build = {};

	var driver = {};

	var types = {};

	var __extends$1 = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    };
	    return function (d, b) {
	        if (typeof b !== "function" && b !== null)
	            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	types.__esModule = true;
	types.GhostlyError = void 0;
	/** An Error class that can propage an extra data member back to the controlling application/driver. */
	var GhostlyError = /** @class */ (function (_super) {
	    __extends$1(GhostlyError, _super);
	    function GhostlyError(message, data) {
	        var _this = _super.call(this, message) || this;
	        _this.data = data;
	        if (Object.getPrototypeOf(_this) !== GhostlyError.prototype) {
	            Object.setPrototypeOf(_this, GhostlyError.prototype);
	        }
	        return _this;
	    }
	    GhostlyError.prototype.toString = function () {
	        return "GhostlyError: " + this.message + ": " + (this.data instanceof Error ? String(this.data) : JSON.stringify(this.data));
	    };
	    return GhostlyError;
	}(Error));
	types.GhostlyError = GhostlyError;

	var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    };
	    return function (d, b) {
	        if (typeof b !== "function" && b !== null)
	            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	var __assign = (commonjsGlobal && commonjsGlobal.__assign) || function () {
	    __assign = Object.assign || function(t) {
	        for (var s, i = 1, n = arguments.length; i < n; i++) {
	            s = arguments[i];
	            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	                t[p] = s[p];
	        }
	        return t;
	    };
	    return __assign.apply(this, arguments);
	};
	var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	var __values = (commonjsGlobal && commonjsGlobal.__values) || function(o) {
	    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
	    if (m) return m.call(o);
	    if (o && typeof o.length === "number") return {
	        next: function () {
	            if (o && i >= o.length) o = void 0;
	            return { value: o && o[i++], done: !o };
	        }
	    };
	    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
	};
	driver.__esModule = true;
	driver.parseGhostlyPacket = driver.sendGhostlyMessage = driver.PreviewDriver = driver.TemplateDriver = void 0;
	var types_1 = types;
	/** Helper class to invoke the defined protocol methods using a user-defined [[sendMessage]] implementation. */
	var TemplateDriver = /** @class */ (function () {
	    function TemplateDriver() {
	    }
	    TemplateDriver.prototype.ghostlyLoad = function (template) {
	        return __awaiter(this, void 0, void 0, function () {
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0: return [4 /*yield*/, this.sendMessage(['ghostlyLoad', template])];
	                    case 1:
	                        _a.sent();
	                        this._template = template;
	                        return [2 /*return*/];
	                }
	            });
	        });
	    };
	    TemplateDriver.prototype.ghostlyInit = function (model) {
	        var _a;
	        return __awaiter(this, void 0, void 0, function () {
	            var info, _b, _c, ai;
	            var e_1, _d;
	            return __generator(this, function (_e) {
	                switch (_e.label) {
	                    case 0: return [4 /*yield*/, this.sendMessage(['ghostlyInit', model])];
	                    case 1:
	                        info = _e.sent();
	                        if (info) { // Validate ResultInfo
	                            if (typeof info !== 'object' ||
	                                typeof info.name !== 'string' ||
	                                info.description !== undefined && typeof info.description !== 'string' ||
	                                info.attachments !== undefined && !Array.isArray(info.attachments)) {
	                                throw new types_1.GhostlyError(this._template + ": ghostlyInit did not return a valid ResultInfo object", info);
	                            }
	                            try {
	                                for (_b = __values((_a = info.attachments) !== null && _a !== void 0 ? _a : []), _c = _b.next(); !_c.done; _c = _b.next()) {
	                                    ai = _c.value;
	                                    if (typeof ai.contentType !== 'string' ||
	                                        typeof ai.name !== 'string' ||
	                                        ai.description !== undefined && typeof ai.description !== 'string') {
	                                        throw new types_1.GhostlyError(this._template + ": ghostlyInit returned an invalid AttachmentInfo record", ai);
	                                    }
	                                }
	                            }
	                            catch (e_1_1) { e_1 = { error: e_1_1 }; }
	                            finally {
	                                try {
	                                    if (_c && !_c.done && (_d = _b["return"])) _d.call(_b);
	                                }
	                                finally { if (e_1) throw e_1.error; }
	                            }
	                        }
	                        return [2 /*return*/, info !== null && info !== void 0 ? info : undefined];
	                }
	            });
	        });
	    };
	    TemplateDriver.prototype.ghostlyRender = function (view) {
	        return __awaiter(this, void 0, void 0, function () {
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0: return [4 /*yield*/, this.sendMessage(['ghostlyRender', view])];
	                    case 1: return [2 /*return*/, _a.sent()];
	                }
	            });
	        });
	    };
	    TemplateDriver.prototype.ghostlyFetch = function (info) {
	        return __awaiter(this, void 0, void 0, function () {
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0: return [4 /*yield*/, this.sendMessage(['ghostlyFetch', info])];
	                    case 1: return [2 /*return*/, _a.sent()];
	                }
	            });
	        });
	    };
	    TemplateDriver.prototype.ghostlyPreview = function (command) {
	        var _a, _b;
	        if (command === void 0) { command = {}; }
	        return __awaiter(this, void 0, void 0, function () {
	            var info;
	            return __generator(this, function (_c) {
	                switch (_c.label) {
	                    case 0: return [4 /*yield*/, this.sendMessage(['ghostlyPreview', command])];
	                    case 1:
	                        info = _c.sent();
	                        if (typeof ((_a = info === null || info === void 0 ? void 0 : info.documentStyle) === null || _a === void 0 ? void 0 : _a.height) !== 'string' ||
	                            typeof ((_b = info === null || info === void 0 ? void 0 : info.documentStyle) === null || _b === void 0 ? void 0 : _b.width) !== 'string') {
	                            throw new types_1.GhostlyError("ghostlyPreview returned an invalid ViewInfo record", info);
	                        }
	                        return [2 /*return*/, info];
	                }
	            });
	        });
	    };
	    TemplateDriver.prototype.ghostlyEnd = function () {
	        return __awaiter(this, void 0, void 0, function () {
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0: return [4 /*yield*/, this.sendMessage(['ghostlyEnd', null])];
	                    case 1:
	                        _a.sent();
	                        return [2 /*return*/];
	                }
	            });
	        });
	    };
	    return TemplateDriver;
	}());
	driver.TemplateDriver = TemplateDriver;
	function sleep(ms) {
	    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
	}
	/** A utility class for rendering a template as HTML to an IFrame in a web browser (not using Ghostly Engine. */
	var PreviewDriver = /** @class */ (function (_super) {
	    __extends(PreviewDriver, _super);
	    /**
	     * @param _target         The name of the IFrame to control.
	     * @param _onGhostlyEvent The default event handler to use. Defauts to just logging the event to the console.
	     */
	    function PreviewDriver(_target, _onGhostlyEvent) {
	        var _this = _super.call(this) || this;
	        _this._target = _target;
	        _this._onGhostlyEvent = _onGhostlyEvent !== null && _onGhostlyEvent !== void 0 ? _onGhostlyEvent : (function () { return console.info("Event from " + _this._template + ":", event); });
	        return _this;
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
	    PreviewDriver.prototype.renderPreview = function (template, document, contentType, params, onGhostlyEvent) {
	        var _a;
	        return __awaiter(this, void 0, void 0, function () {
	            var target, oldEventHandler, result, info, _b, _c, ai, _d, _e, _f, e_2_1, _g;
	            var e_2, _h, _j;
	            var _this = this;
	            return __generator(this, function (_k) {
	                switch (_k.label) {
	                    case 0:
	                        target = this.target();
	                        if (template.indexOf('#') < 0) {
	                            template += '#';
	                        }
	                        return [4 /*yield*/, new Promise(function (resolve, reject) {
	                                var _a;
	                                var onLoad = function (_ev) { return (cleanUp(), resolve()); };
	                                var onError = function (ev) { var _a; return (cleanUp(), reject((_a = ev.error) !== null && _a !== void 0 ? _a : ev)); };
	                                var cleanUp = function () {
	                                    target.removeEventListener('load', onLoad);
	                                    target.removeEventListener('error', onError);
	                                };
	                                target.addEventListener('load', onLoad);
	                                target.addEventListener('error', onError);
	                                target.contentWindow.location.href = template;
	                                if (template.replace(/#.*/, '') === ((_a = _this._template) === null || _a === void 0 ? void 0 : _a.replace(/#.*/, ''))) {
	                                    // URL not really changed, so no 'load' event will be triggered; resolve immediately instead
	                                    onLoad();
	                                }
	                            })];
	                    case 1:
	                        _k.sent();
	                        oldEventHandler = this._onGhostlyEvent;
	                        this._onGhostlyEvent = onGhostlyEvent !== null && onGhostlyEvent !== void 0 ? onGhostlyEvent : oldEventHandler;
	                        _k.label = 2;
	                    case 2:
	                        _k.trys.push([2, , 16, 17]);
	                        result = [];
	                        if (!(template !== this._template)) return [3 /*break*/, 4];
	                        return [4 /*yield*/, this.ghostlyLoad(template)];
	                    case 3:
	                        _k.sent();
	                        _k.label = 4;
	                    case 4: return [4 /*yield*/, this.ghostlyInit({ document: document, contentType: contentType })];
	                    case 5:
	                        info = _k.sent();
	                        _k.label = 6;
	                    case 6:
	                        _k.trys.push([6, 11, 12, 13]);
	                        _b = __values((_a = info === null || info === void 0 ? void 0 : info.attachments) !== null && _a !== void 0 ? _a : []), _c = _b.next();
	                        _k.label = 7;
	                    case 7:
	                        if (!!_c.done) return [3 /*break*/, 10];
	                        ai = _c.value;
	                        _e = (_d = result).push;
	                        _f = [__assign({}, ai)];
	                        _j = {};
	                        return [4 /*yield*/, this.ghostlyFetch(ai)];
	                    case 8:
	                        _e.apply(_d, [__assign.apply(void 0, _f.concat([(_j.data = _k.sent(), _j)]))]);
	                        _k.label = 9;
	                    case 9:
	                        _c = _b.next();
	                        return [3 /*break*/, 7];
	                    case 10: return [3 /*break*/, 13];
	                    case 11:
	                        e_2_1 = _k.sent();
	                        e_2 = { error: e_2_1 };
	                        return [3 /*break*/, 13];
	                    case 12:
	                        try {
	                            if (_c && !_c.done && (_h = _b["return"])) _h.call(_b);
	                        }
	                        finally { if (e_2) throw e_2.error; }
	                        return [7 /*endfinally*/];
	                    case 13: return [4 /*yield*/, this.ghostlyRender({ contentType: 'text/html; charset="utf-8"', params: params })];
	                    case 14:
	                        _k.sent();
	                        _g = target.style;
	                        return [4 /*yield*/, this.ghostlyPreview()];
	                    case 15:
	                        _g.height = (_k.sent()).documentStyle.height;
	                        return [2 /*return*/, result];
	                    case 16:
	                        this._onGhostlyEvent = oldEventHandler;
	                        return [7 /*endfinally*/];
	                    case 17: return [2 /*return*/];
	                }
	            });
	        });
	    };
	    /**
	     * Clears the preview IFrame by loading `about:blank`.
	     */
	    PreviewDriver.prototype.clearPreview = function () {
	        return __awaiter(this, void 0, void 0, function () {
	            var target;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        target = this.target();
	                        target.contentWindow.location.href = 'about:blank';
	                        _a.label = 1;
	                    case 1:
	                        _a.label = 2;
	                    case 2:
	                        _a.trys.push([2, 4, , 5]);
	                        return [4 /*yield*/, sleep(10)];
	                    case 3:
	                        _a.sent();
	                        if (target.contentWindow.location.href === 'about:blank') {
	                            return [3 /*break*/, 6];
	                        }
	                        return [3 /*break*/, 5];
	                    case 4:
	                        _a.sent();
	                        return [3 /*break*/, 5];
	                    case 5: return [3 /*break*/, 1];
	                    case 6:
	                        delete this._template;
	                        return [2 /*return*/];
	                }
	            });
	        });
	    };
	    /**
	     * Prompt the user to print current view.
	     */
	    PreviewDriver.prototype.print = function () {
	        var _this = this;
	        this.ghostlyPreview({ print: true })["catch"](function (err) { return console.info("Failed to print " + _this._template + ":", err); });
	    };
	    /**
	     * Returns the target IFrame based on the `_target` constructor parameter. May be overridden.
	     *
	     * @returns The IFrame to preview the template in.
	     */
	    PreviewDriver.prototype.target = function () {
	        var target = document.querySelector("iframe[name = " + this._target + "]");
	        if (!target) {
	            throw new types_1.GhostlyError("No iframe named '" + this._target + "' found!");
	        }
	        return target;
	    };
	    /**
	     * A browser-only implementation that just sends the message and directly unpacks the response.
	     *
	     * @param request The raw request to send.
	     * @returns       The unpacked response.
	     */
	    PreviewDriver.prototype.sendMessage = function (request) {
	        var _this = this;
	        return sendGhostlyMessage(this.target().contentWindow, request, function (ev) { return _this._onGhostlyEvent(ev); })
	            .then(function (packet) { return parseGhostlyPacket(request, packet); });
	    };
	    return PreviewDriver;
	}(TemplateDriver));
	driver.PreviewDriver = PreviewDriver;
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
	function sendGhostlyMessage(target, request, onGhostlyEvent, timeout) {
	    return new Promise(function (resolve, reject) {
	        var watchdog = -1;
	        var resetWatchdog = function () {
	            clearTimeout(watchdog);
	            watchdog = setTimeout(function () {
	                removeEventListener('message', eventListener);
	                reject(new RangeError("sendGhostlyMessage: Command " + request[0] + " timed out"));
	            }, (timeout || 10) * 1000);
	        };
	        var uint8ArrayToString = function (value) { return Array.from(value).map(function (v) { return String.fromCharCode(v); }).join(''); };
	        var eventListener = function (event) {
	            var _a;
	            var response = event.data;
	            if (Array.isArray(response) && response[0] === 'ghostlyEvent' && typeof response[1] === 'object') {
	                resetWatchdog();
	                if (response[1]) {
	                    try {
	                        onGhostlyEvent === null || onGhostlyEvent === void 0 ? void 0 : onGhostlyEvent(response[1]);
	                    }
	                    catch (err) {
	                        console.error("sendGhostlyMessage() failed to propagate event to onGhostlyEvent() handler", event, err);
	                    }
	                }
	                return;
	            }
	            clearTimeout(watchdog);
	            removeEventListener('message', eventListener);
	            if (!Array.isArray(response) || typeof response[0] !== 'string') {
	                reject(new TypeError("sendGhostlyMessage: Invalid response packet received for command " + request[0] + ": " + response));
	            }
	            else if (response[1] instanceof Uint8Array) {
	                // No Uint8Array support in Playwright; encode as string
	                resolve([response[0], uint8ArrayToString(response[1]), 'Uint8Array']);
	            }
	            else if (response[1] instanceof Object) {
	                // Ensure only serializable data is sent by encoding as string
	                resolve([response[0], JSON.stringify(response[1]), 'JSON']);
	            }
	            else {
	                resolve([response[0], (_a = response[1]) !== null && _a !== void 0 ? _a : null]);
	            }
	        };
	        addEventListener('message', eventListener);
	        resetWatchdog();
	        target.postMessage(request, '*');
	    });
	}
	driver.sendGhostlyMessage = sendGhostlyMessage;
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
	function parseGhostlyPacket(request, response) {
	    var stringToUint8Array = function (value) { return Uint8Array.from(Array.from(value).map(function (c) { return c.charCodeAt(0); })); };
	    var result = typeof response[1] === 'string' ?
	        (response[2] === 'JSON' ? JSON.parse(response[1])
	            : response[2] === 'Uint8Array' ? stringToUint8Array(response[1])
	                : response[1])
	        : null;
	    if (response[0] === 'ghostlyACK') {
	        return result;
	    }
	    else {
	        throw new types_1.GhostlyError(request[0] + " failed: " + response[0], result);
	    }
	}
	driver.parseGhostlyPacket = parseGhostlyPacket;

	var runtime = {};

	(function (exports) {
	exports.__esModule = true;
	exports.ghostly = void 0;
	var types_1 = types;
	var source = null;
	var error = null;
	var events = [];
	var handler = null;
	if (typeof addEventListener === 'function') { // Don't crash in non-DOM environments
	    addEventListener('message', function (event) {
	        if (Array.isArray(event.data) && /^ghostly[A-Z]/.test(event.data[0])) {
	            handler ? handler(event) : events.push(event);
	        }
	    });
	    addEventListener('error', function (event) {
	        var _a;
	        error !== null && error !== void 0 ? error : (error = (_a = event.error) !== null && _a !== void 0 ? _a : event.message);
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
	function unknownMethod(method) {
	    return function () {
	        throw new types_1.GhostlyError(method + "() is not a known method", 'unknown-method');
	    };
	}
	/**
	 * Filters the value to allow only types that are compatible with Ghostly Engine, `postMessage()` and JSON.
	 *
	 * Unsupported or recursive types are replaced with `undefined` (which will later be ignored when serializing as JSON).
	 * `Object.getOwnPropertyNames()` ensures `stack` and `message` of `Error` objects are passed though.
	 */
	function transportable(value, visited) {
	    if (visited === void 0) { visited = new Set(); }
	    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === undefined || value === null ||
	        value instanceof String || value instanceof Number || value instanceof Boolean || value instanceof Date || value instanceof Uint8Array) {
	        return value;
	    }
	    if (!visited.has(value)) {
	        visited = new Set(visited);
	        visited.add(value);
	        if (Array.isArray(value)) {
	            return value.map(function (item) { return transportable(item, visited); });
	        }
	        else if (typeof value === 'object') {
	            return Object.getOwnPropertyNames(value).reduce(function (object, name) { return (object[name] = transportable(value[name], visited), object); }, {});
	        }
	    }
	    return undefined;
	}
	(function (ghostly) {
	    /**
	     * @private
	     * @internal
	     */
	    ghostly.defaults = {
	        ghostlyLoad: function (_url) {
	            // Do nothing
	        },
	        ghostlyInit: function (_model) {
	            throw new types_1.GhostlyError('ghostlyInit() must be implemented to initialize the model');
	        },
	        ghostlyRender: function (view) {
	            throw new types_1.GhostlyError("ghostlyRender() must be implemented to render the view '" + view.contentType + "'");
	        },
	        ghostlyFetch: function (attachmentInfo) {
	            throw new types_1.GhostlyError("ghostlyFetch() must be implemented to render the attachment " + attachmentInfo.name);
	        },
	        ghostlyPreview: function (command) {
	            if (command === void 0) { command = {}; }
	            var _a = getComputedStyle(document.documentElement), width = _a.width, height = _a.height;
	            if (command.print) {
	                setTimeout(function () { return print(); }, 1); // Don't block
	            }
	            return {
	                documentStyle: { width: width, height: height }
	            };
	        },
	        ghostlyEnd: function () {
	            // Do nothing
	        }
	    };
	    /**
	     * Initializes Ghostly and activates a [[Template]] implementation.
	     *
	     * @param impl The Ghostly interface implementation to use for this template.
	     */
	    function init(impl) {
	        if (handler) {
	            throw new types_1.GhostlyError('ghostly.init: Ghostly already initialized!');
	        }
	        else if (!impl) {
	            throw new types_1.GhostlyError('ghostly.init: Missing GhostlyTemplate implementation!');
	        }
	        handler = function (event) {
	            var _a, _b;
	            var request = event.data;
	            var method = (_b = (_a = impl[request[0]]) !== null && _a !== void 0 ? _a : ghostly.defaults[request[0]]) !== null && _b !== void 0 ? _b : unknownMethod(request[0]);
	            var sender = source = event.source;
	            Promise.resolve()
	                .then(function () { return checkError(); })
	                .then(function () { return method.call(impl, request[1]); })
	                .then(function (res) { var _a; return sender.postMessage(['ghostlyACK', (_a = transportable(res)) !== null && _a !== void 0 ? _a : null], '*'); })["catch"](function (err) {
	                var _a;
	                try {
	                    sender.postMessage(['ghostlyNACK', (_a = transportable(err)) !== null && _a !== void 0 ? _a : null], '*');
	                }
	                catch (ex) {
	                    sender.postMessage(['ghostlyNACK', ex + ": " + err], '*');
	                }
	            })
	                .then(function () { return source = null; });
	        };
	        events.forEach(handler);
	        events = [];
	    }
	    ghostly.init = init;
	    /**
	     * @deprecated
	     * @internal
	     */
	    ghostly.template = init;
	    /**
	     * Send a custom message to the controlling application/driver.
	     *
	     * Note: This method is only valid any of the [[Template]] implementation methods is executing.
	     *
	     * @param message The message to send, or `null` for just letting the driver know you're still alive.
	     */
	    function notify(message) {
	        if (!source) {
	            throw new types_1.GhostlyError("ghostly.notify: No Ghostly operation is currently in progress", message);
	        }
	        else if (typeof message !== 'object') {
	            throw new types_1.GhostlyError("ghostly.notify: Message must be an object", message);
	        }
	        else {
	            source.postMessage(['ghostlyEvent', transportable(message)], '*');
	        }
	    }
	    ghostly.notify = notify;
	    /**
	     * Deactivates the [[Template]] implementation.
	     *
	     * @param impl The implementation that was previously installed by the [[init]] method.
	     */
	    function destroy(impl) {
	        handler = null;
	    }
	    ghostly.destroy = destroy;
	    /**
	     * Helper method that can be used to parse a [[Model]] object as JSON, HTML or XML.
	     *
	     * @param model A model received by [[ghostlyInit]].
	     */
	    function parse(model) {
	        var contentType = model.contentType.replace(/;.*/, '').trim();
	        if (typeof model.document === 'string') {
	            if (/^(application\/json|[^/]+\/[^+]+\+json)$/.test(contentType)) {
	                return JSON.parse(model.document);
	            }
	            else if (contentType === 'text/html' || contentType === 'image/svg+xml') {
	                return new DOMParser().parseFromString(model.document, contentType);
	            }
	            else if (/^(text\/xml|application\/xml|[^/]+\/[^+]+\+xml)$/.test(contentType)) {
	                return new DOMParser().parseFromString(model.document, 'application/xml');
	            }
	            else {
	                throw new types_1.GhostlyError('ghostly.parse: Cannot parse ' + contentType + ' documents', model);
	            }
	        }
	        else if (model.document && typeof model.document === 'object') {
	            return model.document;
	        }
	        throw new types_1.GhostlyError("ghostly.parse: Cannot parse " + typeof model.document + " documents as " + model.contentType, model);
	    }
	    ghostly.parse = parse;
	})(exports.ghostly || (exports.ghostly = {}));

	}(runtime));

	(function (exports) {
	var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
	}) : (function(o, m, k, k2) {
	    if (k2 === undefined) k2 = k;
	    o[k2] = m[k];
	}));
	var __exportStar = (commonjsGlobal && commonjsGlobal.__exportStar) || function(m, exports) {
	    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
	};
	exports.__esModule = true;
	__exportStar(driver, exports);
	__exportStar(runtime, exports);
	__exportStar(types, exports);

	}(build));

	var index = /*@__PURE__*/getDefaultExportFromCjs(build);

	return index;

})));
//# sourceMappingURL=index.umd.js.map
