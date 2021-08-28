---
title: Introduction
slug: /
sidebar_label: About
sidebar_position: 0
---

*Ghostly* is a template engine/print formatter that can be used to render HTML or PDF documents, images and other kinds
of documents from a data model or parameter set.

The templates are just a web page with a very simple API that should be implemented, which means that any normal
front-end technology can be used for the actual rendering. This also makes the templates incredibly powerful, much more
so than traditional template languages or XSLT stylesheets.

The *Ghostly Engine* is available as a [Node.js module](https://www.npmjs.com/package/@divine/ghostly-engine) with a
really simple API that you can embed in your own project. There is also a [command line
tool](https://www.npmjs.com/package/@divine/ghostly-cli) that can either render documents from the command line or start
a web service that accepts HTTP requests, enabling use from any language or environment. This tool is also available as
a ready-made [Docker image](https://hub.docker.com/r/divinesoftware/ghostly).

The *Ghostly Runtime* is a small [client-side library](https://www.npmjs.com/package/@divine/ghostly-runtime) that
defines the protocol required to drive the template.

Ghostly version 1 has been used in production for several years. Version 2 is a major rewrite which uses a modern
[headless browser engine](https://playwright.dev/) and adds support for generating arbitrary attachments as part of the
rendering operation.
