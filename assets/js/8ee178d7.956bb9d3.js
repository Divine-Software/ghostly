(window.webpackJsonp=window.webpackJsonp||[]).push([[25],{121:function(e,t,r){"use strict";r.d(t,"a",(function(){return p})),r.d(t,"b",(function(){return d}));var n=r(0),a=r.n(n);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function l(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function c(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?l(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):l(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var b=a.a.createContext({}),i=function(e){var t=a.a.useContext(b),r=t;return e&&(r="function"==typeof e?e(t):c(c({},t),e)),r},p=function(e){var t=i(e.components);return a.a.createElement(b.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},u=a.a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,o=e.originalType,l=e.parentName,b=s(e,["components","mdxType","originalType","parentName"]),p=i(r),u=n,d=p["".concat(l,".").concat(u)]||p[u]||m[u]||o;return r?a.a.createElement(d,c(c({ref:t},b),{},{components:r})):a.a.createElement(d,c({ref:t},b))}));function d(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var o=r.length,l=new Array(o);l[0]=u;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c.mdxType="string"==typeof e?e:n,l[1]=c;for(var b=2;b<o;b++)l[b]=r[b];return a.a.createElement.apply(null,l)}return a.a.createElement.apply(null,r)}u.displayName="MDXCreateElement"},97:function(e,t,r){"use strict";r.r(t),r.d(t,"frontMatter",(function(){return l})),r.d(t,"metadata",(function(){return c})),r.d(t,"toc",(function(){return s})),r.d(t,"default",(function(){return i}));var n=r(3),a=r(7),o=(r(0),r(121)),l={id:"ghostly_runtime.ghostlyerror",title:"Class: GhostlyError",sidebar_label:"GhostlyError",custom_edit_url:null,hide_title:!0},c={unversionedId:"api/classes/ghostly_runtime.ghostlyerror",id:"api/classes/ghostly_runtime.ghostlyerror",isDocsHomePage:!1,title:"Class: GhostlyError",description:"Class: GhostlyError",source:"@site/docs/api/classes/ghostly_runtime.ghostlyerror.md",slug:"/api/classes/ghostly_runtime.ghostlyerror",permalink:"/ghostly/docs/api/classes/ghostly_runtime.ghostlyerror",editUrl:null,version:"current",sidebar_label:"GhostlyError",sidebar:"someSidebar",previous:{title:"Class: WSResponse",permalink:"/ghostly/docs/api/classes/ghostly_engine.wsresponse"},next:{title:"Class: PreviewDriver",permalink:"/ghostly/docs/api/classes/ghostly_runtime.previewdriver"}},s=[{value:"Hierarchy",id:"hierarchy",children:[]},{value:"Constructors",id:"constructors",children:[{value:"constructor",id:"constructor",children:[]}]},{value:"Properties",id:"properties",children:[{value:"data",id:"data",children:[]},{value:"message",id:"message",children:[]},{value:"name",id:"name",children:[]},{value:"stack",id:"stack",children:[]}]},{value:"Methods",id:"methods",children:[{value:"toString",id:"tostring",children:[]}]}],b={toc:s};function i(e){var t=e.components,r=Object(a.a)(e,["components"]);return Object(o.b)("wrapper",Object(n.a)({},b,r,{components:t,mdxType:"MDXLayout"}),Object(o.b)("h1",{id:"class-ghostlyerror"},"Class: GhostlyError"),Object(o.b)("p",null,Object(o.b)("a",{parentName:"p",href:"/ghostly/docs/api/modules/ghostly_runtime"},"ghostly-runtime"),".GhostlyError"),Object(o.b)("p",null,"An Error class that can propage an extra data member back to the controlling application/driver."),Object(o.b)("h2",{id:"hierarchy"},"Hierarchy"),Object(o.b)("ul",null,Object(o.b)("li",{parentName:"ul"},Object(o.b)("p",{parentName:"li"},Object(o.b)("em",{parentName:"p"},"Error")),Object(o.b)("p",{parentName:"li"},"\u21b3 ",Object(o.b)("strong",{parentName:"p"},"GhostlyError")))),Object(o.b)("h2",{id:"constructors"},"Constructors"),Object(o.b)("h3",{id:"constructor"},"constructor"),Object(o.b)("p",null,"+"," ",Object(o.b)("strong",{parentName:"p"},"new GhostlyError"),"(",Object(o.b)("inlineCode",{parentName:"p"},"message"),": ",Object(o.b)("em",{parentName:"p"},"string"),", ",Object(o.b)("inlineCode",{parentName:"p"},"data?"),": ",Object(o.b)("em",{parentName:"p"},"null")," ","|"," ",Object(o.b)("em",{parentName:"p"},"string")," ","|"," ",Object(o.b)("em",{parentName:"p"},"object"),"): ",Object(o.b)("a",{parentName:"p",href:"/ghostly/docs/api/classes/ghostly_runtime.ghostlyerror"},Object(o.b)("em",{parentName:"a"},"GhostlyError"))),Object(o.b)("h4",{id:"parameters"},"Parameters:"),Object(o.b)("table",null,Object(o.b)("thead",{parentName:"table"},Object(o.b)("tr",{parentName:"thead"},Object(o.b)("th",{parentName:"tr",align:"left"},"Name"),Object(o.b)("th",{parentName:"tr",align:"left"},"Type"))),Object(o.b)("tbody",{parentName:"table"},Object(o.b)("tr",{parentName:"tbody"},Object(o.b)("td",{parentName:"tr",align:"left"},Object(o.b)("inlineCode",{parentName:"td"},"message")),Object(o.b)("td",{parentName:"tr",align:"left"},Object(o.b)("em",{parentName:"td"},"string"))),Object(o.b)("tr",{parentName:"tbody"},Object(o.b)("td",{parentName:"tr",align:"left"},Object(o.b)("inlineCode",{parentName:"td"},"data?")),Object(o.b)("td",{parentName:"tr",align:"left"},Object(o.b)("em",{parentName:"td"},"null")," ","|"," ",Object(o.b)("em",{parentName:"td"},"string")," ","|"," ",Object(o.b)("em",{parentName:"td"},"object"))))),Object(o.b)("p",null,Object(o.b)("strong",{parentName:"p"},"Returns:")," ",Object(o.b)("a",{parentName:"p",href:"/ghostly/docs/api/classes/ghostly_runtime.ghostlyerror"},Object(o.b)("em",{parentName:"a"},"GhostlyError"))),Object(o.b)("p",null,"Overrides: void"),Object(o.b)("p",null,"Defined in: ",Object(o.b)("a",{parentName:"p",href:"https://github.com/Divine-Software/ghostly/blob/0022c79/ghostly-runtime/src/types.ts#L111"},"ghostly-runtime/src/types.ts:111")),Object(o.b)("h2",{id:"properties"},"Properties"),Object(o.b)("h3",{id:"data"},"data"),Object(o.b)("p",null,"\u2022 ",Object(o.b)("inlineCode",{parentName:"p"},"Optional")," ",Object(o.b)("strong",{parentName:"p"},"data"),": ",Object(o.b)("em",{parentName:"p"},"null")," ","|"," ",Object(o.b)("em",{parentName:"p"},"string")," ","|"," ",Object(o.b)("em",{parentName:"p"},"object")),Object(o.b)("hr",null),Object(o.b)("h3",{id:"message"},"message"),Object(o.b)("p",null,"\u2022 ",Object(o.b)("strong",{parentName:"p"},"message"),": ",Object(o.b)("em",{parentName:"p"},"string")),Object(o.b)("p",null,"Inherited from: void"),Object(o.b)("p",null,"Defined in: node_modules/typescript/lib/lib.es5.d.ts:974"),Object(o.b)("hr",null),Object(o.b)("h3",{id:"name"},"name"),Object(o.b)("p",null,"\u2022 ",Object(o.b)("strong",{parentName:"p"},"name"),": ",Object(o.b)("em",{parentName:"p"},"string")),Object(o.b)("p",null,"Inherited from: void"),Object(o.b)("p",null,"Defined in: node_modules/typescript/lib/lib.es5.d.ts:973"),Object(o.b)("hr",null),Object(o.b)("h3",{id:"stack"},"stack"),Object(o.b)("p",null,"\u2022 ",Object(o.b)("inlineCode",{parentName:"p"},"Optional")," ",Object(o.b)("strong",{parentName:"p"},"stack"),": ",Object(o.b)("em",{parentName:"p"},"string")),Object(o.b)("p",null,"Inherited from: void"),Object(o.b)("p",null,"Defined in: node_modules/typescript/lib/lib.es5.d.ts:975"),Object(o.b)("h2",{id:"methods"},"Methods"),Object(o.b)("h3",{id:"tostring"},"toString"),Object(o.b)("p",null,"\u25b8 ",Object(o.b)("strong",{parentName:"p"},"toString"),"(): ",Object(o.b)("em",{parentName:"p"},"string")),Object(o.b)("p",null,Object(o.b)("strong",{parentName:"p"},"Returns:")," ",Object(o.b)("em",{parentName:"p"},"string")),Object(o.b)("p",null,"Defined in: ",Object(o.b)("a",{parentName:"p",href:"https://github.com/Divine-Software/ghostly/blob/0022c79/ghostly-runtime/src/types.ts#L120"},"ghostly-runtime/src/types.ts:120")))}i.isMDXComponent=!0}}]);