(window.webpackJsonp=window.webpackJsonp||[]).push([[33],{106:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return o})),n.d(t,"metadata",(function(){return i})),n.d(t,"toc",(function(){return c})),n.d(t,"default",(function(){return s}));var r=n(3),a=(n(0),n(121));const o={title:"Welcome",author:"Martin Blom",author_title:"Project Maintainer",author_url:"https://github.com/LeviticusMB",author_image_url:"https://avatars.githubusercontent.com/u/1094822?s=460&v=4"},i={permalink:"/ghostly/blog/2020/02/15/welcome",editUrl:"https://github.com/Divine-Software/ghostly/edit/master/website/blog/blog/2020-02-15-welcome.md",source:"@site/blog/2020-02-15-welcome.md",description:"I'm happy to announce that Ghostly v2 is now released! Version 2.0 is an substantial upgrade over last release.",date:"2020-02-15T00:00:00.000Z",formattedDate:"February 15, 2020",tags:[],title:"Welcome",readingTime:.645,truncated:!1},c=[],p={toc:c};function s({components:e,...t}){return Object(a.b)("wrapper",Object(r.a)({},p,t,{components:e,mdxType:"MDXLayout"}),Object(a.b)("p",null,"I'm happy to announce that Ghostly v2 is now released! Version 2.0 is an ",Object(a.b)("strong",{parentName:"p"},Object(a.b)("em",{parentName:"strong"},"substantial"))," upgrade over last release."),Object(a.b)("p",null,"Both the ",Object(a.b)("a",{parentName:"p",href:"https://www.npmjs.com/package/@divine/ghostly-engine"},"engine")," and ",Object(a.b)("a",{parentName:"p",href:"https://www.npmjs.com/package/@divine/ghostly-runtime"},"runtime")," modules (now part of the ",Object(a.b)("em",{parentName:"p"},"Divine")," family of open source software) ships with full\n",Object(a.b)("em",{parentName:"p"},"TypeScript")," definitions, and Ghostly is now powered by a modern browser (",Object(a.b)("em",{parentName:"p"},"Chromium")," by default, but you can opt in to\nuse ",Object(a.b)("em",{parentName:"p"},"Firefox")," or ",Object(a.b)("em",{parentName:"p"},"WebKit")," instead), thanks to ",Object(a.b)("a",{parentName:"p",href:"https://playwright.dev/"},"Playwright"),"."),Object(a.b)("p",null,"The third major improvement comes in the form of ",Object(a.b)("em",{parentName:"p"},"attachments")," support. A template may now announce that it can produce\nany number of secondary results as part of the model initialization. For instance, a sales report template could attach\nthe sales data as a CSV attachment, ready to be imported into a spreadsheet application for further analysis."))}s.isMDXComponent=!0},121:function(e,t,n){"use strict";n.d(t,"a",(function(){return u})),n.d(t,"b",(function(){return f}));var r=n(0),a=n.n(r);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function p(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=a.a.createContext({}),l=function(e){var t=a.a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},u=function(e){var t=l(e.components);return a.a.createElement(s.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},b=a.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,i=e.parentName,s=p(e,["components","mdxType","originalType","parentName"]),u=l(n),b=r,f=u["".concat(i,".").concat(b)]||u[b]||m[b]||o;return n?a.a.createElement(f,c(c({ref:t},s),{},{components:n})):a.a.createElement(f,c({ref:t},s))}));function f(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,i=new Array(o);i[0]=b;var c={};for(var p in t)hasOwnProperty.call(t,p)&&(c[p]=t[p]);c.originalType=e,c.mdxType="string"==typeof e?e:r,i[1]=c;for(var s=2;s<o;s++)i[s]=n[s];return a.a.createElement.apply(null,i)}return a.a.createElement.apply(null,n)}b.displayName="MDXCreateElement"}}]);