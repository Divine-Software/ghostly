"use strict";(self.webpackChunk_divine_ghostly_website=self.webpackChunk_divine_ghostly_website||[]).push([[3169],{9613:function(e,t,r){r.d(t,{Zo:function(){return u},kt:function(){return f}});var n=r(9496);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var c=n.createContext({}),s=function(e){var t=n.useContext(c),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},u=function(e){var t=s(e.components);return n.createElement(c.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,c=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),m=s(r),f=o,h=m["".concat(c,".").concat(f)]||m[f]||p[f]||a;return r?n.createElement(h,i(i({ref:t},u),{},{components:r})):n.createElement(h,i({ref:t},u))}));function f(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,i=new Array(a);i[0]=m;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l.mdxType="string"==typeof e?e:o,i[1]=l;for(var s=2;s<a;s++)i[s]=r[s];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},4074:function(e,t,r){r.r(t),r.d(t,{frontMatter:function(){return l},contentTitle:function(){return c},metadata:function(){return s},assets:function(){return u},toc:function(){return p},default:function(){return f}});var n=r(2245),o=r(5903),a=(r(9496),r(9613)),i=["components"],l={title:"Version 2.4 released",author:"Martin Blom",author_title:"Project Maintainer",author_url:"https://github.com/LeviticusMB",author_image_url:"https://avatars.githubusercontent.com/u/1094822?s=460&v=4"},c=void 0,s={permalink:"/ghostly/blog/2021/11/03/version-2.4",editUrl:"https://github.com/Divine-Software/ghostly/edit/master/website/blog/blog/2021-11-03-version-2.4.md",source:"@site/blog/2021-11-03-version-2.4.md",title:"Version 2.4 released",description:"Today, we're celebrating h\xf6stlov with a small new Ghostly release!",date:"2021-11-03T00:00:00.000Z",formattedDate:"November 3, 2021",tags:[],readingTime:.36,truncated:!1,authors:[{name:"Martin Blom",title:"Project Maintainer",url:"https://github.com/LeviticusMB",imageURL:"https://avatars.githubusercontent.com/u/1094822?s=460&v=4"}],nextItem:{title:"Version 2.3 released",permalink:"/ghostly/blog/2021/08/27/version-2.3"}},u={authorsImageUrls:[void 0]},p=[],m={toc:p};function f(e){var t=e.components,r=(0,o.Z)(e,i);return(0,a.kt)("wrapper",(0,n.Z)({},m,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Today, we're celebrating ",(0,a.kt)("em",{parentName:"p"},"h\xf6stlov")," with a small new Ghostly release!"),(0,a.kt)("p",null,"This is just a maintenance release that bumps Ghostly's dependencies. In particular, Playwright has been upgraded from\n1.12 to 1.16, which allows it to run correctly on ",(0,a.kt)("em",{parentName:"p"},"macOS 12"),"."),(0,a.kt)("p",null,"Playwright 1.13 and later had a problem with ",(0,a.kt)("inlineCode",{parentName:"p"},"file:")," URLs, which is why we have stuck with 1.12 for a while now. But\nthat problem has finally been addressed in this Ghostly release."))}f.isMDXComponent=!0}}]);