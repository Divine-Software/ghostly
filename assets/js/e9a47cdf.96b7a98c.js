(window.webpackJsonp=window.webpackJsonp||[]).push([[43],{114:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return c})),n.d(t,"metadata",(function(){return l})),n.d(t,"toc",(function(){return o})),n.d(t,"default",(function(){return s}));var r=n(3),i=n(7),a=(n(0),n(121)),c={id:"ghostly_engine.renderresult",title:"Interface: RenderResult",sidebar_label:"RenderResult",custom_edit_url:null,hide_title:!0},l={unversionedId:"api/interfaces/ghostly_engine.renderresult",id:"api/interfaces/ghostly_engine.renderresult",isDocsHomePage:!1,title:"Interface: RenderResult",description:"Interface: RenderResult",source:"@site/docs/api/interfaces/ghostly_engine.renderresult.md",slug:"/api/interfaces/ghostly_engine.renderresult",permalink:"/ghostly/docs/api/interfaces/ghostly_engine.renderresult",editUrl:null,version:"current",sidebar_label:"RenderResult",sidebar:"someSidebar",previous:{title:"Interface: EngineConfig",permalink:"/ghostly/docs/api/interfaces/ghostly_engine.engineconfig"},next:{title:"Interface: TemplateEngine",permalink:"/ghostly/docs/api/interfaces/ghostly_engine.templateengine"}},o=[{value:"Properties",id:"properties",children:[{value:"contentType",id:"contenttype",children:[]},{value:"data",id:"data",children:[]},{value:"description",id:"description",children:[]},{value:"name",id:"name",children:[]},{value:"type",id:"type",children:[]}]}],p={toc:o};function s(e){var t=e.components,n=Object(i.a)(e,["components"]);return Object(a.b)("wrapper",Object(r.a)({},p,n,{components:t,mdxType:"MDXLayout"}),Object(a.b)("h1",{id:"interface-renderresult"},"Interface: RenderResult"),Object(a.b)("p",null,Object(a.b)("a",{parentName:"p",href:"/ghostly/docs/api/modules/ghostly_engine"},"ghostly-engine"),".RenderResult"),Object(a.b)("p",null,"A result part from the template. Returned when using the ",Object(a.b)("a",{parentName:"p",href:"/ghostly/docs/api/interfaces/ghostly_engine.templateengine"},"TemplateEngine")," API."),Object(a.b)("h2",{id:"properties"},"Properties"),Object(a.b)("h3",{id:"contenttype"},"contentType"),Object(a.b)("p",null,"\u2022 ",Object(a.b)("strong",{parentName:"p"},"contentType"),": ",Object(a.b)("em",{parentName:"p"},"string")),Object(a.b)("p",null,"The result's media type."),Object(a.b)("p",null,"Defined in: ",Object(a.b)("a",{parentName:"p",href:"https://github.com/Divine-Software/ghostly/blob/50440ff/ghostly-engine/src/engine.ts#L43"},"ghostly-engine/src/engine.ts:43")),Object(a.b)("hr",null),Object(a.b)("h3",{id:"data"},"data"),Object(a.b)("p",null,"\u2022 ",Object(a.b)("strong",{parentName:"p"},"data"),": ",Object(a.b)("em",{parentName:"p"},"Buffer")),Object(a.b)("p",null,"The result, as a Buffer."),Object(a.b)("p",null,"Defined in: ",Object(a.b)("a",{parentName:"p",href:"https://github.com/Divine-Software/ghostly/blob/50440ff/ghostly-engine/src/engine.ts#L46"},"ghostly-engine/src/engine.ts:46")),Object(a.b)("hr",null),Object(a.b)("h3",{id:"description"},"description"),Object(a.b)("p",null,"\u2022 ",Object(a.b)("inlineCode",{parentName:"p"},"Optional")," ",Object(a.b)("strong",{parentName:"p"},"description"),": ",Object(a.b)("em",{parentName:"p"},"string")),Object(a.b)("p",null,"A descriptipn of the result, if present."),Object(a.b)("p",null,"Defined in: ",Object(a.b)("a",{parentName:"p",href:"https://github.com/Divine-Software/ghostly/blob/50440ff/ghostly-engine/src/engine.ts#L52"},"ghostly-engine/src/engine.ts:52")),Object(a.b)("hr",null),Object(a.b)("h3",{id:"name"},"name"),Object(a.b)("p",null,"\u2022 ",Object(a.b)("inlineCode",{parentName:"p"},"Optional")," ",Object(a.b)("strong",{parentName:"p"},"name"),": ",Object(a.b)("em",{parentName:"p"},"string")),Object(a.b)("p",null,"The name of the result, if present (",Object(a.b)("em",{parentName:"p"},"including")," file extension)."),Object(a.b)("p",null,"Defined in: ",Object(a.b)("a",{parentName:"p",href:"https://github.com/Divine-Software/ghostly/blob/50440ff/ghostly-engine/src/engine.ts#L49"},"ghostly-engine/src/engine.ts:49")),Object(a.b)("hr",null),Object(a.b)("h3",{id:"type"},"type"),Object(a.b)("p",null,"\u2022 ",Object(a.b)("strong",{parentName:"p"},"type"),": ",Object(a.b)("em",{parentName:"p"},"attachment")," ","|"," ",Object(a.b)("em",{parentName:"p"},"event")," ","|"," ",Object(a.b)("em",{parentName:"p"},"view")),Object(a.b)("p",null,"What kind of result this is."),Object(a.b)("p",null,"Defined in: ",Object(a.b)("a",{parentName:"p",href:"https://github.com/Divine-Software/ghostly/blob/50440ff/ghostly-engine/src/engine.ts#L40"},"ghostly-engine/src/engine.ts:40")))}s.isMDXComponent=!0},121:function(e,t,n){"use strict";n.d(t,"a",(function(){return b})),n.d(t,"b",(function(){return g}));var r=n(0),i=n.n(r);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function c(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?c(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):c(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var p=i.a.createContext({}),s=function(e){var t=i.a.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},b=function(e){var t=s(e.components);return i.a.createElement(p.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return i.a.createElement(i.a.Fragment,{},t)}},f=i.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,a=e.originalType,c=e.parentName,p=o(e,["components","mdxType","originalType","parentName"]),b=s(n),f=r,g=b["".concat(c,".").concat(f)]||b[f]||u[f]||a;return n?i.a.createElement(g,l(l({ref:t},p),{},{components:n})):i.a.createElement(g,l({ref:t},p))}));function g(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var a=n.length,c=new Array(a);c[0]=f;var l={};for(var o in t)hasOwnProperty.call(t,o)&&(l[o]=t[o]);l.originalType=e,l.mdxType="string"==typeof e?e:r,c[1]=l;for(var p=2;p<a;p++)c[p]=n[p];return i.a.createElement.apply(null,c)}return i.a.createElement.apply(null,n)}f.displayName="MDXCreateElement"}}]);