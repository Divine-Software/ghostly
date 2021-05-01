(window.webpackJsonp=window.webpackJsonp||[]).push([[39],{111:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return i})),n.d(t,"metadata",(function(){return c})),n.d(t,"toc",(function(){return p})),n.d(t,"default",(function(){return l}));var r=n(3),a=n(7),o=(n(0),n(123)),i={title:"Welcome",author:"Martin Blom",author_title:"Project Maintainer",author_url:"https://github.com/LeviticusMB",author_image_url:"https://avatars.githubusercontent.com/u/1094822?s=460&v=4"},c={permalink:"/ghostly/blog/2021/03/15/welcome",editUrl:"https://github.com/Divine-Software/ghostly/edit/master/website/blog/blog/2021-03-15-welcome.md",source:"@site/blog/2021-03-15-welcome.md",description:"I'm happy to announce that Ghostly v2 is now released! Version 2.0 is an substantial upgrade over last release.",date:"2021-03-15T00:00:00.000Z",formattedDate:"March 15, 2021",tags:[],title:"Welcome",readingTime:.645,truncated:!1,prevItem:{title:"Version 2.1 released",permalink:"/ghostly/blog/2021/04/22/version-2.1"}},p=[],s={toc:p};function l(e){var t=e.components,n=Object(a.a)(e,["components"]);return Object(o.b)("wrapper",Object(r.a)({},s,n,{components:t,mdxType:"MDXLayout"}),Object(o.b)("p",null,"I'm happy to announce that Ghostly v2 is now released! Version 2.0 is an ",Object(o.b)("strong",{parentName:"p"},Object(o.b)("em",{parentName:"strong"},"substantial"))," upgrade over last release."),Object(o.b)("p",null,"Both the ",Object(o.b)("a",{parentName:"p",href:"https://www.npmjs.com/package/@divine/ghostly-engine"},"engine")," and ",Object(o.b)("a",{parentName:"p",href:"https://www.npmjs.com/package/@divine/ghostly-runtime"},"runtime")," modules (now part of the ",Object(o.b)("em",{parentName:"p"},"Divine")," family of open source software) ships with full\n",Object(o.b)("em",{parentName:"p"},"TypeScript")," definitions, and Ghostly is now powered by a modern browser (",Object(o.b)("em",{parentName:"p"},"Chromium")," by default, but you can opt in to\nuse ",Object(o.b)("em",{parentName:"p"},"Firefox")," or ",Object(o.b)("em",{parentName:"p"},"WebKit")," instead), thanks to ",Object(o.b)("a",{parentName:"p",href:"https://playwright.dev/"},"Playwright"),"."),Object(o.b)("p",null,"The third major improvement comes in the form of ",Object(o.b)("em",{parentName:"p"},"attachments")," support. A template may now announce that it can produce\nany number of secondary results as part of the model initialization. For instance, a sales report template could attach\nthe sales data as a CSV attachment, ready to be imported into a spreadsheet application for further analysis."))}l.isMDXComponent=!0},123:function(e,t,n){"use strict";n.d(t,"a",(function(){return u})),n.d(t,"b",(function(){return f}));var r=n(0),a=n.n(r);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function p(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=a.a.createContext({}),l=function(e){var t=a.a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},u=function(e){var t=l(e.components);return a.a.createElement(s.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},b=a.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,i=e.parentName,s=p(e,["components","mdxType","originalType","parentName"]),u=l(n),b=r,f=u["".concat(i,".").concat(b)]||u[b]||m[b]||o;return n?a.a.createElement(f,c(c({ref:t},s),{},{components:n})):a.a.createElement(f,c({ref:t},s))}));function f(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,i=new Array(o);i[0]=b;var c={};for(var p in t)hasOwnProperty.call(t,p)&&(c[p]=t[p]);c.originalType=e,c.mdxType="string"==typeof e?e:r,i[1]=c;for(var s=2;s<o;s++)i[s]=n[s];return a.a.createElement.apply(null,i)}return a.a.createElement.apply(null,n)}b.displayName="MDXCreateElement"}}]);