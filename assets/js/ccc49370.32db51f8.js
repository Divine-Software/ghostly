"use strict";(self.webpackChunk_divine_ghostly_website=self.webpackChunk_divine_ghostly_website||[]).push([[6103],{222:function(e,t,a){a.d(t,{Z:function(){return E}});var n=a(5903),l=a(9496),r=a(1626),i=a(1592),s=a(9698),m="sidebar_2Fkx",o="sidebarItemTitle_2qov",c="sidebarItemList_tSNJ",d="sidebarItem_1weF",g="sidebarItemLink_2N-I",u="sidebarItemLinkActive_20gM",p=a(1254);function v(e){var t=e.sidebar;return 0===t.items.length?null:l.createElement("nav",{className:(0,r.Z)(m,"thin-scrollbar"),"aria-label":(0,p.I)({id:"theme.blog.sidebar.navAriaLabel",message:"Blog recent posts navigation",description:"The ARIA label for recent posts in the blog sidebar"})},l.createElement("div",{className:(0,r.Z)(o,"margin-bottom--md")},t.title),l.createElement("ul",{className:c},t.items.map((function(e){return l.createElement("li",{key:e.permalink,className:d},l.createElement(s.Z,{isNavLink:!0,to:e.permalink,className:g,activeClassName:u},e.title))}))))}var h=["sidebar","toc","children"];var E=function(e){var t=e.sidebar,a=e.toc,s=e.children,m=(0,n.Z)(e,h),o=t&&t.items.length>0;return l.createElement(i.Z,m,l.createElement("div",{className:"container margin-vert--lg"},l.createElement("div",{className:"row"},o&&l.createElement("aside",{className:"col col--3"},l.createElement(v,{sidebar:t})),l.createElement("main",{className:(0,r.Z)("col",{"col--7":o,"col--9 col--offset-1":!o}),itemScope:!0,itemType:"http://schema.org/Blog"},s),a&&l.createElement("div",{className:"col col--2"},a))))}},6025:function(e,t,a){a.d(t,{Z:function(){return f}});var n=a(9496),l=a(1626),r=a(9613),i=a(1254),s=a(9698),m=a(2720),o=a(1635),c=a(3808),d=a(6126),g="blogPostTitle_11x3",u="blogPostData_ryUi",p="blogPostDetailsFull__oe4",v=a(2123),h="image_1Z-F";var E=function(e){var t=e.author,a=t.name,l=t.title,r=t.url,i=t.imageURL;return n.createElement("div",{className:"avatar margin-bottom--sm"},i&&n.createElement(s.Z,{className:"avatar__photo-link avatar__photo",href:r},n.createElement("img",{className:h,src:i,alt:a})),a&&n.createElement("div",{className:"avatar__intro",itemProp:"author",itemScope:!0,itemType:"https://schema.org/Person"},n.createElement("div",{className:"avatar__name"},n.createElement(s.Z,{href:r,itemProp:"url"},n.createElement("span",{itemProp:"name"},a))),l&&n.createElement("small",{className:"avatar__subtitle",itemProp:"description"},l)))},b="authorCol_RyU5";function _(e){var t=e.authors,a=e.assets;return 0===t.length?n.createElement(n.Fragment,null):n.createElement("div",{className:"row margin-top--md margin-bottom--sm"},t.map((function(e,t){var r;return n.createElement("div",{className:(0,l.Z)("col col--6",b),key:t},n.createElement(E,{author:Object.assign({},e,{imageURL:null!=(r=a.authorsImageUrls[t])?r:e.imageURL})}))})))}var f=function(e){var t,a,h,E,b=(h=(0,o.c2)().selectMessage,function(e){var t=Math.ceil(e);return h(t,(0,i.I)({id:"theme.blog.post.readingTime.plurals",description:'Pluralized label for "{readingTime} min read". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',message:"One min read|{readingTime} min read"},{readingTime:t}))}),f=(0,m.C)().withBaseUrl,N=e.children,Z=e.frontMatter,k=e.assets,P=e.metadata,C=e.truncated,L=e.isBlogPostPage,w=void 0!==L&&L,y=P.date,T=P.formattedDate,x=P.permalink,I=P.tags,A=P.readingTime,H=P.title,M=P.editUrl,U=P.authors,B=null!=(t=k.image)?t:Z.image,R=!w&&C,F=I.length>0;return n.createElement("article",{className:w?void 0:"margin-bottom--xl",itemProp:"blogPost",itemScope:!0,itemType:"http://schema.org/BlogPosting"},(E=w?"h1":"h2",n.createElement("header",null,n.createElement(E,{className:g,itemProp:"headline"},w?H:n.createElement(s.Z,{itemProp:"url",to:x},H)),n.createElement("div",{className:(0,l.Z)(u,"margin-vert--md")},n.createElement("time",{dateTime:y,itemProp:"datePublished"},T),void 0!==A&&n.createElement(n.Fragment,null," \xb7 ",b(A))),n.createElement(_,{authors:U,assets:k}))),B&&n.createElement("meta",{itemProp:"image",content:f(B,{absolute:!0})}),n.createElement("div",{className:"markdown",itemProp:"articleBody"},n.createElement(r.Zo,{components:c.Z},N)),(F||C)&&n.createElement("footer",{className:(0,l.Z)("row docusaurus-mt-lg",(a={},a[p]=w,a))},F&&n.createElement("div",{className:(0,l.Z)("col",{"col--9":R})},n.createElement(v.Z,{tags:I})),w&&M&&n.createElement("div",{className:"col margin-top--sm"},n.createElement(d.Z,{editUrl:M})),R&&n.createElement("div",{className:(0,l.Z)("col text--right",{"col--3":F})},n.createElement(s.Z,{to:P.permalink,"aria-label":"Read more about "+H},n.createElement("b",null,n.createElement(i.Z,{id:"theme.blog.post.readMore",description:"The label used in blog post item excerpts to link to full blog posts"},"Read More"))))))}},3799:function(e,t,a){a.r(t),a.d(t,{default:function(){return g}});var n=a(9496),l=a(6038),r=a(222),i=a(6025),s=a(1254),m=a(9698);var o=function(e){var t=e.nextItem,a=e.prevItem;return n.createElement("nav",{className:"pagination-nav docusaurus-mt-lg","aria-label":(0,s.I)({id:"theme.blog.post.paginator.navAriaLabel",message:"Blog post page navigation",description:"The ARIA label for the blog posts pagination"})},n.createElement("div",{className:"pagination-nav__item"},a&&n.createElement(m.Z,{className:"pagination-nav__link",to:a.permalink},n.createElement("div",{className:"pagination-nav__sublabel"},n.createElement(s.Z,{id:"theme.blog.post.paginator.newerPost",description:"The blog post button label to navigate to the newer/previous post"},"Newer Post")),n.createElement("div",{className:"pagination-nav__label"},"\xab ",a.title))),n.createElement("div",{className:"pagination-nav__item pagination-nav__item--next"},t&&n.createElement(m.Z,{className:"pagination-nav__link",to:t.permalink},n.createElement("div",{className:"pagination-nav__sublabel"},n.createElement(s.Z,{id:"theme.blog.post.paginator.olderPost",description:"The blog post button label to navigate to the older/next post"},"Older Post")),n.createElement("div",{className:"pagination-nav__label"},t.title," \xbb"))))},c=a(1635),d=a(6891);var g=function(e){var t,a=e.content,s=e.sidebar,m=a.frontMatter,g=a.assets,u=a.metadata,p=u.title,v=u.description,h=u.nextItem,E=u.prevItem,b=u.date,_=u.tags,f=u.authors,N=m.hide_table_of_contents,Z=m.keywords,k=m.toc_min_heading_level,P=m.toc_max_heading_level,C=null!=(t=g.image)?t:m.image;return n.createElement(r.Z,{wrapperClassName:c.kM.wrapper.blogPages,pageClassName:c.kM.page.blogPostPage,sidebar:s,toc:!N&&a.toc&&a.toc.length>0?n.createElement(d.Z,{toc:a.toc,minHeadingLevel:k,maxHeadingLevel:P}):void 0},n.createElement(l.Z,{title:p,description:v,keywords:Z,image:C},n.createElement("meta",{property:"og:type",content:"article"}),n.createElement("meta",{property:"article:published_time",content:b}),f.some((function(e){return e.url}))&&n.createElement("meta",{property:"article:author",content:f.map((function(e){return e.url})).filter(Boolean).join(",")}),_.length>0&&n.createElement("meta",{property:"article:tag",content:_.map((function(e){return e.label})).join(",")})),n.createElement(i.Z,{frontMatter:m,assets:g,metadata:u,isBlogPostPage:!0},n.createElement(a,null)),(h||E)&&n.createElement(o,{nextItem:h,prevItem:E}))}},6126:function(e,t,a){a.d(t,{Z:function(){return g}});var n=a(9496),l=a(1254),r=a(2245),i=a(5903),s=a(1626),m="iconEdit_3cd2",o=["className"],c=function(e){var t=e.className,a=(0,i.Z)(e,o);return n.createElement("svg",(0,r.Z)({fill:"currentColor",height:"20",width:"20",viewBox:"0 0 40 40",className:(0,s.Z)(m,t),"aria-hidden":"true"},a),n.createElement("g",null,n.createElement("path",{d:"m34.5 11.7l-3 3.1-6.3-6.3 3.1-3q0.5-0.5 1.2-0.5t1.1 0.5l3.9 3.9q0.5 0.4 0.5 1.1t-0.5 1.2z m-29.5 17.1l18.4-18.5 6.3 6.3-18.4 18.4h-6.3v-6.2z"})))},d=a(1635);function g(e){var t=e.editUrl;return n.createElement("a",{href:t,target:"_blank",rel:"noreferrer noopener",className:d.kM.common.editThisPage},n.createElement(c,null),n.createElement(l.Z,{id:"theme.common.editThisPage",description:"The link label to edit the current page"},"Edit this page"))}},6891:function(e,t,a){a.d(t,{Z:function(){return c}});var n=a(2245),l=a(5903),r=a(9496),i=a(1626),s=a(7562),m="tableOfContents_1AQL",o=["className"];var c=function(e){var t=e.className,a=(0,l.Z)(e,o);return r.createElement("div",{className:(0,i.Z)(m,"thin-scrollbar",t)},r.createElement(s.Z,(0,n.Z)({},a,{linkClassName:"table-of-contents__link toc-highlight",linkActiveClassName:"table-of-contents__link--active"})))}},7562:function(e,t,a){a.d(t,{Z:function(){return o}});var n=a(2245),l=a(5903),r=a(9496),i=a(1635),s=["toc","className","linkClassName","linkActiveClassName","minHeadingLevel","maxHeadingLevel"];function m(e){var t=e.toc,a=e.className,n=e.linkClassName,l=e.isChild;return t.length?r.createElement("ul",{className:l?void 0:a},t.map((function(e){return r.createElement("li",{key:e.id},r.createElement("a",{href:"#"+e.id,className:null!=n?n:void 0,dangerouslySetInnerHTML:{__html:e.value}}),r.createElement(m,{isChild:!0,toc:e.children,className:a,linkClassName:n}))}))):null}function o(e){var t=e.toc,a=e.className,o=void 0===a?"table-of-contents table-of-contents__left-border":a,c=e.linkClassName,d=void 0===c?"table-of-contents__link":c,g=e.linkActiveClassName,u=void 0===g?void 0:g,p=e.minHeadingLevel,v=e.maxHeadingLevel,h=(0,l.Z)(e,s),E=(0,i.LU)(),b=null!=p?p:E.tableOfContents.minHeadingLevel,_=null!=v?v:E.tableOfContents.maxHeadingLevel,f=(0,i.DA)({toc:t,minHeadingLevel:b,maxHeadingLevel:_}),N=(0,r.useMemo)((function(){if(d&&u)return{linkClassName:d,linkActiveClassName:u,minHeadingLevel:b,maxHeadingLevel:_}}),[d,u,b,_]);return(0,i.Si)(N),r.createElement(m,(0,n.Z)({toc:f,className:o,linkClassName:d},h))}},2123:function(e,t,a){a.d(t,{Z:function(){return u}});var n=a(9496),l=a(1626),r=a(1254),i=a(9698),s="tag_1XCG",m="tagRegular_1ppp",o="tagWithCount_wKh8";var c=function(e){var t,a=e.permalink,r=e.name,c=e.count;return n.createElement(i.Z,{href:a,className:(0,l.Z)(s,(t={},t[m]=!c,t[o]=c,t))},r,c&&n.createElement("span",null,c))},d="tags_3a77",g="tag_3dxg";function u(e){var t=e.tags;return n.createElement(n.Fragment,null,n.createElement("b",null,n.createElement(r.Z,{id:"theme.tags.tagsListLabel",description:"The label alongside a tag list"},"Tags:")),n.createElement("ul",{className:(0,l.Z)(d,"padding--none","margin-left--sm")},t.map((function(e){var t=e.label,a=e.permalink;return n.createElement("li",{key:a,className:g},n.createElement(c,{name:t,permalink:a}))}))))}}}]);