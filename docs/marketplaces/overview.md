---
sidebar_position: 1
title: Marketplaces Overview
description: Decentralized e-commerce on Nostr
---

# Nostr Marketplaces

Nostr enables decentralized peer-to-peer commerce without centralized platforms. Using Bitcoin/Lightning for payments, merchants and buyers can trade directly while maintaining full control of their data and funds.

## Marketplace Standards

Two main NIPs define marketplace functionality:

| Standard | Purpose | Status |
|----------|---------|--------|
| [NIP-15](/marketplaces/nip-15) | Structured marketplaces | Merged |
| [NIP-99](/marketplaces/nip-99) | Classified listings | Merged |

### NIP-15 vs NIP-99

| Aspect | NIP-15 | NIP-99 |
|--------|--------|--------|
| Structure | Rigid product schema | Flexible listings |
| Use Case | E-commerce stores | Classifieds, services |
| Complexity | Higher | Lower |
| Checkout | Integrated flow | Direct messaging |

## How Nostr Commerce Works

### Basic Flow

```
1. Merchant publishes product/listing
2. Buyer discovers via search/feed
3. Buyer contacts merchant (DM)
4. Merchant creates Lightning invoice
5. Buyer pays invoice
6. Merchant fulfills order
```

### Architecture

```
┌─────────────────────────────────────────────────┐
│              Marketplace Client                  │
│         (Shopstr, LNbits Market, etc.)          │
├─────────────────────────────────────────────────┤
│    NIP-15 Products    │    NIP-99 Listings      │
│    ┌─────────────┐    │    ┌─────────────┐     │
│    │ Stall       │    │    │ Classified  │     │
│    │ Products    │    │    │ Listing     │     │
│    │ Orders      │    │    └─────────────┘     │
│    └─────────────┘    │                        │
├─────────────────────────────────────────────────┤
│              Nostr Relays                       │
├─────────────────────────────────────────────────┤
│              Lightning Network                   │
│            (Payment Settlement)                  │
└─────────────────────────────────────────────────┘
```

## Key Concepts

### Stalls (NIP-15)

A stall is a merchant's store:
- Contains products
- Has shipping info
- Defines payment methods

### Products

Items for sale:
- Title, description, images
- Price (in sats or fiat)
- Inventory/availability
- Categories and tags

### Orders

Purchase records:
- Buyer and seller keys
- Products purchased
- Shipping details
- Payment status

## Benefits

### For Merchants

| Benefit | Description |
|---------|-------------|
| **No platform fees** | Keep 100% of revenue |
| **No account required** | Use Nostr identity |
| **Global reach** | Anyone with Bitcoin |
| **Censorship resistant** | Can't be deplatformed |
| **Own your data** | Customer list is yours |

### For Buyers

| Benefit | Description |
|---------|-------------|
| **Privacy** | No account/tracking |
| **Bitcoin native** | Direct payments |
| **Global access** | Buy from anywhere |
| **Lower prices** | No platform overhead |
| **Direct communication** | Contact seller directly |

## Current Challenges

### Scalability

- Manual order processing
- No automated fulfillment
- Limited inventory management

### Trust

- No built-in escrow
- Reputation is social proof
- Dispute resolution is manual

### UX

- Still early/rough
- Lightning UX learning curve
- Mobile experience varies

## Marketplace Implementations

### Shopstr

Global, permissionless marketplace:
- NIP-15 and NIP-99 support
- Private messaging (NIP-17)
- Bitcoin Lightning payments
- [shopstr.store](https://shopstr.store)

### LNbits Nostr Market

Self-hosted marketplace:
- LNbits extension
- Customizable storefronts
- Merchant tools
- [GitHub](https://github.com/lnbits/nostrmarket)

### Plebeian Market

Community marketplace:
- Auction support
- Fiat pricing option
- Stall management

## Getting Started

### As a Buyer

1. Get a Nostr client
2. Set up Lightning wallet
3. Browse marketplace apps
4. Find products you want
5. Contact merchant, pay, receive

### As a Merchant

1. Choose marketplace client
2. Set up stall (NIP-15)
3. Add products
4. Configure Lightning receiving
5. Process orders manually or via tools

## Future Developments

Areas being explored:

- **Escrow systems** - Trustless holding
- **Automated fulfillment** - API integrations
- **Reputation systems** - Verifiable reviews
- **Inventory management** - Stock tracking
- **Multi-vendor stores** - Aggregation

## See Also

- [NIP-15 Deep Dive](/marketplaces/nip-15)
- [NIP-99 Classifieds](/marketplaces/nip-99)
- [Implementations](/marketplaces/implementations)

---

:::info Early Stage
Nostr marketplaces are still in early development. Expect rough edges but also rapid improvement as the ecosystem matures.
:::
