---
sidebar_position: 1
title: Introduction to Nostr Finance
description: Learn about the intersection of Nostr protocol and Bitcoin-based finance
---

# Introduction to Nostr Finance

Welcome to the comprehensive guide for finance on the Nostr protocol. This documentation covers everything you need to know about payments, wallets, marketplaces, and financial applications built on Nostr.

## What is Nostr?

**Nostr** (Notes and Other Stuff Transmitted by Relays) is an open protocol for decentralized, censorship-resistant communication. It uses public-key cryptography to enable secure, verifiable interactions without relying on centralized platforms.

Key characteristics:
- **Decentralized** - No central server or authority
- **Censorship-resistant** - Messages are distributed across multiple relays
- **Identity-based** - Users are identified by cryptographic keypairs
- **Extensible** - New features added through NIPs (Nostr Implementation Possibilities)

## Why Finance on Nostr?

Nostr and Bitcoin share fundamental principles that make them natural partners:

| Feature | Nostr | Bitcoin |
|---------|-------|---------|
| Decentralization | Relay network | Node network |
| Identity | Public keys (npub) | Public keys (addresses) |
| Cryptography | secp256k1 | secp256k1 |
| Censorship Resistance | Multiple relays | Multiple nodes |

### The Same Cryptography

Both Nostr and Bitcoin use the **secp256k1** elliptic curve for cryptographic operations. This means:
- A Nostr keypair can also control Bitcoin
- Identity and money can be unified
- Cross-protocol verification is possible

## Core Financial Capabilities

### 1. Lightning Network Payments (Zaps)

Send instant Bitcoin micropayments directly to Nostr events or users. Zaps enable:
- Tipping content creators
- Rewarding valuable posts
- Monetizing content without ads
- Value-for-value interactions

### 2. Wallet Connectivity (NWC)

Nostr Wallet Connect (NWC) provides a standardized way to connect Lightning wallets to any application:
- One-click wallet connections
- Budgets and spending limits
- Cross-platform compatibility

### 3. eCash Integration (Cashu)

Privacy-preserving digital cash built on Bitcoin:
- Instant transfers
- Enhanced privacy
- Low-cost micropayments
- NutZaps for private tipping

### 4. Decentralized Marketplaces

Buy and sell goods and services with Bitcoin:
- NIP-15 structured marketplaces
- NIP-99 classified listings
- Direct peer-to-peer commerce

### 5. Asset Tokenization

Issue and trade digital assets on Bitcoin via Nostr:
- Taproot Assets integration
- RGB protocol support
- Stablecoins and tokens

## Getting Started

Ready to dive in? Here's your learning path:

1. **[Nostr & Bitcoin Relationship](/getting-started/nostr-bitcoin)** - Understand how Nostr and Bitcoin work together
2. **[Quick Start Guide](/getting-started/quick-start)** - Set up your first Nostr wallet
3. **[Core Concepts](/getting-started/core-concepts)** - Master the fundamental ideas

## Key Standards Covered

This documentation covers several important specifications:

| Standard | Purpose |
|----------|---------|
| [NIP-47](/nips/nip-47) | Nostr Wallet Connect |
| [NIP-57](/nips/nip-57) | Lightning Zaps |
| [NIP-60](/nips/nip-60) | Cashu Wallets |
| [NIP-61](/nips/nip-61) | NutZaps |
| [NIP-75](/nips/nip-75) | Zap Goals (Crowdfunding) |
| [Web Ledgers](/standards/webledgers) | Universal balance mapping |
| [Blocktrails](/standards/blocktrails) | Bitcoin state anchoring |
| [DID:Nostr](/identity/did-nostr) | Decentralized identifiers |

## Community & Resources

- **[Nostr Protocol](https://nostr.com)** - Official Nostr resources
- **[NWC Documentation](https://nwc.dev)** - Nostr Wallet Connect docs
- **[OpenSats](https://opensats.org)** - Funding for Nostr development
- **[GitHub](https://github.com/nostrfinance)** - Contribute to this documentation

---

:::tip Value for Value
Nostr finance operates on the "value for value" principle - consume content freely, pay what you think it's worth. This model eliminates advertising and aligns creator and consumer incentives.
:::
