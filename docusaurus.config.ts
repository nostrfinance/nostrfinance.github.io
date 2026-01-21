import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Nostr Finance',
  tagline: 'Bitcoin Payments, Taproot Native',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  url: 'https://nostrfinance.com',
  baseUrl: '/',

  organizationName: 'nostrfinance',
  projectName: 'nostrfinance.github.io',

  onBrokenLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  headTags: [
    {
      tagName: 'meta',
      attributes: {
        property: 'og:title',
        content: 'Nostr Finance - Bitcoin Payments, Taproot Native',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:description',
        content: 'The complete guide to Bitcoin, Lightning, and Taproot payments on Nostr. Your keys control your money.',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:image',
        content: 'https://nostrfinance.com/img/og-image.png',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:url',
        content: 'https://nostrfinance.com',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:title',
        content: 'Nostr Finance - Bitcoin Payments, Taproot Native',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:description',
        content: 'The complete guide to Bitcoin, Lightning, and Taproot payments on Nostr.',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:image',
        content: 'https://nostrfinance.com/img/og-image.png',
      },
    },
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/nostrfinance/nostrfinance.github.io/tree/gh-pages/',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/og-image.png',

    metadata: [
      {name: 'keywords', content: 'nostr, bitcoin, lightning, taproot, p2tr, finance, zaps, wallet, payments, secp256k1'},
      {name: 'description', content: 'The complete guide to Bitcoin, Lightning, and Taproot payments on Nostr. Nostr is Taproot native - your keys control your money.'},
      {property: 'og:type', content: 'website'},
      {property: 'og:site_name', content: 'Nostr Finance'},
    ],

    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },

    announcementBar: {
      id: 'taproot-native',
      content: '⚡ Nostr is <strong>Taproot Native</strong> - Your Nostr keys are Bitcoin keys! <a href="/wallets/taproot">Learn more →</a>',
      backgroundColor: '#F7931A',
      textColor: '#fff',
      isCloseable: true,
    },

    navbar: {
      title: 'Nostr Finance',
      logo: {
        alt: 'Nostr Finance Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: '/getting-started/introduction',
          label: 'Getting Started',
          position: 'left',
        },
        {
          to: '/payments/overview',
          label: 'Payments',
          position: 'left',
        },
        {
          to: '/wallets/overview',
          label: 'Wallets',
          position: 'left',
        },
        {
          type: 'dropdown',
          label: 'Advanced',
          position: 'left',
          items: [
            {label: 'Marketplaces', to: '/marketplaces/overview'},
            {label: 'Assets & Tokens', to: '/assets/overview'},
            {label: 'Identity (DID)', to: '/identity/did-nostr'},
            {type: 'html', value: '<hr style="margin: 0.5rem 0;">'},
            {label: 'Web Ledgers', to: '/standards/webledgers'},
            {label: 'Blocktrails', to: '/standards/blocktrails'},
          ],
        },
        {
          to: '/nips/overview',
          label: 'NIPs',
          position: 'left',
        },
        {
          href: 'https://github.com/nostrfinance/nostrfinance.github.io',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },

    footer: {
      style: 'dark',
      links: [
        {
          title: 'Learn',
          items: [
            {label: 'Getting Started', to: '/getting-started/introduction'},
            {label: 'Payments', to: '/payments/overview'},
            {label: 'Wallets', to: '/wallets/overview'},
            {label: 'Taproot', to: '/wallets/taproot'},
          ],
        },
        {
          title: 'Standards',
          items: [
            {label: 'Finance NIPs', to: '/nips/overview'},
            {label: 'Web Ledgers', to: '/standards/webledgers'},
            {label: 'Blocktrails', to: '/standards/blocktrails'},
            {label: 'DID:Nostr', to: '/identity/did-nostr'},
          ],
        },
        {
          title: 'Community',
          items: [
            {label: 'GitHub', href: 'https://github.com/nostrfinance'},
            {label: 'Nostr Protocol', href: 'https://nostr.com'},
            {label: 'Bitcoin', href: 'https://bitcoin.org'},
          ],
        },
        {
          title: 'Resources',
          items: [
            {label: 'Nostr.com', href: 'https://nostr.com'},
            {label: 'NWC Docs', href: 'https://nwc.dev'},
            {label: 'OpenSats', href: 'https://opensats.org'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Nostr Finance. Built with Docusaurus.`,
    },

    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'typescript', 'javascript'],
    },

    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
    },

    mermaid: {
      theme: {light: 'neutral', dark: 'dark'},
      options: {
        fontFamily: 'system-ui, -apple-system, sans-serif',
        flowchart: {
          curve: 'basis',
        },
      },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
