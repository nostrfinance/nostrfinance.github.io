import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Nostr Finance',
  tagline: 'The Complete Guide to Finance on Nostr Protocol',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://nostrfinance.github.io',
  baseUrl: '/',

  organizationName: 'nostrfinance',
  projectName: 'nostrfinance.github.io',

  onBrokenLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

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
    image: 'img/nostr-finance-social-card.png',

    metadata: [
      {name: 'keywords', content: 'nostr, bitcoin, lightning, finance, zaps, wallet, payments, ecash, cashu'},
      {name: 'description', content: 'Comprehensive documentation for finance applications on the Nostr protocol - payments, wallets, marketplaces, and more.'},
      {property: 'og:type', content: 'website'},
    ],

    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },

    announcementBar: {
      id: 'contribute',
      content: 'Help improve Nostr Finance documentation! <a href="https://github.com/nostrfinance/nostrfinance.github.io">Contribute on GitHub</a>',
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
  } satisfies Preset.ThemeConfig,
};

export default config;
