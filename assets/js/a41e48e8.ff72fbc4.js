(window.webpackJsonp=window.webpackJsonp||[]).push([[32],{104:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return o})),n.d(t,"metadata",(function(){return c})),n.d(t,"toc",(function(){return l})),n.d(t,"default",(function(){return s}));var r=n(3),a=n(7),i=(n(0),n(123)),o={title:"Version 2.1 released",author:"Martin Blom",author_title:"Project Maintainer",author_url:"https://github.com/LeviticusMB",author_image_url:"https://avatars.githubusercontent.com/u/1094822?s=460&v=4"},c={permalink:"/ghostly/blog/2021/04/22/version-2.1",editUrl:"https://github.com/Divine-Software/ghostly/edit/master/website/blog/blog/2021-04-22-version-2.1.md",source:"@site/blog/2021-04-22-version-2.1.md",description:"Today, I'm glad to let you know that Ghostly version 2.1 has been released.",date:"2021-04-22T00:00:00.000Z",formattedDate:"April 22, 2021",tags:[],title:"Version 2.1 released",readingTime:.62,truncated:!1,nextItem:{title:"Welcome",permalink:"/ghostly/blog/2021/03/15/welcome"}},l=[],p={toc:l};function s(e){var t=e.components,n=Object(a.a)(e,["components"]);return Object(i.b)("wrapper",Object(r.a)({},p,n,{components:t,mdxType:"MDXLayout"}),Object(i.b)("p",null,"Today, I'm glad to let you know that Ghostly version 2.1 has been released."),Object(i.b)("p",null,"Besides some internal chores\u2014like switching from ",Object(i.b)("a",{parentName:"p",href:"https://classic.yarnpkg.com"},"Yarn")," to ",Object(i.b)("a",{parentName:"p",href:"https://pnpm.io/"},"pnpm"),"\u2014this version adds an ",Object(i.b)("inlineCode",{parentName:"p"},"inline")," transform to the\n",Object(i.b)("a",{parentName:"p",href:"/ghostly/docs/api/interfaces/ghostly_engine.view#htmltransforms"},"html-transforms")," pipeline (which is now implemented as a ",Object(i.b)("a",{parentName:"p",href:"https://github.com/rehypejs/rehype"},"rehype")," pipeline). The inliner is capable of inlining CSS,\nJavaScript and any kind of URL by converting the linked resource to a ",Object(i.b)("inlineCode",{parentName:"p"},"data:")," URL. Any inlined resource will be\nprocessed by the pipeline before it's included into the main document."),Object(i.b)("p",null,"Additonally, the default ",Object(i.b)("inlineCode",{parentName:"p"},"sanitizer")," transform (using ",Object(i.b)("a",{parentName:"p",href:"https://github.com/cure53/DOMPurify"},"DOMPurify"),"), while still available, has been replaced with a much\nless intrusive ",Object(i.b)("inlineCode",{parentName:"p"},"noscript")," transform by default, and ",Object(i.b)("inlineCode",{parentName:"p"},"minimize")," is now based on ",Object(i.b)("a",{parentName:"p",href:"https://github.com/rehypejs/rehype-minify"},"rehype-minify")," instead of\n",Object(i.b)("a",{parentName:"p",href:"https://github.com/kangax/html-minifier"},"html-minifier"),"."))}s.isMDXComponent=!0},123:function(e,t,n){"use strict";n.d(t,"a",(function(){return u})),n.d(t,"b",(function(){return f}));var r=n(0),a=n.n(r);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var p=a.a.createContext({}),s=function(e){var t=a.a.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},u=function(e){var t=s(e.components);return a.a.createElement(p.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},b=a.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,o=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),u=s(n),b=r,f=u["".concat(o,".").concat(b)]||u[b]||m[b]||i;return n?a.a.createElement(f,c(c({ref:t},p),{},{components:n})):a.a.createElement(f,c({ref:t},p))}));function f(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,o=new Array(i);o[0]=b;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c.mdxType="string"==typeof e?e:r,o[1]=c;for(var p=2;p<i;p++)o[p]=n[p];return a.a.createElement.apply(null,o)}return a.a.createElement.apply(null,n)}b.displayName="MDXCreateElement"}}]);