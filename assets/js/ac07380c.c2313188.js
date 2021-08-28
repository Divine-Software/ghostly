"use strict";(self.webpackChunk_divine_ghostly_website=self.webpackChunk_divine_ghostly_website||[]).push([[4434],{9613:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return d}});var r=n(9496);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var c=r.createContext({}),s=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},u=function(e){var t=s(e.components);return r.createElement(c.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,a=e.originalType,c=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),m=s(n),d=o,f=m["".concat(c,".").concat(d)]||m[d]||p[d]||a;return n?r.createElement(f,l(l({ref:t},u),{},{components:n})):r.createElement(f,l({ref:t},u))}));function d(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=n.length,l=new Array(a);l[0]=m;var i={};for(var c in t)hasOwnProperty.call(t,c)&&(i[c]=t[c]);i.originalType=e,i.mdxType="string"==typeof e?e:o,l[1]=i;for(var s=2;s<a;s++)l[s]=n[s];return r.createElement.apply(null,l)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},8696:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return i},contentTitle:function(){return c},metadata:function(){return s},toc:function(){return u},default:function(){return m}});var r=n(7316),o=n(5943),a=(n(9496),n(9613)),l=["components"],i={title:"Docker Image"},c=void 0,s={unversionedId:"installation/docker",id:"installation/docker",isDocsHomePage:!1,title:"Docker Image",description:"To run the Ghostly WS API server, just forward port 80 and run the Docker image without arguments:",source:"@site/docs/installation/docker.md",sourceDirName:"installation",slug:"/installation/docker",permalink:"/ghostly/docs/installation/docker",editUrl:"https://github.com/Divine-Software/ghostly/edit/master/website/docs/installation/docker.md",tags:[],version:"current",frontMatter:{title:"Docker Image"},sidebar:"someSidebar",previous:{title:"Command Line Interface",permalink:"/ghostly/docs/installation/cli"},next:{title:"Node.js module",permalink:"/ghostly/docs/installation/node"}},u=[],p={toc:u};function m(e){var t=e.components,n=(0,o.Z)(e,l);return(0,a.kt)("wrapper",(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"To run the Ghostly WS API server, just forward port 80 and run the Docker image without arguments:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"docker run -p 8888:80 divinesoftware/ghostly\n")),(0,a.kt)("p",null,"The server is then ready to accept requests on ",(0,a.kt)("a",{parentName:"p",href:"http://localhost:8888/"},"http://localhost:8888/"),"."),(0,a.kt)("p",null,"You may also replace the default options to ",(0,a.kt)("inlineCode",{parentName:"p"},"ghostly-cli"),". For instance, the following command is exactly equivalent to the previous example:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"docker run -p 8888:80 divinesoftware/ghostly --debug --page-cache=10 --user=pwuser --http=:80\n")),(0,a.kt)("p",null,"This means that you can also execute ",(0,a.kt)("inlineCode",{parentName:"p"},"ghostly-cli")," in command-line mode. Just remember that the local filesystem and\n",(0,a.kt)("inlineCode",{parentName:"p"},"localhost")," refers to the local Docker instance's resources, not the host's."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},'echo \'[ null, "one", 2, { "three": [ false, true ] } ]\' > model.json\n\ndocker run -i divinesoftware/ghostly \\\n    --template https://divine-software.github.io/ghostly/examples/ghostly-plainjs-template.html \\\n    --format application/pdf \\\n    - < model.json > model.pdf\n')),(0,a.kt)("p",null,"See ",(0,a.kt)("a",{parentName:"p",href:"./cli"},"Command Line Interface")," for more information."))}m.isMDXComponent=!0}}]);