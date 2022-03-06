"use strict";(self.webpackChunk_divine_ghostly_website=self.webpackChunk_divine_ghostly_website||[]).push([[6687],{9613:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return f}});var r=n(9496);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},l=Object.keys(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var s=r.createContext({}),p=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},u=function(e){var t=p(e.components);return r.createElement(s.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},c=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,l=e.originalType,s=e.parentName,u=o(e,["components","mdxType","originalType","parentName"]),c=p(n),f=i,g=c["".concat(s,".").concat(f)]||c[f]||d[f]||l;return n?r.createElement(g,a(a({ref:t},u),{},{components:n})):r.createElement(g,a({ref:t},u))}));function f(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var l=n.length,a=new Array(l);a[0]=c;var o={};for(var s in t)hasOwnProperty.call(t,s)&&(o[s]=t[s]);o.originalType=e,o.mdxType="string"==typeof e?e:i,a[1]=o;for(var p=2;p<l;p++)a[p]=n[p];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}c.displayName="MDXCreateElement"},4922:function(e,t,n){n.r(t),n.d(t,{assets:function(){return u},contentTitle:function(){return s},default:function(){return f},frontMatter:function(){return o},metadata:function(){return p},toc:function(){return d}});var r=n(7813),i=n(7044),l=(n(9496),n(9613)),a=["components"],o={id:"ghostly_engine.RenderResult",title:"Interface: RenderResult",sidebar_label:"RenderResult",custom_edit_url:null},s=void 0,p={unversionedId:"api/interfaces/ghostly_engine.RenderResult",id:"api/interfaces/ghostly_engine.RenderResult",title:"Interface: RenderResult",description:"ghostly-engine.RenderResult",source:"@site/docs/api/interfaces/ghostly_engine.RenderResult.md",sourceDirName:"api/interfaces",slug:"/api/interfaces/ghostly_engine.RenderResult",permalink:"/ghostly/docs/api/interfaces/ghostly_engine.RenderResult",editUrl:null,tags:[],version:"current",frontMatter:{id:"ghostly_engine.RenderResult",title:"Interface: RenderResult",sidebar_label:"RenderResult",custom_edit_url:null},sidebar:"someSidebar",previous:{title:"RenderRequest",permalink:"/ghostly/docs/api/interfaces/ghostly_engine.RenderRequest"},next:{title:"TemplateConfig",permalink:"/ghostly/docs/api/interfaces/ghostly_engine.TemplateConfig"}},u={},d=[{value:"Properties",id:"properties",level:2},{value:"contentType",id:"contenttype",level:3},{value:"Defined in",id:"defined-in",level:4},{value:"data",id:"data",level:3},{value:"Defined in",id:"defined-in-1",level:4},{value:"description",id:"description",level:3},{value:"Defined in",id:"defined-in-2",level:4},{value:"name",id:"name",level:3},{value:"Defined in",id:"defined-in-3",level:4},{value:"type",id:"type",level:3},{value:"Defined in",id:"defined-in-4",level:4}],c={toc:d};function f(e){var t=e.components,n=(0,i.Z)(e,a);return(0,l.kt)("wrapper",(0,r.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("p",null,(0,l.kt)("a",{parentName:"p",href:"/ghostly/docs/api/modules/ghostly_engine"},"ghostly-engine"),".RenderResult"),(0,l.kt)("p",null,"A result part from the template. Returned when using the ",(0,l.kt)("a",{parentName:"p",href:"/ghostly/docs/api/interfaces/ghostly_engine.TemplateEngine"},"TemplateEngine")," API."),(0,l.kt)("h2",{id:"properties"},"Properties"),(0,l.kt)("h3",{id:"contenttype"},"contentType"),(0,l.kt)("p",null,"\u2022 ",(0,l.kt)("strong",{parentName:"p"},"contentType"),": ",(0,l.kt)("inlineCode",{parentName:"p"},"string")),(0,l.kt)("p",null,"The result's media type."),(0,l.kt)("h4",{id:"defined-in"},"Defined in"),(0,l.kt)("p",null,(0,l.kt)("a",{parentName:"p",href:"https://github.com/Divine-Software/ghostly/blob/2ffa5f5/ghostly-engine/src/engine.ts#L58"},"ghostly-engine/src/engine.ts:58")),(0,l.kt)("hr",null),(0,l.kt)("h3",{id:"data"},"data"),(0,l.kt)("p",null,"\u2022 ",(0,l.kt)("strong",{parentName:"p"},"data"),": ",(0,l.kt)("inlineCode",{parentName:"p"},"Buffer")),(0,l.kt)("p",null,"The result, as a Buffer."),(0,l.kt)("h4",{id:"defined-in-1"},"Defined in"),(0,l.kt)("p",null,(0,l.kt)("a",{parentName:"p",href:"https://github.com/Divine-Software/ghostly/blob/2ffa5f5/ghostly-engine/src/engine.ts#L61"},"ghostly-engine/src/engine.ts:61")),(0,l.kt)("hr",null),(0,l.kt)("h3",{id:"description"},"description"),(0,l.kt)("p",null,"\u2022 ",(0,l.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,l.kt)("strong",{parentName:"p"},"description"),": ",(0,l.kt)("inlineCode",{parentName:"p"},"string")),(0,l.kt)("p",null,"A descriptipn of the result, if present."),(0,l.kt)("h4",{id:"defined-in-2"},"Defined in"),(0,l.kt)("p",null,(0,l.kt)("a",{parentName:"p",href:"https://github.com/Divine-Software/ghostly/blob/2ffa5f5/ghostly-engine/src/engine.ts#L67"},"ghostly-engine/src/engine.ts:67")),(0,l.kt)("hr",null),(0,l.kt)("h3",{id:"name"},"name"),(0,l.kt)("p",null,"\u2022 ",(0,l.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,l.kt)("strong",{parentName:"p"},"name"),": ",(0,l.kt)("inlineCode",{parentName:"p"},"string")),(0,l.kt)("p",null,"The name of the result, if present (",(0,l.kt)("em",{parentName:"p"},"including")," file extension)."),(0,l.kt)("h4",{id:"defined-in-3"},"Defined in"),(0,l.kt)("p",null,(0,l.kt)("a",{parentName:"p",href:"https://github.com/Divine-Software/ghostly/blob/2ffa5f5/ghostly-engine/src/engine.ts#L64"},"ghostly-engine/src/engine.ts:64")),(0,l.kt)("hr",null),(0,l.kt)("h3",{id:"type"},"type"),(0,l.kt)("p",null,"\u2022 ",(0,l.kt)("strong",{parentName:"p"},"type"),": ",(0,l.kt)("inlineCode",{parentName:"p"},'"attachment"')," ","|"," ",(0,l.kt)("inlineCode",{parentName:"p"},'"event"')," ","|"," ",(0,l.kt)("inlineCode",{parentName:"p"},'"view"')),(0,l.kt)("p",null,"What kind of result this is."),(0,l.kt)("h4",{id:"defined-in-4"},"Defined in"),(0,l.kt)("p",null,(0,l.kt)("a",{parentName:"p",href:"https://github.com/Divine-Software/ghostly/blob/2ffa5f5/ghostly-engine/src/engine.ts#L55"},"ghostly-engine/src/engine.ts:55")))}f.isMDXComponent=!0}}]);