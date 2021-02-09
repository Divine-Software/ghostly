var ghostly = {};

(function() {
    var events = [];
    var handler = null;

    window.addEventListener("message", function(event) {
        if (event.data && /^ghostly[A-Z]/.test(event.data[0])) {
            handler ? handler(event) : events.push(event);
        }
    });

    ghostly.defaults = {
        /** The default implmentation of ghostlyLoad removes all scripts and normalizes whitespace nodes to one single space */
        ghostlyLoad: function(template) {
            Array.prototype.forEach.call(document.querySelectorAll('script'), function(node) { node.parentNode.removeChild(node); });
            document.normalize();

            for (var walker = document.createTreeWalker(document, NodeFilter.SHOW_TEXT); walker.nextNode();) {
                if (/^\s+$/.test(walker.currentNode.nodeValue)) {
                    walker.currentNode.nodeValue = ' ';
                }
            };
        },

        ghostlyInit: function(document) {
            throw undefined;
        },

        ghostlyRender: function(view) {
            throw undefined;
        },
    };

    ghostly.template = function(impl) {
        return ghostly.init(impl);
    }

    ghostly.init = function(impl) {
        if (handler) {
            throw new Error("Ghostly already initialized!");
        }

        handler = function(event) {
            Promise.resolve()
                .then(function() {
                    return (impl[event.data[0]] || ghostly.defaults[event.data[0]]).call(impl, event.data[1]);
                })
                .then(function(res) {
                    event.source.postMessage(['ghostlyACK',  res || null], "*");
                })
                .catch(function(err) {
                    try {
                        event.source.postMessage(['ghostlyNACK', err instanceof Error ? err.toString() : err || null], "*");
                    }
                    catch (ex) {
                        event.source.postMessage(['ghostlyNACK', ex.message + ': ' + String(err)], "*");
                    }
                });
        };

        events.forEach(handler);
        events = [];
    };

    ghostly.destroy = function(impl) {
        handler = null;
    }

    function name(namespaces, node) {
        var namespace = node.namespaceURI || '';
        var prefix    = namespaces[namespace] !== undefined ? namespaces[namespace] : (namespaces[namespace] = 'ns' + namespaces._cnt++ + '-');

        return prefix + node.localName;
    };

    ghostly.Element = function(namespaces, node) {
        var i;

        Array.call(this);

        this.name = name(namespaces, node);

        for (i = 0; i < node.attributes.length; ++i) {
            this['$' + name(namespaces, node.attributes[i])] = node.attributes[i].value;
        }

        for (i = 0; i < node.childNodes.length; ++i) {
            if (node.childNodes[i].nodeType == 1 /* Element */) {
                this.push(new ghostly.Element(namespaces, node.childNodes[i]));
            }
            else if (node.childNodes[i].nodeType == 3 /* Text */) {
                this.push(node.childNodes[i].nodeValue);
            }
        }
    };

    ghostly.Element.prototype = Object.create(Array.prototype);
    ghostly.Element.prototype.constructor = ghostly.Element;

    ghostly.parse = function(source, xmlPrefixMap) {
        var result;

        if (typeof source.document === 'string') {
            if (source.contentType === 'application/json') {
                result = JSON.parse(source.document);
            }
            else if (source.contentType === 'text/html' || source.contentType === 'image/svg+xml') {
                result = new DOMParser().parseFromString(source.document, source.contentType);
            }
            else if (/^(text\/xml|application\/xml|[^\/]+\/[^+]+\+xml)$/.test(source.contentType)) {
                result = new DOMParser().parseFromString(source.document, 'application/xml');
            }
            else {
                throw new TypeError('Cannot parse ' + source.contentType + ' documents');
            }
        }
        else if (typeof source.document === 'object') {
            result = source.document;
        }
        else {
            throw new TypeError('Cannot parse ' + (typeof source.document) + ' documents as ' + source.contentType);
        }

        if (result instanceof Document && xmlPrefixMap) {
            var namespaces = Object.assign({ _cnt: 0, '': '', 'http://www.w3.org/2000/xmlns/': 'xmlns-' }, xmlPrefixMap);

            result = {
                namespaces: namespaces,
                document:   new ghostly.Element(namespaces, result.documentElement),
            }
        }

        return result;
    }
})();

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill
if (typeof Object.assign != 'function') {
    Object.assign = function(target) {
        'use strict';
        if (target == null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }

        target = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source != null) {
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
        }
        return target;
    };
}

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create#Polyfill
if (typeof Object.create != 'function') {
    Object.create = (function() {
        var Temp = function() {};
        return function (prototype) {
            if (arguments.length > 1) {
                throw Error('Second argument not supported');
            }
            if(prototype !== Object(prototype)) {
                throw TypeError('Argument must be an object');
            }
            if (prototype === null) {
                throw Error('null [[Prototype]] not supported');
            }
            Temp.prototype = prototype;
            var result = new Temp();
            Temp.prototype = null;
            return result;
        };
    })();
}

// https://raw.githubusercontent.com/taylorhakes/promise-polyfill/master/promise.min.js
!function(t){function e(){}function n(t,e){return function(){t.apply(e,arguments)}}function o(t){if("object"!=typeof this)throw new TypeError("Promises must be constructed via new");if("function"!=typeof t)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=void 0,this._deferreds=[],s(t,this)}function r(t,e){for(;3===t._state;)t=t._value;return 0===t._state?void t._deferreds.push(e):(t._handled=!0,void a(function(){var n=1===t._state?e.onFulfilled:e.onRejected;if(null===n)return void(1===t._state?i:f)(e.promise,t._value);var o;try{o=n(t._value)}catch(r){return void f(e.promise,r)}i(e.promise,o)}))}function i(t,e){try{if(e===t)throw new TypeError("A promise cannot be resolved with itself.");if(e&&("object"==typeof e||"function"==typeof e)){var r=e.then;if(e instanceof o)return t._state=3,t._value=e,void u(t);if("function"==typeof r)return void s(n(r,e),t)}t._state=1,t._value=e,u(t)}catch(i){f(t,i)}}function f(t,e){t._state=2,t._value=e,u(t)}function u(t){2===t._state&&0===t._deferreds.length&&a(function(){t._handled||d(t._value)});for(var e=0,n=t._deferreds.length;n>e;e++)r(t,t._deferreds[e]);t._deferreds=null}function c(t,e,n){this.onFulfilled="function"==typeof t?t:null,this.onRejected="function"==typeof e?e:null,this.promise=n}function s(t,e){var n=!1;try{t(function(t){n||(n=!0,i(e,t))},function(t){n||(n=!0,f(e,t))})}catch(o){if(n)return;n=!0,f(e,o)}}var l=setTimeout,a="function"==typeof setImmediate&&setImmediate||function(t){l(t,0)},d=function(t){"undefined"!=typeof console&&console&&console.warn("Possible Unhandled Promise Rejection:",t)};o.prototype["catch"]=function(t){return this.then(null,t)},o.prototype.then=function(t,n){var o=new this.constructor(e);return r(this,new c(t,n,o)),o},o.all=function(t){var e=Array.prototype.slice.call(t);return new o(function(t,n){function o(i,f){try{if(f&&("object"==typeof f||"function"==typeof f)){var u=f.then;if("function"==typeof u)return void u.call(f,function(t){o(i,t)},n)}e[i]=f,0===--r&&t(e)}catch(c){n(c)}}if(0===e.length)return t([]);for(var r=e.length,i=0;i<e.length;i++)o(i,e[i])})},o.resolve=function(t){return t&&"object"==typeof t&&t.constructor===o?t:new o(function(e){e(t)})},o.reject=function(t){return new o(function(e,n){n(t)})},o.race=function(t){return new o(function(e,n){for(var o=0,r=t.length;r>o;o++)t[o].then(e,n)})},o._setImmediateFn=function(t){a=t},o._setUnhandledRejectionFn=function(t){d=t},"undefined"!=typeof module&&module.exports?module.exports=o:t.Promise||(t.Promise=o)}(this);
