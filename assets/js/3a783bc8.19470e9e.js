(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{123:function(e,t,n){"use strict";n.d(t,"a",(function(){return p})),n.d(t,"b",(function(){return b}));var a=n(0),r=n.n(a);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=r.a.createContext({}),u=function(e){var t=r.a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},p=function(e){var t=u(e.components);return r.a.createElement(s.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.a.createElement(r.a.Fragment,{},t)}},m=r.a.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,i=e.parentName,s=c(e,["components","mdxType","originalType","parentName"]),p=u(n),m=a,b=p["".concat(i,".").concat(m)]||p[m]||d[m]||o;return n?r.a.createElement(b,l(l({ref:t},s),{},{components:n})):r.a.createElement(b,l({ref:t},s))}));function b(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=m;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l.mdxType="string"==typeof e?e:a,i[1]=l;for(var s=2;s<o;s++)i[s]=n[s];return r.a.createElement.apply(null,i)}return r.a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},124:function(e,t,n){"use strict";function a(e){var t,n,r="";if("string"==typeof e||"number"==typeof e)r+=e;else if("object"==typeof e)if(Array.isArray(e))for(t=0;t<e.length;t++)e[t]&&(n=a(e[t]))&&(r&&(r+=" "),r+=n);else for(t in e)e[t]&&(r&&(r+=" "),r+=t);return r}t.a=function(){for(var e,t,n=0,r="";n<arguments.length;)(e=arguments[n++])&&(t=a(e))&&(r&&(r+=" "),r+=t);return r}},131:function(e,t,n){"use strict";var a=n(0),r=n(132);t.a=function(){var e=Object(a.useContext)(r.a);if(null==e)throw new Error("`useUserPreferencesContext` is used outside of `Layout` Component.");return e}},132:function(e,t,n){"use strict";var a=n(0),r=Object(a.createContext)(void 0);t.a=r},139:function(e,t,n){"use strict";var a=n(0),r=n.n(a),o=n(131),i=n(124),l=n(58),c=n.n(l);var s=37,u=39;t.a=function(e){var t=e.lazy,n=e.block,l=e.defaultValue,p=e.values,d=e.groupId,m=e.className,b=Object(o.a)(),f=b.tabGroupChoices,g=b.setTabGroupChoices,v=Object(a.useState)(l),y=v[0],h=v[1],O=a.Children.toArray(e.children),j=[];if(null!=d){var w=f[d];null!=w&&w!==y&&p.some((function(e){return e.value===w}))&&h(w)}var E=function(e){var t=e.target,n=j.indexOf(t),a=O[n].props.value;h(a),null!=d&&(g(d,a),setTimeout((function(){var e,n,a,r,o,i,l,s;(e=t.getBoundingClientRect(),n=e.top,a=e.left,r=e.bottom,o=e.right,i=window,l=i.innerHeight,s=i.innerWidth,n>=0&&o<=s&&r<=l&&a>=0)||(t.scrollIntoView({block:"center",behavior:"smooth"}),t.classList.add(c.a.tabItemActive),setTimeout((function(){return t.classList.remove(c.a.tabItemActive)}),2e3))}),150))},x=function(e){var t,n;switch(e.keyCode){case u:var a=j.indexOf(e.target)+1;n=j[a]||j[0];break;case s:var r=j.indexOf(e.target)-1;n=j[r]||j[j.length-1]}null===(t=n)||void 0===t||t.focus()};return r.a.createElement("div",{className:"tabs-container"},r.a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:Object(i.a)("tabs",{"tabs--block":n},m)},p.map((function(e){var t=e.value,n=e.label;return r.a.createElement("li",{role:"tab",tabIndex:y===t?0:-1,"aria-selected":y===t,className:Object(i.a)("tabs__item",c.a.tabItem,{"tabs__item--active":y===t}),key:t,ref:function(e){return j.push(e)},onKeyDown:x,onFocus:E,onClick:E},n)}))),t?Object(a.cloneElement)(O.filter((function(e){return e.props.value===y}))[0],{className:"margin-vert--md"}):r.a.createElement("div",{className:"margin-vert--md"},O.map((function(e,t){return Object(a.cloneElement)(e,{key:t,hidden:e.props.value!==y})}))))}},140:function(e,t,n){"use strict";var a=n(0),r=n.n(a);t.a=function(e){var t=e.children,n=e.hidden,a=e.className;return r.a.createElement("div",{role:"tabpanel",hidden:n,className:a},t)}},85:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return c})),n.d(t,"metadata",(function(){return s})),n.d(t,"toc",(function(){return u})),n.d(t,"default",(function(){return d}));var a=n(3),r=n(7),o=(n(0),n(123)),i=n(139),l=n(140),c={title:"Node.js module"},s={unversionedId:"installation/node",id:"installation/node",isDocsHomePage:!1,title:"Node.js module",description:"Add the Ghostly Engine to your Node project:",source:"@site/docs/installation/node.mdx",slug:"/installation/node",permalink:"/ghostly/docs/installation/node",editUrl:"https://github.com/Divine-Software/ghostly/edit/master/website/docs/installation/node.mdx",version:"current",sidebar:"someSidebar",previous:{title:"Command Line Interface",permalink:"/ghostly/docs/installation/cli"},next:{title:"Docker Image",permalink:"/ghostly/docs/installation/docker"}},u=[],p={toc:u};function d(e){var t=e.components,n=Object(r.a)(e,["components"]);return Object(o.b)("wrapper",Object(a.a)({},p,n,{components:t,mdxType:"MDXLayout"}),Object(o.b)("p",null,"Add the Ghostly Engine to your Node project:"),Object(o.b)(i.a,{defaultValue:"npm",groupId:"jspm",values:[{label:"npm",value:"npm"},{label:"pnpm",value:"pnpm"},{label:"Yarn",value:"yarn"}],mdxType:"Tabs"},Object(o.b)(l.a,{value:"npm",mdxType:"TabItem"},Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-sh"},"npm install --save @divine/ghostly-engine\n"))),Object(o.b)(l.a,{value:"pnpm",mdxType:"TabItem"},Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-sh"},"pnpm add @divine/ghostly-engine\n"))),Object(o.b)(l.a,{value:"yarn",mdxType:"TabItem"},Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-sh"},"yarn add @divine/ghostly-engine\n")))),Object(o.b)("p",null,"Then, in your code, you create an ",Object(o.b)("a",{parentName:"p",href:"/ghostly/docs/api/classes/ghostly_engine.engine"},"Engine")," and instantiate a\n",Object(o.b)("a",{parentName:"p",href:"/ghostly/docs/api/interfaces/ghostly_engine.templateengine"},"TemplateEngine"),", which is used to render the data model."),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-js"},"import { Engine } from '@divine/ghostly-engine';\n\nconst TEMPLATE = 'https://divine-software.github.io/ghostly/examples/ghostly-plainjs-template.html';\nconst MODEL    = [ null, \"one\", 2, { \"three\": [ false, true ] } ];\nconst MODEL_CT = 'application/json';\n\n(async () => {\n    const engine = await new Engine({\n        logger: console,\n        pageCache: 10,\n        workers: 1,\n    }).start();\n\n    const template = engine.template(TEMPLATE);\n    const textBuff = await template.render(MODEL, MODEL_CT, 'text/plain; charset=utf-8');\n\n    console.log(textBuff.toString())\n    await engine.stop();\n})();\n")))}d.isMDXComponent=!0}}]);