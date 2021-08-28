"use strict";(self.webpackChunk_divine_ghostly_website=self.webpackChunk_divine_ghostly_website||[]).push([[3557],{9613:function(e,n,t){t.d(n,{Zo:function(){return c},kt:function(){return g}});var r=t(9496);function i(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function a(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){i(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function l(e,n){if(null==e)return{};var t,r,i=function(e,n){if(null==e)return{};var t,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||(i[t]=e[t]);return i}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var s=r.createContext({}),p=function(e){var n=r.useContext(s),t=n;return e&&(t="function"==typeof e?e(n):a(a({},n),e)),t},c=function(e){var n=p(e.components);return r.createElement(s.Provider,{value:n},e.children)},d={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},u=r.forwardRef((function(e,n){var t=e.components,i=e.mdxType,o=e.originalType,s=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),u=p(t),g=i,h=u["".concat(s,".").concat(g)]||u[g]||d[g]||o;return t?r.createElement(h,a(a({ref:n},c),{},{components:t})):r.createElement(h,a({ref:n},c))}));function g(e,n){var t=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var o=t.length,a=new Array(o);a[0]=u;var l={};for(var s in n)hasOwnProperty.call(n,s)&&(l[s]=n[s]);l.originalType=e,l.mdxType="string"==typeof e?e:i,a[1]=l;for(var p=2;p<o;p++)a[p]=t[p];return r.createElement.apply(null,a)}return r.createElement.apply(null,t)}u.displayName="MDXCreateElement"},3387:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return l},contentTitle:function(){return s},metadata:function(){return p},toc:function(){return c},default:function(){return u}});var r=t(7316),i=t(5943),o=(t(9496),t(9613)),a=["components"],l={id:"ghostly_engine.RenderRequest",title:"Interface: RenderRequest",sidebar_label:"RenderRequest",custom_edit_url:null},s=void 0,p={unversionedId:"api/interfaces/ghostly_engine.RenderRequest",id:"api/interfaces/ghostly_engine.RenderRequest",isDocsHomePage:!1,title:"Interface: RenderRequest",description:"ghostly-engine.RenderRequest",source:"@site/docs/api/interfaces/ghostly_engine.RenderRequest.md",sourceDirName:"api/interfaces",slug:"/api/interfaces/ghostly_engine.RenderRequest",permalink:"/ghostly/docs/api/interfaces/ghostly_engine.RenderRequest",editUrl:null,tags:[],version:"current",frontMatter:{id:"ghostly_engine.RenderRequest",title:"Interface: RenderRequest",sidebar_label:"RenderRequest",custom_edit_url:null},sidebar:"someSidebar",previous:{title:"EngineConfig",permalink:"/ghostly/docs/api/interfaces/ghostly_engine.EngineConfig"},next:{title:"RenderResult",permalink:"/ghostly/docs/api/interfaces/ghostly_engine.RenderResult"}},c=[{value:"Hierarchy",id:"hierarchy",children:[]},{value:"Properties",id:"properties",children:[{value:"attachments",id:"attachments",children:[]},{value:"contentType",id:"contenttype",children:[]},{value:"document",id:"document",children:[]},{value:"locale",id:"locale",children:[]},{value:"timeZone",id:"timezone",children:[]},{value:"views",id:"views",children:[]}]}],d={toc:c};function u(e){var n=e.components,t=(0,i.Z)(e,a);return(0,o.kt)("wrapper",(0,r.Z)({},d,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"/ghostly/docs/api/modules/ghostly_engine"},"ghostly-engine"),".RenderRequest"),(0,o.kt)("p",null,"The source document and parameters that should be rendered."),(0,o.kt)("h2",{id:"hierarchy"},"Hierarchy"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("strong",{parentName:"p"},(0,o.kt)("inlineCode",{parentName:"strong"},"RenderRequest"))),(0,o.kt)("p",{parentName:"li"},"\u21b3 ",(0,o.kt)("a",{parentName:"p",href:"/ghostly/docs/api/interfaces/ghostly_engine.WSRenderRequest"},(0,o.kt)("inlineCode",{parentName:"a"},"WSRenderRequest"))))),(0,o.kt)("h2",{id:"properties"},"Properties"),(0,o.kt)("h3",{id:"attachments"},"attachments"),(0,o.kt)("p",null,"\u2022 ",(0,o.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,o.kt)("strong",{parentName:"p"},"attachments"),": ",(0,o.kt)("inlineCode",{parentName:"p"},"boolean")),(0,o.kt)("p",null,"Set to ",(0,o.kt)("inlineCode",{parentName:"p"},"true")," if attachments, if any, should be generated as well."),(0,o.kt)("h4",{id:"defined-in"},"Defined in"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://github.com/Divine-Software/ghostly/blob/3c5d7b1/ghostly-engine/src/engine.ts#L88"},"ghostly-engine/src/engine.ts:88")),(0,o.kt)("hr",null),(0,o.kt)("h3",{id:"contenttype"},"contentType"),(0,o.kt)("p",null,"\u2022 ",(0,o.kt)("strong",{parentName:"p"},"contentType"),": ",(0,o.kt)("inlineCode",{parentName:"p"},"string")),(0,o.kt)("p",null,"The model's media type. Used when ",(0,o.kt)("inlineCode",{parentName:"p"},"document")," is a string."),(0,o.kt)("h4",{id:"defined-in-1"},"Defined in"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://github.com/Divine-Software/ghostly/blob/3c5d7b1/ghostly-engine/src/engine.ts#L82"},"ghostly-engine/src/engine.ts:82")),(0,o.kt)("hr",null),(0,o.kt)("h3",{id:"document"},"document"),(0,o.kt)("p",null,"\u2022 ",(0,o.kt)("strong",{parentName:"p"},"document"),": ",(0,o.kt)("inlineCode",{parentName:"p"},"string")," ","|"," ",(0,o.kt)("inlineCode",{parentName:"p"},"object")),(0,o.kt)("p",null,"The model to render, as a string or embedded JSON object."),(0,o.kt)("h4",{id:"defined-in-2"},"Defined in"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://github.com/Divine-Software/ghostly/blob/3c5d7b1/ghostly-engine/src/engine.ts#L79"},"ghostly-engine/src/engine.ts:79")),(0,o.kt)("hr",null),(0,o.kt)("h3",{id:"locale"},"locale"),(0,o.kt)("p",null,"\u2022 ",(0,o.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,o.kt)("strong",{parentName:"p"},"locale"),": ",(0,o.kt)("inlineCode",{parentName:"p"},"string")),(0,o.kt)("p",null,"The locale to use when rendering. Defaults to the ",(0,o.kt)("a",{parentName:"p",href:"/ghostly/docs/api/interfaces/ghostly_engine.EngineConfig"},"EngineConfig")," locale."),(0,o.kt)("h4",{id:"defined-in-3"},"Defined in"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://github.com/Divine-Software/ghostly/blob/3c5d7b1/ghostly-engine/src/engine.ts#L91"},"ghostly-engine/src/engine.ts:91")),(0,o.kt)("hr",null),(0,o.kt)("h3",{id:"timezone"},"timeZone"),(0,o.kt)("p",null,"\u2022 ",(0,o.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,o.kt)("strong",{parentName:"p"},"timeZone"),": ",(0,o.kt)("inlineCode",{parentName:"p"},"string")),(0,o.kt)("p",null,"The time zone to use when rendering. Defaults to the ",(0,o.kt)("a",{parentName:"p",href:"/ghostly/docs/api/interfaces/ghostly_engine.EngineConfig"},"EngineConfig")," time zone."),(0,o.kt)("h4",{id:"defined-in-4"},"Defined in"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://github.com/Divine-Software/ghostly/blob/3c5d7b1/ghostly-engine/src/engine.ts#L94"},"ghostly-engine/src/engine.ts:94")),(0,o.kt)("hr",null),(0,o.kt)("h3",{id:"views"},"views"),(0,o.kt)("p",null,"\u2022 ",(0,o.kt)("strong",{parentName:"p"},"views"),": ",(0,o.kt)("a",{parentName:"p",href:"/ghostly/docs/api/interfaces/ghostly_engine.View"},(0,o.kt)("inlineCode",{parentName:"a"},"View")),"<",(0,o.kt)("inlineCode",{parentName:"p"},"unknown"),">","[]"),(0,o.kt)("p",null,"What views to render."),(0,o.kt)("h4",{id:"defined-in-5"},"Defined in"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://github.com/Divine-Software/ghostly/blob/3c5d7b1/ghostly-engine/src/engine.ts#L85"},"ghostly-engine/src/engine.ts:85")))}u.isMDXComponent=!0}}]);