"use strict";(self.webpackChunk_divine_ghostly_website=self.webpackChunk_divine_ghostly_website||[]).push([[9924],{4333:function(e){e.exports=JSON.parse('{"blogPosts":[{"id":"Version 2.4 released","metadata":{"permalink":"/ghostly/blog/2021/11/03/version-2.4","editUrl":"https://github.com/Divine-Software/ghostly/edit/master/website/blog/blog/2021-11-03-version-2.4.md","source":"@site/blog/2021-11-03-version-2.4.md","title":"Version 2.4 released","description":"Today, we\'re celebrating h\xf6stlov with a small new Ghostly release!","date":"2021-11-03T00:00:00.000Z","formattedDate":"November 3, 2021","tags":[],"readingTime":0.36,"truncated":false,"authors":[{"name":"Martin Blom","title":"Project Maintainer","url":"https://github.com/LeviticusMB","imageURL":"https://avatars.githubusercontent.com/u/1094822?s=460&v=4"}],"nextItem":{"title":"Version 2.3 released","permalink":"/ghostly/blog/2021/08/27/version-2.3"}},"content":"Today, we\'re celebrating *h\xf6stlov* with a small new Ghostly release!\\n\\nThis is just a maintenance release that bumps Ghostly\'s dependencies. In particular, Playwright has been upgraded from\\n1.12 to 1.16, which allows it to run correctly on *macOS 12*.\\n\\nPlaywright 1.13 and later had a problem with `file:` URLs, which is why we have stuck with 1.12 for a while now. But\\nthat problem has finally been addressed in this Ghostly release."},{"id":"Version 2.3 released","metadata":{"permalink":"/ghostly/blog/2021/08/27/version-2.3","editUrl":"https://github.com/Divine-Software/ghostly/edit/master/website/blog/blog/2021-08-27-version-2.3.md","source":"@site/blog/2021-08-27-version-2.3.md","title":"Version 2.3 released","description":"Another month, another minor Ghostly release; Version 2.3 is now available!","date":"2021-08-27T00:00:00.000Z","formattedDate":"August 27, 2021","tags":[],"readingTime":0.445,"truncated":false,"authors":[{"name":"Martin Blom","title":"Project Maintainer","url":"https://github.com/LeviticusMB","imageURL":"https://avatars.githubusercontent.com/u/1094822?s=460&v=4"}],"prevItem":{"title":"Version 2.4 released","permalink":"/ghostly/blog/2021/11/03/version-2.4"},"nextItem":{"title":"Version 2.2 released","permalink":"/ghostly/blog/2021/06/14/version-2.2"}},"content":"Another month, another minor Ghostly release; Version 2.3 is now available!\\n\\nNew in this release is that\\n\\n* Events are now delivered in real-time, instead of all at once when the rendering has completed; and that\\n* Some configuration options, notably [logger] & [timeout], may now be changed [per-template]. This is awesome if, for\\n  instance, you have a [per-request logger] in your web-service, because now all Ghostly logs originating from this\\n  request can be tagged with a unique reqest ID.\\n\\n[logger]:              /ghostly/docs/api/interfaces/ghostly_engine.TemplateConfig#logger\\n[timeout]:             /ghostly/docs/api/interfaces/ghostly_engine.TemplateConfig#timeout\\n[per-template]:        /ghostly/docs/api/classes/ghostly_engine.Engine#template\\n[per-request logger]:  https://divine-software.github.io/esxx-2/web-service/classes/webrequest.html#log"},{"id":"Version 2.2 released","metadata":{"permalink":"/ghostly/blog/2021/06/14/version-2.2","editUrl":"https://github.com/Divine-Software/ghostly/edit/master/website/blog/blog/2021-06-14-version-2.2.md","source":"@site/blog/2021-06-14-version-2.2.md","title":"Version 2.2 released","description":"Version 2.2 is out and adds the ability to specify [locale] and [time zone] the template will use (both as defaults and","date":"2021-06-14T00:00:00.000Z","formattedDate":"June 14, 2021","tags":[],"readingTime":0.15,"truncated":false,"authors":[{"name":"Martin Blom","title":"Project Maintainer","url":"https://github.com/LeviticusMB","imageURL":"https://avatars.githubusercontent.com/u/1094822?s=460&v=4"}],"prevItem":{"title":"Version 2.3 released","permalink":"/ghostly/blog/2021/08/27/version-2.3"},"nextItem":{"title":"Version 2.1 released","permalink":"/ghostly/blog/2021/04/22/version-2.1"}},"content":"Version 2.2 is out and adds the ability to specify [locale] and [time zone] the template will use (both as defaults and\\n[per-request]).\\n\\n[locale]:      /ghostly/docs/api/interfaces/ghostly_engine.EngineConfig#locale\\n[time zone]:   /ghostly/docs/api/interfaces/ghostly_engine.EngineConfig#timezone\\n[per-request]: /ghostly/docs/api/interfaces/ghostly_engine.TemplateEngine#renderrequest"},{"id":"Version 2.1 released","metadata":{"permalink":"/ghostly/blog/2021/04/22/version-2.1","editUrl":"https://github.com/Divine-Software/ghostly/edit/master/website/blog/blog/2021-04-22-version-2.1.md","source":"@site/blog/2021-04-22-version-2.1.md","title":"Version 2.1 released","description":"Today, I\'m glad to let you know that Ghostly version 2.1 has been released.","date":"2021-04-22T00:00:00.000Z","formattedDate":"April 22, 2021","tags":[],"readingTime":0.62,"truncated":false,"authors":[{"name":"Martin Blom","title":"Project Maintainer","url":"https://github.com/LeviticusMB","imageURL":"https://avatars.githubusercontent.com/u/1094822?s=460&v=4"}],"prevItem":{"title":"Version 2.2 released","permalink":"/ghostly/blog/2021/06/14/version-2.2"},"nextItem":{"title":"Welcome","permalink":"/ghostly/blog/2021/03/15/welcome"}},"content":"Today, I\'m glad to let you know that Ghostly version 2.1 has been released.\\n\\nBesides some internal chores\u2014like switching from [Yarn] to [pnpm]\u2014this version adds an `inline` transform to the\\n[html-transforms] pipeline (which is now implemented as a [rehype] pipeline). The inliner is capable of inlining CSS,\\nJavaScript and any kind of URL by converting the linked resource to a `data:` URL. Any inlined resource will be\\nprocessed by the pipeline before it\'s included into the main document.\\n\\nAdditonally, the default `sanitizer` transform (using [DOMPurify]), while still available, has been replaced with a much\\nless intrusive `noscript` transform by default, and `minimize` is now based on [rehype-minify] instead of\\n[html-minifier].\\n\\n[Yarn]:             https://classic.yarnpkg.com\\n[pnpm]:             https://pnpm.io/\\n[html-transforms]:  /ghostly/docs/api/interfaces/ghostly_engine.View#htmltransforms\\n[rehype]:           https://github.com/rehypejs/rehype\\n[DOMPurify]:        https://github.com/cure53/DOMPurify\\n[rehype-minify]:    https://github.com/rehypejs/rehype-minify\\n[html-minifier]:    https://github.com/kangax/html-minifier"},{"id":"Welcome","metadata":{"permalink":"/ghostly/blog/2021/03/15/welcome","editUrl":"https://github.com/Divine-Software/ghostly/edit/master/website/blog/blog/2021-03-15-welcome.md","source":"@site/blog/2021-03-15-welcome.md","title":"Welcome","description":"I\'m happy to announce that Ghostly v2 is now released! Version 2.0 is an substantial upgrade over last release.","date":"2021-03-15T00:00:00.000Z","formattedDate":"March 15, 2021","tags":[],"readingTime":0.645,"truncated":false,"authors":[{"name":"Martin Blom","title":"Project Maintainer","url":"https://github.com/LeviticusMB","imageURL":"https://avatars.githubusercontent.com/u/1094822?s=460&v=4"}],"prevItem":{"title":"Version 2.1 released","permalink":"/ghostly/blog/2021/04/22/version-2.1"}},"content":"I\'m happy to announce that Ghostly v2 is now released! Version 2.0 is an ***substantial*** upgrade over last release.\\n\\nBoth the [engine] and [runtime] modules (now part of the *Divine* family of open source software) ships with full\\n*TypeScript* definitions, and Ghostly is now powered by a modern browser (*Chromium* by default, but you can opt in to\\nuse *Firefox* or *WebKit* instead), thanks to [Playwright].\\n\\nThe third major improvement comes in the form of *attachments* support. A template may now announce that it can produce\\nany number of secondary results as part of the model initialization. For instance, a sales report template could attach\\nthe sales data as a CSV attachment, ready to be imported into a spreadsheet application for further analysis.\\n\\n[engine]:     https://www.npmjs.com/package/@divine/ghostly-engine\\n[runtime]:    https://www.npmjs.com/package/@divine/ghostly-runtime\\n[Playwright]: https://playwright.dev/"}]}')}}]);