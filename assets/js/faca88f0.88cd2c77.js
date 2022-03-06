"use strict";(self.webpackChunk_divine_ghostly_website=self.webpackChunk_divine_ghostly_website||[]).push([[3054],{9613:function(e,t,n){n.d(t,{Zo:function(){return s},kt:function(){return g}});var a=n(9496);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var p=a.createContext({}),d=function(e){var t=a.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},s=function(e){var t=d(e.components);return a.createElement(p.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},k=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,p=e.parentName,s=o(e,["components","mdxType","originalType","parentName"]),k=d(n),g=r,f=k["".concat(p,".").concat(g)]||k[g]||m[g]||i;return n?a.createElement(f,l(l({ref:t},s),{},{components:n})):a.createElement(f,l({ref:t},s))}));function g(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,l=new Array(i);l[0]=k;var o={};for(var p in t)hasOwnProperty.call(t,p)&&(o[p]=t[p]);o.originalType=e,o.mdxType="string"==typeof e?e:r,l[1]=o;for(var d=2;d<i;d++)l[d]=n[d];return a.createElement.apply(null,l)}return a.createElement.apply(null,n)}k.displayName="MDXCreateElement"},2206:function(e,t,n){n.r(t),n.d(t,{assets:function(){return s},contentTitle:function(){return p},default:function(){return g},frontMatter:function(){return o},metadata:function(){return d},toc:function(){return m}});var a=n(7813),r=n(7044),i=(n(9496),n(9613)),l=["components"],o={id:"ghostly_engine.TemplateEngine",title:"Interface: TemplateEngine",sidebar_label:"TemplateEngine",custom_edit_url:null},p=void 0,d={unversionedId:"api/interfaces/ghostly_engine.TemplateEngine",id:"api/interfaces/ghostly_engine.TemplateEngine",title:"Interface: TemplateEngine",description:"ghostly-engine.TemplateEngine",source:"@site/docs/api/interfaces/ghostly_engine.TemplateEngine.md",sourceDirName:"api/interfaces",slug:"/api/interfaces/ghostly_engine.TemplateEngine",permalink:"/ghostly/docs/api/interfaces/ghostly_engine.TemplateEngine",editUrl:null,tags:[],version:"current",frontMatter:{id:"ghostly_engine.TemplateEngine",title:"Interface: TemplateEngine",sidebar_label:"TemplateEngine",custom_edit_url:null},sidebar:"someSidebar",previous:{title:"TemplateConfig",permalink:"/ghostly/docs/api/interfaces/ghostly_engine.TemplateConfig"},next:{title:"View",permalink:"/ghostly/docs/api/interfaces/ghostly_engine.View"}},s={},m=[{value:"Methods",id:"methods",level:2},{value:"render",id:"render",level:3},{value:"Parameters",id:"parameters",level:4},{value:"Returns",id:"returns",level:4},{value:"Defined in",id:"defined-in",level:4},{value:"renderRequest",id:"renderrequest",level:3},{value:"Parameters",id:"parameters-1",level:4},{value:"Returns",id:"returns-1",level:4},{value:"Defined in",id:"defined-in-1",level:4},{value:"renderViews",id:"renderviews",level:3},{value:"Parameters",id:"parameters-2",level:4},{value:"Returns",id:"returns-2",level:4},{value:"Defined in",id:"defined-in-2",level:4}],k={toc:m};function g(e){var t=e.components,n=(0,r.Z)(e,l);return(0,i.kt)("wrapper",(0,a.Z)({},k,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"/ghostly/docs/api/modules/ghostly_engine"},"ghostly-engine"),".TemplateEngine"),(0,i.kt)("p",null,"The Template Engine API."),(0,i.kt)("h2",{id:"methods"},"Methods"),(0,i.kt)("h3",{id:"render"},"render"),(0,i.kt)("p",null,"\u25b8 ",(0,i.kt)("strong",{parentName:"p"},"render"),"(",(0,i.kt)("inlineCode",{parentName:"p"},"document"),", ",(0,i.kt)("inlineCode",{parentName:"p"},"contentType"),", ",(0,i.kt)("inlineCode",{parentName:"p"},"format"),", ",(0,i.kt)("inlineCode",{parentName:"p"},"params?"),", ",(0,i.kt)("inlineCode",{parentName:"p"},"onGhostlyEvent?"),"): ",(0,i.kt)("inlineCode",{parentName:"p"},"Promise"),"<",(0,i.kt)("inlineCode",{parentName:"p"},"Buffer"),">"),(0,i.kt)("p",null,"Render a single view from a model (with no attachments) and return the result as a ",(0,i.kt)("inlineCode",{parentName:"p"},"Buffer"),"."),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},(0,i.kt)("inlineCode",{parentName:"strong"},"throws"))," GhostlyError   Template-related errors."),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},(0,i.kt)("inlineCode",{parentName:"strong"},"throws"))," Error          Other internal errors."),(0,i.kt)("h4",{id:"parameters"},"Parameters"),(0,i.kt)("table",null,(0,i.kt)("thead",{parentName:"table"},(0,i.kt)("tr",{parentName:"thead"},(0,i.kt)("th",{parentName:"tr",align:"left"},"Name"),(0,i.kt)("th",{parentName:"tr",align:"left"},"Type"),(0,i.kt)("th",{parentName:"tr",align:"left"},"Description"))),(0,i.kt)("tbody",{parentName:"table"},(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("inlineCode",{parentName:"td"},"document")),(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("inlineCode",{parentName:"td"},"string")," ","|"," ",(0,i.kt)("inlineCode",{parentName:"td"},"object")),(0,i.kt)("td",{parentName:"tr",align:"left"},"The model to render.")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("inlineCode",{parentName:"td"},"contentType")),(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("inlineCode",{parentName:"td"},"string")),(0,i.kt)("td",{parentName:"tr",align:"left"},"The model's media type.")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("inlineCode",{parentName:"td"},"format")),(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("inlineCode",{parentName:"td"},"string")),(0,i.kt)("td",{parentName:"tr",align:"left"},"The media type of the view to render (",(0,i.kt)("inlineCode",{parentName:"td"},"text/html"),", ",(0,i.kt)("inlineCode",{parentName:"td"},"image/png"),", ",(0,i.kt)("inlineCode",{parentName:"td"},"application/pdf")," ...).")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("inlineCode",{parentName:"td"},"params?")),(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("inlineCode",{parentName:"td"},"unknown")),(0,i.kt)("td",{parentName:"tr",align:"left"},"Optional view params as parsed JSON.")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("inlineCode",{parentName:"td"},"onGhostlyEvent?")),(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("a",{parentName:"td",href:"/ghostly/docs/api/modules/ghostly_engine#onghostlyevent"},(0,i.kt)("inlineCode",{parentName:"a"},"OnGhostlyEvent"))),(0,i.kt)("td",{parentName:"tr",align:"left"},"Optional callback to invoke if the template emits an event using ",(0,i.kt)("a",{parentName:"td",href:"/ghostly/docs/api/namespaces/ghostly_runtime.ghostly#notify"},"notify"),".")))),(0,i.kt)("h4",{id:"returns"},"Returns"),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"Promise"),"<",(0,i.kt)("inlineCode",{parentName:"p"},"Buffer"),">"),(0,i.kt)("p",null,"A ",(0,i.kt)("inlineCode",{parentName:"p"},"Buffer")," containing the rendered document."),(0,i.kt)("h4",{id:"defined-in"},"Defined in"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://github.com/Divine-Software/ghostly/blob/2ffa5f5/ghostly-engine/src/engine.ts#L125"},"ghostly-engine/src/engine.ts:125")),(0,i.kt)("hr",null),(0,i.kt)("h3",{id:"renderrequest"},"renderRequest"),(0,i.kt)("p",null,"\u25b8 ",(0,i.kt)("strong",{parentName:"p"},"renderRequest"),"(",(0,i.kt)("inlineCode",{parentName:"p"},"request"),", ",(0,i.kt)("inlineCode",{parentName:"p"},"onGhostlyEvent?"),"): ",(0,i.kt)("inlineCode",{parentName:"p"},"Promise"),"<",(0,i.kt)("a",{parentName:"p",href:"/ghostly/docs/api/interfaces/ghostly_engine.RenderResult"},(0,i.kt)("inlineCode",{parentName:"a"},"RenderResult")),"[]",">"),(0,i.kt)("p",null,"Render multiple views and/or attachments from a model and return the results as a ",(0,i.kt)("a",{parentName:"p",href:"/ghostly/docs/api/interfaces/ghostly_engine.RenderResult"},"RenderResult")," array."),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},(0,i.kt)("inlineCode",{parentName:"strong"},"throws"))," GhostlyError   Template-related errors."),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},(0,i.kt)("inlineCode",{parentName:"strong"},"throws"))," Error          Other internal errors."),(0,i.kt)("h4",{id:"parameters-1"},"Parameters"),(0,i.kt)("table",null,(0,i.kt)("thead",{parentName:"table"},(0,i.kt)("tr",{parentName:"thead"},(0,i.kt)("th",{parentName:"tr",align:"left"},"Name"),(0,i.kt)("th",{parentName:"tr",align:"left"},"Type"),(0,i.kt)("th",{parentName:"tr",align:"left"},"Description"))),(0,i.kt)("tbody",{parentName:"table"},(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("inlineCode",{parentName:"td"},"request")),(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("a",{parentName:"td",href:"/ghostly/docs/api/interfaces/ghostly_engine.RenderRequest"},(0,i.kt)("inlineCode",{parentName:"a"},"RenderRequest"))),(0,i.kt)("td",{parentName:"tr",align:"left"},"Render parameters/options.")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("inlineCode",{parentName:"td"},"onGhostlyEvent?")),(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("a",{parentName:"td",href:"/ghostly/docs/api/modules/ghostly_engine#onghostlyevent"},(0,i.kt)("inlineCode",{parentName:"a"},"OnGhostlyEvent"))),(0,i.kt)("td",{parentName:"tr",align:"left"},"Optional callback to invoke if the template emits an event using ",(0,i.kt)("a",{parentName:"td",href:"/ghostly/docs/api/namespaces/ghostly_runtime.ghostly#notify"},"notify"),".")))),(0,i.kt)("h4",{id:"returns-1"},"Returns"),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"Promise"),"<",(0,i.kt)("a",{parentName:"p",href:"/ghostly/docs/api/interfaces/ghostly_engine.RenderResult"},(0,i.kt)("inlineCode",{parentName:"a"},"RenderResult")),"[]",">"),(0,i.kt)("p",null,"A ",(0,i.kt)("inlineCode",{parentName:"p"},"Buffer")," containing the rendered document."),(0,i.kt)("h4",{id:"defined-in-1"},"Defined in"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://github.com/Divine-Software/ghostly/blob/2ffa5f5/ghostly-engine/src/engine.ts#L136"},"ghostly-engine/src/engine.ts:136")),(0,i.kt)("hr",null),(0,i.kt)("h3",{id:"renderviews"},"renderViews"),(0,i.kt)("p",null,"\u25b8 ",(0,i.kt)("strong",{parentName:"p"},"renderViews"),"(",(0,i.kt)("inlineCode",{parentName:"p"},"document"),", ",(0,i.kt)("inlineCode",{parentName:"p"},"contentType"),", ",(0,i.kt)("inlineCode",{parentName:"p"},"views"),", ",(0,i.kt)("inlineCode",{parentName:"p"},"attachments"),", ",(0,i.kt)("inlineCode",{parentName:"p"},"onGhostlyEvent?"),"): ",(0,i.kt)("inlineCode",{parentName:"p"},"Promise"),"<",(0,i.kt)("a",{parentName:"p",href:"/ghostly/docs/api/interfaces/ghostly_engine.RenderResult"},(0,i.kt)("inlineCode",{parentName:"a"},"RenderResult")),"[]",">"),(0,i.kt)("p",null,"Render multiple views and/or attachments from a model and return the results as a ",(0,i.kt)("a",{parentName:"p",href:"/ghostly/docs/api/interfaces/ghostly_engine.RenderResult"},"RenderResult")," array."),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},(0,i.kt)("inlineCode",{parentName:"strong"},"throws"))," GhostlyError   Template-related errors."),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},(0,i.kt)("inlineCode",{parentName:"strong"},"throws"))," Error          Other internal errors."),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},(0,i.kt)("inlineCode",{parentName:"strong"},"deprecated"))," Use ",(0,i.kt)("a",{parentName:"p",href:"/ghostly/docs/api/interfaces/ghostly_engine.TemplateEngine#renderrequest"},"renderRequest")," instead."),(0,i.kt)("h4",{id:"parameters-2"},"Parameters"),(0,i.kt)("table",null,(0,i.kt)("thead",{parentName:"table"},(0,i.kt)("tr",{parentName:"thead"},(0,i.kt)("th",{parentName:"tr",align:"left"},"Name"),(0,i.kt)("th",{parentName:"tr",align:"left"},"Type"),(0,i.kt)("th",{parentName:"tr",align:"left"},"Description"))),(0,i.kt)("tbody",{parentName:"table"},(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("inlineCode",{parentName:"td"},"document")),(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("inlineCode",{parentName:"td"},"string")," ","|"," ",(0,i.kt)("inlineCode",{parentName:"td"},"object")),(0,i.kt)("td",{parentName:"tr",align:"left"},"The model to render.")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("inlineCode",{parentName:"td"},"contentType")),(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("inlineCode",{parentName:"td"},"string")),(0,i.kt)("td",{parentName:"tr",align:"left"},"The model's media type.")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("inlineCode",{parentName:"td"},"views")),(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("a",{parentName:"td",href:"/ghostly/docs/api/interfaces/ghostly_engine.View"},(0,i.kt)("inlineCode",{parentName:"a"},"View")),"<",(0,i.kt)("inlineCode",{parentName:"td"},"unknown"),">","[]"),(0,i.kt)("td",{parentName:"tr",align:"left"},"View definitions.")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("inlineCode",{parentName:"td"},"attachments")),(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("inlineCode",{parentName:"td"},"boolean")),(0,i.kt)("td",{parentName:"tr",align:"left"},"Set to ",(0,i.kt)("inlineCode",{parentName:"td"},"true")," if you also want to render the attachments (if any).")),(0,i.kt)("tr",{parentName:"tbody"},(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("inlineCode",{parentName:"td"},"onGhostlyEvent?")),(0,i.kt)("td",{parentName:"tr",align:"left"},(0,i.kt)("a",{parentName:"td",href:"/ghostly/docs/api/modules/ghostly_engine#onghostlyevent"},(0,i.kt)("inlineCode",{parentName:"a"},"OnGhostlyEvent"))),(0,i.kt)("td",{parentName:"tr",align:"left"},"Optional callback to invoke if the template emits an event using ",(0,i.kt)("a",{parentName:"td",href:"/ghostly/docs/api/namespaces/ghostly_runtime.ghostly#notify"},"notify"),".")))),(0,i.kt)("h4",{id:"returns-2"},"Returns"),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"Promise"),"<",(0,i.kt)("a",{parentName:"p",href:"/ghostly/docs/api/interfaces/ghostly_engine.RenderResult"},(0,i.kt)("inlineCode",{parentName:"a"},"RenderResult")),"[]",">"),(0,i.kt)("p",null,"A ",(0,i.kt)("inlineCode",{parentName:"p"},"Buffer")," containing the rendered document."),(0,i.kt)("h4",{id:"defined-in-2"},"Defined in"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://github.com/Divine-Software/ghostly/blob/2ffa5f5/ghostly-engine/src/engine.ts#L151"},"ghostly-engine/src/engine.ts:151")))}g.isMDXComponent=!0}}]);