module.exports =  {
  title: 'Ghostly',
  tagline: 'A divine template/print formatter engine',
  url: 'https://divine-software.github.io/',
  baseUrl: '/ghostly/',
  favicon: 'img/favicon.ico',
  organizationName: 'Divine-Software',
  projectName: 'ghostly',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Ghostly',
      logo: {
        alt: 'Ghostly Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'blog/',
          label: 'News',
          position: 'left'
        },
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Documentation',
          position: 'left',
        },
        {
          to: 'preview',
          label: 'Template Preview Tool',
          position: 'left',
        },
        {
          href: 'https://github.com/Divine-Software/ghostly',
          label: 'Fork me on GitHub!',
          position: 'right',
        },
      ],
      hideOnScroll: false,
    },
    hideableSidebar: true,
    footer: {
      style: 'dark',
      links: [
        {
          title: 'More Divine Software™',
          items: [
            {
              label: 'Synchronization Library',
              to: 'https://github.com/Divine-Software/divine-synchronization',
            },
            {
              label: 'Syslog Console',
              href: 'https://github.com/Divine-Software/sysconsole',
            },
            {
              label: 'Web Service Framework',
              href: 'https://divine-software.github.io/esxx-2/',
            },
          ],
        },
        {
          title: 'Projects we ❤️',
          items: [
            {
              label: 'Docusaurus',
              href: 'https://v2.docusaurus.io/',
            },
            {
              label: 'Playwright',
              href: 'https://playwright.dev/',
            },
            {
              label: 'TypeDoc',
              href: 'https://typedoc.org/',
            }
          ],
        },
        {
          title: 'Templating',
          items: [
            {
              label: 'Angular',
              href: 'https://angular.io//',
            },
            {
              label: 'lit-html',
              href: 'https://lit-html.polymer-project.org/',
            },
            {
              label: 'Stencil',
              href: 'https://stenciljs.com/',
            },
          ]
        },
        {
          title: 'Get in touch',
          items: [
            {
              label: 'Ask a question',
              href: 'https://github.com/Divine-Software/ghostly/discussions'
            },
            {
              label: 'Contribute code or docs',
              href: 'https://github.com/Divine-Software/ghostly/pulls'
            },
            {
              label: 'Report an issue',
              href: 'https://github.com/Divine-Software/ghostly/issues'
            },
          ]
        }
    ],
    copyright: `Copyright © 2016-${new Date().getFullYear()} Martin Blom. A Divine Software™ production.`,
    },
  },
  plugins: [
    [
      'docusaurus-plugin-typedoc',

      {
        entryPoints: [
          '../ghostly-engine/index.ts',
          '../ghostly-runtime/index.ts',
        ],
        excludePrivate: true,
        excludeInternal: true,
        tsconfig: '../tsconfig.json',
        watch: process.env.TYPEDOC_WATCH === 'true',
      },
    ],
  ],
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/Divine-Software/ghostly/edit/master/website/',
        },
        blog: {
          showReadingTime: true,
          editUrl:
            'https://github.com/Divine-Software/ghostly/edit/master/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
