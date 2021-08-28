"use strict";(self.webpackChunk_divine_ghostly_website=self.webpackChunk_divine_ghostly_website||[]).push([[1807],{9613:function(e,t,n){n.d(t,{Zo:function(){return c},kt:function(){return g}});var r=n(9496);function s(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){s(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function a(e,t){if(null==e)return{};var n,r,s=function(e,t){if(null==e)return{};var n,r,s={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(s[n]=e[n]);return s}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(s[n]=e[n])}return s}var l=r.createContext({}),p=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},c=function(e){var t=p(e.components);return r.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,s=e.mdxType,o=e.originalType,l=e.parentName,c=a(e,["components","mdxType","originalType","parentName"]),d=p(n),g=s,h=d["".concat(l,".").concat(g)]||d[g]||u[g]||o;return n?r.createElement(h,i(i({ref:t},c),{},{components:n})):r.createElement(h,i({ref:t},c))}));function g(e,t){var n=arguments,s=t&&t.mdxType;if("string"==typeof e||s){var o=n.length,i=new Array(o);i[0]=d;var a={};for(var l in t)hasOwnProperty.call(t,l)&&(a[l]=t[l]);a.originalType=e,a.mdxType="string"==typeof e?e:s,i[1]=a;for(var p=2;p<o;p++)i[p]=n[p];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},7080:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return a},contentTitle:function(){return l},metadata:function(){return p},toc:function(){return c},default:function(){return d}});var r=n(7316),s=n(5943),o=(n(9496),n(9613)),i=["components"],a={id:"ghostly_engine.WSResponse",title:"Class: WSResponse",sidebar_label:"WSResponse",custom_edit_url:null},l=void 0,p={unversionedId:"api/classes/ghostly_engine.WSResponse",id:"api/classes/ghostly_engine.WSResponse",isDocsHomePage:!1,title:"Class: WSResponse",description:"ghostly-engine.WSResponse",source:"@site/docs/api/classes/ghostly_engine.WSResponse.md",sourceDirName:"api/classes",slug:"/api/classes/ghostly_engine.WSResponse",permalink:"/ghostly/docs/api/classes/ghostly_engine.WSResponse",editUrl:null,tags:[],version:"current",frontMatter:{id:"ghostly_engine.WSResponse",title:"Class: WSResponse",sidebar_label:"WSResponse",custom_edit_url:null},sidebar:"someSidebar",previous:{title:"GhostlyError",permalink:"/ghostly/docs/api/classes/ghostly_engine.GhostlyError"},next:{title:"GhostlyError",permalink:"/ghostly/docs/api/classes/ghostly_runtime.GhostlyError"}},c=[{value:"Properties",id:"properties",children:[{value:"body",id:"body",children:[]},{value:"headers",id:"headers",children:[]},{value:"status",id:"status",children:[]}]}],u={toc:c};function d(e){var t=e.components,n=(0,s.Z)(e,i);return(0,o.kt)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"/ghostly/docs/api/modules/ghostly_engine"},"ghostly-engine"),".WSResponse"),(0,o.kt)("p",null,"Holds an HTTP response (a result or an error)."),(0,o.kt)("h2",{id:"properties"},"Properties"),(0,o.kt)("h3",{id:"body"},"body"),(0,o.kt)("p",null,"\u2022 ",(0,o.kt)("strong",{parentName:"p"},"body"),": ",(0,o.kt)("inlineCode",{parentName:"p"},"string")," ","|"," ",(0,o.kt)("inlineCode",{parentName:"p"},"Buffer")," ","|"," ",(0,o.kt)("a",{parentName:"p",href:"/ghostly/docs/api/interfaces/ghostly_engine.RenderResult"},(0,o.kt)("inlineCode",{parentName:"a"},"RenderResult")),"[]"),(0,o.kt)("p",null,"The response body (an error message, a ",(0,o.kt)("inlineCode",{parentName:"p"},"Buffer")," or a ",(0,o.kt)("a",{parentName:"p",href:"/ghostly/docs/api/interfaces/ghostly_engine.RenderResult"},"RenderResult")," array)."),(0,o.kt)("h4",{id:"defined-in"},"Defined in"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://github.com/Divine-Software/ghostly/blob/3c5d7b1/ghostly-engine/src/engine.ts#L160"},"ghostly-engine/src/engine.ts:160")),(0,o.kt)("hr",null),(0,o.kt)("h3",{id:"headers"},"headers"),(0,o.kt)("p",null,"\u2022 ",(0,o.kt)("inlineCode",{parentName:"p"},"Optional")," ",(0,o.kt)("strong",{parentName:"p"},"headers"),": ",(0,o.kt)("inlineCode",{parentName:"p"},"OutgoingHttpHeaders")),(0,o.kt)("p",null,"HTTP headers to send. Includes the ",(0,o.kt)("inlineCode",{parentName:"p"},"Content-Type")," header."),(0,o.kt)("h4",{id:"defined-in-1"},"Defined in"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://github.com/Divine-Software/ghostly/blob/3c5d7b1/ghostly-engine/src/engine.ts#L163"},"ghostly-engine/src/engine.ts:163")),(0,o.kt)("hr",null),(0,o.kt)("h3",{id:"status"},"status"),(0,o.kt)("p",null,"\u2022 ",(0,o.kt)("strong",{parentName:"p"},"status"),": ",(0,o.kt)("inlineCode",{parentName:"p"},"number")),(0,o.kt)("p",null,"The HTTP status code."),(0,o.kt)("h4",{id:"defined-in-2"},"Defined in"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://github.com/Divine-Software/ghostly/blob/3c5d7b1/ghostly-engine/src/engine.ts#L157"},"ghostly-engine/src/engine.ts:157")))}d.isMDXComponent=!0}}]);