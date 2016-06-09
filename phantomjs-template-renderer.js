//#!/usr/bin/env phantomjs

'use strict';

var fs        = require('fs');
var system    = require('system');
var webpage   = require('webpage');
var webserver = require('webserver');

if (system.args.length != 3 && system.args.length != 4) {
    system.stdout.writeLine('Usage: ' + system.args[0] + ' <[host:]port> <cache-size> [<secret>]');
    system.stdout.writeLine('If <secret> is missing, it will be read from standard input.');
    phantom.exit(64); throw '';
}

var port      = system.args[1];
var cacheSize = system.args[2];
var secret    = system.args[3] || system.stdin.readLine();

var counter   = 0;
var pageCache = [];

var adapterName = phantom.libraryPath + '/' + 'phantomjs-template-adapter.html';
var adapterHTML = fs.read(adapterName);

var renderFormats = {
    'application/pdf': 'pdf',
    'image/jpeg':      'jpeg',
    'image/png':       'png',
};

if (!secret) {
    console.warn('Warning: No secret supplied. Will accept unsigned requests!');
}

if (webserver.create().listen(port, function(request, response) {
    // HTTP headers are case-insensitive
    request.headers = Object.keys(request.headers).reduce(function(headers, key) {
        headers[key.toLowerCase()] = request.headers[key];
        return headers;
    }, {});

    try {
        $renderTemplate(parseRequest(request))
            .catch(function(err) {
                return err;
            })
            .then(function(result) {
                if (!(result instanceof Array)) {
                    result = [500, result && result.message || ('Unknown renderer response: ' + result)];
                }
                
                if (typeof result[1] === 'string') {
                    result[1] = { message: result[1] };
                }

                try {
                    result[1] = JSON.stringify(result[1]);
                }
                catch (ex) {
                    result = [500, JSON.stringify({ message: 'Failed to serialize renderer result as JSON: ' + ex.message})];
                }

                response.writeHead(result[0], { 'Content-Type': 'application/json' });
                response.write(result[1]);
                response.close();
            });
    }
    catch (ex) {
        response.writeHead(ex instanceof Array ? ex[0] : 500, Object.assign({ 'Content-Type': 'application/json' }, ex[2]));
        response.write(JSON.stringify({ message: ex instanceof Array ? ex[1] : ex.message }));
        response.close();
    }
})) {
    console.info('Listening on [host:]port ' + port);
}
else {
    console.error('Error: Failed to start web server on [host:]port ' + port);
    phantom.exit(74); throw '';
}

function parseRequest(request) {
    var cmd, auth, cred, hmac;
    var url = request.url.split('?')[0];

    if (url !== '/') {
        throw [404, 'Resource ' + url + ' not found'];
    }
    else if (request.method !== 'POST') {
        throw [405, 'Only POST requests are accepted'];
    }
    else if (request.headers['content-type'] !== 'application/json') {
        throw [415, 'Only application/json requests are accepted'];
    }

    if (secret) {
        auth = (request.headers['authorization'] || '').split(/ (.*)/);

        if (auth[0] !== 'Basic') {
            throw [401, 'Invalid or missing credentials', { 'WWW-Authenticate': 'Basic realm="' + port + '"' }];
        }

        cred = atob(auth[1]).split(/:(.*)/);
        hmac = CryptoJS.HmacSHA256([cred[0], request.method, request.url, request.headers['host'], request.headers['content-type'], request.post].join('\n'), secret);

        if (cred[0] != counter + 1 /* Replay protection */ || hmac != cred[1]) {
            throw [403, 'Invalid credentials']
        }

        ++counter;
    }

    try {
        cmd = JSON.parse(request.post) || {};
    }
    catch (ex) {
        throw [415, ex.message];
    }

    if (cmd.document === undefined) {
        throw [422, 'The "document" property is required'];
    }
    else if (typeof cmd.contentType !== 'string') {
        throw [422, 'The "contentType" property is required and must be a string'];
    }
    else if (typeof cmd.template !== 'string') {
        throw [422, 'The "template" property is required and must be an URL'];
    }
    else if (!(cmd.views instanceof Array)) {
        throw [422, 'The "views" property is required and must be an array'];
    }

    return cmd;
}

function $renderTemplate(cmd) {
    var template;

    // Find a cached template ...
    for (var i = 0; i < pageCache.length; ++i) {
        if (pageCache[i] && pageCache[i].url === cmd.template) {
            template = pageCache[i];
            delete pageCache[i];

            console.info('Using cached template ' + template);
            break;
        }
    }

    if (!template) {
        // ... or create a new one
        template = new GhostlyTemplate(cmd.template);
        console.info('Created template ' + template);
    }
    
    return template.$load()
        .then(function() {
            return template.$init(cmd.document, cmd.contentType);
        })
        .then(function() {
            var views = cmd.views.concat();
            var results = [];

            function $sendNextView() {
                var view = views.shift();

                if (view) {
                    return template.$render(view)
                        .then(function(res) {
                            results.push(res);

                            return $sendNextView();
                        });
                }
                else {
                    return results;
                }
            }

            return $sendNextView();
        })
        .then(function(res) {
            // Return template to page cache if there were no errors
            for (var i = 0; i < cacheSize; ++i) {
                if (!pageCache[i]) {
                    pageCache[i] = template;
                    break;
                }
            }

            return [200, res];
        });
}

function GhostlyTemplate(url) {
    var self = this;

    self.url    = url;
    self.page   = webpage.create();
    self.loaded = false;
    
    self.page.onConsoleMessage = function(msg) {
        console.info(self + ': [CONSOLE] ' + msg);
    };

    self.page.onAlert = function(msg) {
        console.error(self + ': [ALERT] ' + msg);
    };

    self.page.setContent(adapterHTML, 'file://' + adapterName);
}

GhostlyTemplate.prototype.toString = function() {
    return '<' + this.url + '>';
}

GhostlyTemplate.prototype._$sendMessage = function(msg, timeout) {
    var self = this;

    return new Promise(function(resolve, reject) {
        var watchdog = setTimeout(function() {
            self.page.close();
            reject([504, self + ': Timeout for request ' + JSON.stringify(msg)]);
        }, (timeout || 10) * 1000);
        
        console.log(self + ': Request ' + JSON.stringify(msg));

        self.page.onCallback = function(res) {
            self.page.onCallback = null;
            clearTimeout(watchdog);

            console.log(self + ': Response ' + JSON.stringify(res));
            resolve(res);
            return true;
        };

        self.page.evaluate(function(msg) {
            sendMessage(msg);
        }, msg);
    });
};

GhostlyTemplate.prototype.$load = function() {
    var self = this;

    if (self.loaded) {
        return Promise.resolve();
    }
    else {
        return self._$sendMessage(['ghostlyLoad', self.url])
            .then(function(res) {
                if (!res[0]) {
                    throw [502, 'Template ' + self + ' failed to load: ' + res[1]];
                }

                self.loaded = true;
            })
    }
};

GhostlyTemplate.prototype.$init = function(document, contentType) {
    var self = this;

    return self._$sendMessage(['ghostlyInit', { document: document, contentType: contentType } ])
        .then(function(res) {
            if (!res[0]) {
                throw [501, 'Template ' + self + ' did not accept source document: ' + res[1]];
            }
        });
};

GhostlyTemplate.prototype.$render = function(view) {
    var self = this;
    var dpi  = view.dpi || 72;

    self.page.viewportSize = view.viewportSize || {
        width:  210 / 25.4 * dpi,
        height: 297 / 25.4 * dpi,
    };

    self.page.paperSize = view.paperSize || {
        format:      'A4',
        orientation: 'portrait',
        margin:      '0cm',
    };

    self.page.zoomFactor = view.zoomFactor || 1;
                    
    return self._$sendMessage(['ghostlyRender', { contentType: view.contentType, params: view.params }])
        .then(function(res) {
            if (!res[0]) {
                throw [501, 'Template ' + self + ' failed to render view ' + view.contentType + ': ' + res[1]];
            }

            return self._writeResult(res[1], view);
        })
};

GhostlyTemplate.prototype._writeResult = function(data, view) {
    var self = this;

    data = data !== '' ? data : null;

    if (!data && (view.contentType == 'text/html' || view.contentType == 'text/plain')) {
        self.page.switchToFrame('template');
        data = view.contentType === 'text/html' ? self.page.frameContent : self.page.framePlainText;
        self.page.switchToMainFrame();
    }

    if (view.output) {
        if (data instanceof Uint8Array) {
            fs.write(view.output, String.fromCharCode.apply(null, data), 'wb');
        }
        else if (typeof data === 'string') {
            fs.write(view.output, data, 'w');
        }
        else if (data) {
            throw [501, 'Template ' + self + ' returned result in an unsupported format: ' + data];
        }
        else if (renderFormats[view.contentType]) {
            self.page.render(view.output, { format: renderFormats[view.contentType] });
        }
        else {
            throw [501, 'Template ' + self + ' cannot render as ' + view.contentType];
        }

        return { file: view.output };
    }
    else {
        if (data instanceof Uint8Array) {
            return { binary: btoa(String.fromCharCode.apply(null, data)) };
        }
        else if (typeof data === 'string') {
            return { text: data };
        }
        else if (data) {
            throw [501, 'Template ' + self + ' returned result in an unsupported format: ' + data];
        }
        else if (/^(png|jpeg)$/.test(renderFormats[view.contentType])) {
            return { binary: self.page.renderBase64(renderFormats[view.contentType]) };
        }
        else {
            throw [501, 'Template ' + self + ' can only render ' + view.contentType + ' files to disk'];
        }
    }
}

/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS=CryptoJS||function(h,s){var f={},g=f.lib={},q=function(){},m=g.Base={extend:function(a){q.prototype=this;var c=new q;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
r=g.WordArray=m.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=s?c:4*a.length},toString:function(a){return(a||k).stringify(this)},concat:function(a){var c=this.words,d=a.words,b=this.sigBytes;a=a.sigBytes;this.clamp();if(b%4)for(var e=0;e<a;e++)c[b+e>>>2]|=(d[e>>>2]>>>24-8*(e%4)&255)<<24-8*((b+e)%4);else if(65535<d.length)for(e=0;e<a;e+=4)c[b+e>>>2]=d[e>>>2];else c.push.apply(c,d);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<
32-8*(c%4);a.length=h.ceil(c/4)},clone:function(){var a=m.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],d=0;d<a;d+=4)c.push(4294967296*h.random()|0);return new r.init(c,a)}}),l=f.enc={},k=l.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var d=[],b=0;b<a;b++){var e=c[b>>>2]>>>24-8*(b%4)&255;d.push((e>>>4).toString(16));d.push((e&15).toString(16))}return d.join("")},parse:function(a){for(var c=a.length,d=[],b=0;b<c;b+=2)d[b>>>3]|=parseInt(a.substr(b,
2),16)<<24-4*(b%8);return new r.init(d,c/2)}},n=l.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var d=[],b=0;b<a;b++)d.push(String.fromCharCode(c[b>>>2]>>>24-8*(b%4)&255));return d.join("")},parse:function(a){for(var c=a.length,d=[],b=0;b<c;b++)d[b>>>2]|=(a.charCodeAt(b)&255)<<24-8*(b%4);return new r.init(d,c)}},j=l.Utf8={stringify:function(a){try{return decodeURIComponent(escape(n.stringify(a)))}catch(c){throw Error("Malformed UTF-8 data");}},parse:function(a){return n.parse(unescape(encodeURIComponent(a)))}},
u=g.BufferedBlockAlgorithm=m.extend({reset:function(){this._data=new r.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=j.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,d=c.words,b=c.sigBytes,e=this.blockSize,f=b/(4*e),f=a?h.ceil(f):h.max((f|0)-this._minBufferSize,0);a=f*e;b=h.min(4*a,b);if(a){for(var g=0;g<a;g+=e)this._doProcessBlock(d,g);g=d.splice(0,a);c.sigBytes-=b}return new r.init(g,b)},clone:function(){var a=m.clone.call(this);
a._data=this._data.clone();return a},_minBufferSize:0});g.Hasher=u.extend({cfg:m.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){u.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(c,d){return(new a.init(d)).finalize(c)}},_createHmacHelper:function(a){return function(c,d){return(new t.HMAC.init(a,
d)).finalize(c)}}});var t=f.algo={};return f}(Math);
(function(h){for(var s=CryptoJS,f=s.lib,g=f.WordArray,q=f.Hasher,f=s.algo,m=[],r=[],l=function(a){return 4294967296*(a-(a|0))|0},k=2,n=0;64>n;){var j;a:{j=k;for(var u=h.sqrt(j),t=2;t<=u;t++)if(!(j%t)){j=!1;break a}j=!0}j&&(8>n&&(m[n]=l(h.pow(k,0.5))),r[n]=l(h.pow(k,1/3)),n++);k++}var a=[],f=f.SHA256=q.extend({_doReset:function(){this._hash=new g.init(m.slice(0))},_doProcessBlock:function(c,d){for(var b=this._hash.words,e=b[0],f=b[1],g=b[2],j=b[3],h=b[4],m=b[5],n=b[6],q=b[7],p=0;64>p;p++){if(16>p)a[p]=
c[d+p]|0;else{var k=a[p-15],l=a[p-2];a[p]=((k<<25|k>>>7)^(k<<14|k>>>18)^k>>>3)+a[p-7]+((l<<15|l>>>17)^(l<<13|l>>>19)^l>>>10)+a[p-16]}k=q+((h<<26|h>>>6)^(h<<21|h>>>11)^(h<<7|h>>>25))+(h&m^~h&n)+r[p]+a[p];l=((e<<30|e>>>2)^(e<<19|e>>>13)^(e<<10|e>>>22))+(e&f^e&g^f&g);q=n;n=m;m=h;h=j+k|0;j=g;g=f;f=e;e=k+l|0}b[0]=b[0]+e|0;b[1]=b[1]+f|0;b[2]=b[2]+g|0;b[3]=b[3]+j|0;b[4]=b[4]+h|0;b[5]=b[5]+m|0;b[6]=b[6]+n|0;b[7]=b[7]+q|0},_doFinalize:function(){var a=this._data,d=a.words,b=8*this._nDataBytes,e=8*a.sigBytes;
d[e>>>5]|=128<<24-e%32;d[(e+64>>>9<<4)+14]=h.floor(b/4294967296);d[(e+64>>>9<<4)+15]=b;a.sigBytes=4*d.length;this._process();return this._hash},clone:function(){var a=q.clone.call(this);a._hash=this._hash.clone();return a}});s.SHA256=q._createHelper(f);s.HmacSHA256=q._createHmacHelper(f)})(Math);
(function(){var h=CryptoJS,s=h.enc.Utf8;h.algo.HMAC=h.lib.Base.extend({init:function(f,g){f=this._hasher=new f.init;"string"==typeof g&&(g=s.parse(g));var h=f.blockSize,m=4*h;g.sigBytes>m&&(g=f.finalize(g));g.clamp();for(var r=this._oKey=g.clone(),l=this._iKey=g.clone(),k=r.words,n=l.words,j=0;j<h;j++)k[j]^=1549556828,n[j]^=909522486;r.sigBytes=l.sigBytes=m;this.reset()},reset:function(){var f=this._hasher;f.reset();f.update(this._iKey)},update:function(f){this._hasher.update(f);return this},finalize:function(f){var g=
this._hasher;f=g.finalize(f);g.reset();return g.finalize(this._oKey.clone().concat(f))}})})();

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

// https://raw.githubusercontent.com/taylorhakes/promise-polyfill/master/promise.min.js
!function(t){function e(){}function n(t,e){return function(){t.apply(e,arguments)}}function o(t){if("object"!=typeof this)throw new TypeError("Promises must be constructed via new");if("function"!=typeof t)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=void 0,this._deferreds=[],s(t,this)}function r(t,e){for(;3===t._state;)t=t._value;return 0===t._state?void t._deferreds.push(e):(t._handled=!0,void a(function(){var n=1===t._state?e.onFulfilled:e.onRejected;if(null===n)return void(1===t._state?i:f)(e.promise,t._value);var o;try{o=n(t._value)}catch(r){return void f(e.promise,r)}i(e.promise,o)}))}function i(t,e){try{if(e===t)throw new TypeError("A promise cannot be resolved with itself.");if(e&&("object"==typeof e||"function"==typeof e)){var r=e.then;if(e instanceof o)return t._state=3,t._value=e,void u(t);if("function"==typeof r)return void s(n(r,e),t)}t._state=1,t._value=e,u(t)}catch(i){f(t,i)}}function f(t,e){t._state=2,t._value=e,u(t)}function u(t){2===t._state&&0===t._deferreds.length&&a(function(){t._handled||d(t._value)});for(var e=0,n=t._deferreds.length;n>e;e++)r(t,t._deferreds[e]);t._deferreds=null}function c(t,e,n){this.onFulfilled="function"==typeof t?t:null,this.onRejected="function"==typeof e?e:null,this.promise=n}function s(t,e){var n=!1;try{t(function(t){n||(n=!0,i(e,t))},function(t){n||(n=!0,f(e,t))})}catch(o){if(n)return;n=!0,f(e,o)}}var l=setTimeout,a="function"==typeof setImmediate&&setImmediate||function(t){l(t,0)},d=function(t){"undefined"!=typeof console&&console&&console.warn("Possible Unhandled Promise Rejection:",t)};o.prototype["catch"]=function(t){return this.then(null,t)},o.prototype.then=function(t,n){var o=new this.constructor(e);return r(this,new c(t,n,o)),o},o.all=function(t){var e=Array.prototype.slice.call(t);return new o(function(t,n){function o(i,f){try{if(f&&("object"==typeof f||"function"==typeof f)){var u=f.then;if("function"==typeof u)return void u.call(f,function(t){o(i,t)},n)}e[i]=f,0===--r&&t(e)}catch(c){n(c)}}if(0===e.length)return t([]);for(var r=e.length,i=0;i<e.length;i++)o(i,e[i])})},o.resolve=function(t){return t&&"object"==typeof t&&t.constructor===o?t:new o(function(e){e(t)})},o.reject=function(t){return new o(function(e,n){n(t)})},o.race=function(t){return new o(function(e,n){for(var o=0,r=t.length;r>o;o++)t[o].then(e,n)})},o._setImmediateFn=function(t){a=t},o._setUnhandledRejectionFn=function(t){d=t},"undefined"!=typeof module&&module.exports?module.exports=o:t.Promise||(t.Promise=o)}(this);
