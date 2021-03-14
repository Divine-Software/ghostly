(window.webpackJsonp=window.webpackJsonp||[]).push([[34],{105:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return c})),n.d(t,"metadata",(function(){return l})),n.d(t,"toc",(function(){return i})),n.d(t,"default",(function(){return p}));var r=n(3),o=n(7),a=(n(0),n(121)),c={title:"Docker Image"},l={unversionedId:"installation/docker",id:"installation/docker",isDocsHomePage:!1,title:"Docker Image",description:"To run the Ghostly WS API server, just forward port 80 and run the Docker image without arguments:",source:"@site/docs/installation/docker.md",slug:"/installation/docker",permalink:"/ghostly/docs/installation/docker",editUrl:"https://github.com/Divine-Software/ghostly/edit/master/website/docs/installation/docker.md",version:"current",sidebar:"someSidebar",previous:{title:"Node.js module",permalink:"/ghostly/docs/installation/node"},next:{title:"ghostly",permalink:"/ghostly/docs/api"}},i=[],s={toc:i};function p(e){var t=e.components,n=Object(o.a)(e,["components"]);return Object(a.b)("wrapper",Object(r.a)({},s,n,{components:t,mdxType:"MDXLayout"}),Object(a.b)("p",null,"To run the Ghostly WS API server, just forward port 80 and run the Docker image without arguments:"),Object(a.b)("pre",null,Object(a.b)("code",{parentName:"pre",className:"language-sh"},"docker run -p 8888:80 divinesoftware/ghostly\n")),Object(a.b)("p",null,"The server is then ready to accept requests on ",Object(a.b)("a",{parentName:"p",href:"http://localhost:8888/"},"http://localhost:8888/"),"."),Object(a.b)("p",null,"You may also replace the default options to ",Object(a.b)("inlineCode",{parentName:"p"},"ghostly-cli"),". For instance, the following command is exactly equivalent to the previous example:"),Object(a.b)("pre",null,Object(a.b)("code",{parentName:"pre",className:"language-sh"},"docker run -p 8888:80 divinesoftware/ghostly --debug --page-cache=10 --user=pwuser --http=:80\n")),Object(a.b)("p",null,"This means that you can also execute ",Object(a.b)("inlineCode",{parentName:"p"},"ghostly-cli")," in command-line mode. Just remember that the local filesystem and\n",Object(a.b)("inlineCode",{parentName:"p"},"localhost")," refers to the local Docker instance's resources, not the host's."),Object(a.b)("pre",null,Object(a.b)("code",{parentName:"pre",className:"language-sh"},"docker run -p 8888:80 divinesoftware/ghostly \\\n    --template https://divine-software.github.io/ghostly/examples/ghostly-plainjs-template.html \\\n    --format application/pdf \\\n    - < model.json > output.pdf\n")),Object(a.b)("p",null,"See ",Object(a.b)("a",{parentName:"p",href:"./cli"},"Command Line Interface")," for more information."))}p.isMDXComponent=!0},121:function(e,t,n){"use strict";n.d(t,"a",(function(){return u})),n.d(t,"b",(function(){return b}));var r=n(0),o=n.n(r);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function c(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?c(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):c(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var s=o.a.createContext({}),p=function(e){var t=o.a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},u=function(e){var t=p(e.components);return o.a.createElement(s.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return o.a.createElement(o.a.Fragment,{},t)}},d=o.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,a=e.originalType,c=e.parentName,s=i(e,["components","mdxType","originalType","parentName"]),u=p(n),d=r,b=u["".concat(c,".").concat(d)]||u[d]||m[d]||a;return n?o.a.createElement(b,l(l({ref:t},s),{},{components:n})):o.a.createElement(b,l({ref:t},s))}));function b(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var a=n.length,c=new Array(a);c[0]=d;var l={};for(var i in t)hasOwnProperty.call(t,i)&&(l[i]=t[i]);l.originalType=e,l.mdxType="string"==typeof e?e:r,c[1]=l;for(var s=2;s<a;s++)c[s]=n[s];return o.a.createElement.apply(null,c)}return o.a.createElement.apply(null,n)}d.displayName="MDXCreateElement"}}]);