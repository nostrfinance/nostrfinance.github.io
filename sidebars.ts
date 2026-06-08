import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  mainSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'getting-started/introduction',
        'getting-started/nostr-bitcoin',
        'getting-started/quick-start',
        'getting-started/core-concepts',
      ],
    },
    {
      type: 'category',
      label: 'Payments',
      collapsed: false,
      items: [
        'payments/overview',
        'payments/zaps',
        'payments/onchain-zaps',
        'payments/lightning-network',
        'payments/onchain',
        'payments/p2p-trading',
        'payments/subscriptions',
        'payments/crowdfunding',
      ],
    },
    {
      type: 'category',
      label: 'Wallets',
      collapsed: true,
      items: [
        'wallets/overview',
        'wallets/nwc',
        'wallets/taproot',
        'wallets/alby',
        'wallets/ndk-wallet',
      ],
    },
    {
      type: 'category',
      label: 'Marketplaces',
      collapsed: true,
      items: [
        'marketplaces/overview',
        'marketplaces/nip-15',
        'marketplaces/nip-99',
        'marketplaces/implementations',
      ],
    },
    {
      type: 'category',
      label: 'Assets & Tokens',
      collapsed: true,
      items: [
        'assets/overview',
        'assets/nostr-assets',
        'assets/taproot-assets',
        'assets/rgb-protocol',
      ],
    },
    {
      type: 'category',
      label: 'Identity & DIDs',
      collapsed: true,
      items: [
        'identity/did-nostr',
        'identity/verification',
        'identity/keys',
      ],
    },
    {
      type: 'category',
      label: 'Cryptography',
      collapsed: true,
      items: [
        'cryptography/overview',
        'cryptography/x-only-pubkeys',
        'cryptography/schnorr-security',
        'cryptography/tweaks',
        'cryptography/mnemonics',
        'cryptography/silent-payments',
      ],
    },
    {
      type: 'category',
      label: 'Standards & Specs',
      collapsed: true,
      items: [
        'standards/webledgers',
        'standards/blocktrails',
      ],
    },
    {
      type: 'category',
      label: 'Finance NIPs',
      collapsed: true,
      items: [
        'nips/overview',
        'nips/nip-47',
        'nips/nip-57',
        'nips/nip-69',
        'nips/nip-75',
      ],
    },
    {
      type: 'category',
      label: 'Infrastructure',
      collapsed: true,
      items: [
        'infrastructure/relays',
        'infrastructure/economics',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      collapsed: true,
      items: [
        'reference/glossary',
        'reference/resources',
        'reference/faq',
      ],
    },
  ],
};

export default sidebars;
