---
sidebar_position: 1
title: Payments Overview
description: Understanding payment methods on Nostr
---

# Payments on Nostr

Nostr enables several types of Bitcoin-based payments, from Lightning zaps to private eCash transfers. This overview covers all payment methods available in the ecosystem.

## Payment Methods Comparison

| Method | Speed | Privacy | Fees | Best For |
|--------|-------|---------|------|----------|
| [Zaps (NIP-57)](/payments/zaps) | Instant | Public | Low | Tipping, social signals |
| [NutZaps (NIP-61)](/payments/nutzaps) | Instant | Private | Very Low | Private tips |
| [Lightning Direct](/payments/lightning-network) | Instant | Moderate | Low | Larger payments |
| [On-chain Bitcoin](/payments/lightning-network#on-chain) | 10-60 min | Moderate | Variable | Large amounts |

## How Payments Flow

### Zap Flow (Most Common)

```
1. Alice sees Bob's post
2. Alice clicks ⚡ and selects 1000 sats
3. Alice's client creates a Zap Request (kind 9734)
4. Bob's LNURL endpoint receives request
5. LNURL returns a Lightning invoice
6. Alice's wallet pays the invoice
7. Bob's wallet publishes Zap Receipt (kind 9735)
8. Receipt appears on Bob's post
```

### NutZap Flow (Private)

```
1. Alice wants to tip Bob privately
2. Alice fetches Bob's mint preferences (kind 10019)
3. Alice mints Cashu tokens at Bob's mint
4. Alice publishes NutZap (kind 9321)
5. Bob claims tokens to his wallet
```

## Value for Value

Nostr finance operates on the **Value for Value** (V4V) model:

:::tip V4V Principles
1. **Content is freely available** - No paywalls
2. **Payments are voluntary** - Pay what you think it's worth
3. **Direct to creator** - No platform middleman
4. **Immediate settlement** - Via Lightning Network
:::

### V4V vs Traditional Models

| Aspect | Traditional | Value for Value |
|--------|-------------|-----------------|
| Access | Paywall/subscription | Free |
| Revenue | Forced payment | Voluntary |
| Friction | High (signup, payment) | Low (one-click zap) |
| Privacy | Data collection | Minimal data |
| Middleman | Platform takes 30%+ | Direct payments |

## Payment Infrastructure

### Required Components

1. **Nostr Client** - User interface
2. **Lightning Wallet** - Holds and sends funds
3. **NWC Connection** - Links wallet to client
4. **Relays** - Transmit payment events

### Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│                     User Interface                   │
│              (Damus, Amethyst, Primal)              │
├──────────────────────┬──────────────────────────────┤
│      NIP-57 Zaps     │      NIP-61 NutZaps         │
│  ┌────────────────┐  │  ┌────────────────────────┐ │
│  │  Zap Request   │  │  │   Cashu Tokens        │ │
│  │  Zap Receipt   │  │  │   P2PK Locked         │ │
│  └────────────────┘  │  └────────────────────────┘ │
├──────────────────────┴──────────────────────────────┤
│               NIP-47 Nostr Wallet Connect           │
│  ┌────────────────────────────────────────────────┐ │
│  │  pay_invoice │ make_invoice │ get_balance     │ │
│  └────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────┤
│                  Lightning Network                   │
│         (Instant Bitcoin Payments Layer)            │
├─────────────────────────────────────────────────────┤
│                    Bitcoin Network                   │
│              (Base Settlement Layer)                │
└─────────────────────────────────────────────────────┘
```

## Common Payment Amounts

Typical zap amounts and their meanings:

| Amount | Common Usage |
|--------|--------------|
| 21 sats | Symbolic tip (21M BTC cap) |
| 69 sats | Playful tip |
| 100 sats | Small appreciation |
| 420 sats | Fun tip |
| 1,000 sats | Solid tip (~$1) |
| 2,100 sats | Generous tip |
| 5,000 sats | Very generous |
| 10,000+ sats | Exceptional content |

## Payment Events Reference

| Kind | Name | Purpose |
|------|------|---------|
| 9734 | Zap Request | Initiates a zap |
| 9735 | Zap Receipt | Proves payment |
| 9321 | NutZap | eCash payment |
| 9041 | Zap Goal | Crowdfunding target |
| 7375 | Wallet Tokens | Cashu proofs |
| 7376 | Wallet History | Spending log |

## Receiving Payments

To receive payments on Nostr, you need:

### 1. Lightning Address

Add to your profile (kind 0):
```json
{
  "lud16": "yourname@walletservice.com"
}
```

### 2. LNURL (Alternative)

```json
{
  "lud06": "https://service.com/.well-known/lnurlp/username"
}
```

### 3. For NutZaps

Publish mint preferences (kind 10019):
```json
{
  "kind": 10019,
  "tags": [
    ["mint", "https://mint.example.com", "sat"],
    ["relay", "wss://relay.example.com"]
  ]
}
```

## Further Reading

- [Zaps Deep Dive](/payments/zaps)
- [NutZaps Guide](/payments/nutzaps)
- [Lightning Network](/payments/lightning-network)
- [Subscriptions](/payments/subscriptions)
- [Crowdfunding](/payments/crowdfunding)

---

:::info Micropayments Revolution
Nostr enables true micropayments - sending $0.01 or less with minimal fees. This opens new monetization models impossible with traditional payment systems.
:::
