---
sidebar_position: 1
title: Finance NIPs Overview
description: Nostr Implementation Possibilities for finance
---

# Finance NIPs Overview

NIPs (Nostr Implementation Possibilities) are the specifications that define how Nostr works. This section covers NIPs specifically related to finance, payments, and economic activity on Nostr.

## What Are NIPs?

NIPs are proposals that define:
- **Event kinds** - Message types and formats
- **Tags** - Metadata conventions
- **Protocols** - Interaction patterns
- **Standards** - Interoperability rules

```
NIP Lifecycle:
Draft → Discussion → Implementation → Adoption
```

## Finance-Related NIPs

### Core Payment NIPs

| NIP | Name | Purpose | Status |
|-----|------|---------|--------|
| [NIP-47](/nips/nip-47) | Nostr Wallet Connect | Wallet-app communication | Merged |
| [NIP-57](/nips/nip-57) | Lightning Zaps | Tipping via Lightning | Merged |
| [NIP-75](/nips/nip-75) | Zap Goals | Crowdfunding | Merged |

### Commerce NIPs

| NIP | Name | Purpose | Status |
|-----|------|---------|--------|
| NIP-15 | Marketplaces | E-commerce protocol | Merged |
| NIP-99 | Classifieds | Listing format | Merged |

### Supporting NIPs

| NIP | Name | Relevance |
|-----|------|-----------|
| NIP-01 | Basic Protocol | Foundation |
| NIP-04 | Encrypted DMs | Payment messages |
| NIP-05 | DNS Identifiers | Verification |
| NIP-19 | Bech32 Encoding | Key formats |

## Event Kinds Summary

### Payment Events

| Kind | Name | NIP |
|------|------|-----|
| 9734 | Zap Request | 57 |
| 9735 | Zap Receipt | 57 |
| 9041 | Zap Goal | 75 |
| 23194 | NWC Request | 47 |
| 23195 | NWC Response | 47 |

### Commerce Events

| Kind | Name | NIP |
|------|------|-----|
| 30017 | Stall | 15 |
| 30018 | Product | 15 |
| 30402 | Classified | 99 |

## NIP Architecture

### How NIPs Interact

```
┌─────────────────────────────────────────────────────────┐
│                     Application                         │
│                   (Nostr Client)                        │
├────────────────────────────────────────────────────────┤
│           NIP-57 Zaps    │      NIP-75 Goals           │
├────────────────────────────────────────────────────────┤
│                      NIP-47                             │
│                Nostr Wallet Connect                     │
├────────────────────────────────────────────────────────┤
│                      NIP-01                             │
│                   Base Protocol                         │
├────────────────────────────────────────────────────────┤
│                  Lightning Network                      │
│                    + Taproot                            │
└────────────────────────────────────────────────────────┘
```

### Tag Dependencies

```
Zap Request (9734)
├── ["p", recipient_pubkey]
├── ["e", event_id]
├── ["amount", millisats]
├── ["relays", ...]
└── ["lnurl", ...]

Zap Receipt (9735)
├── ["p", recipient]
├── ["P", sender]
├── ["e", zapped_event]
├── ["bolt11", invoice]
├── ["description", zap_request]
└── ["preimage", ...]
```

## Taproot Native

While not a formal NIP, the cryptographic alignment between Nostr and Bitcoin Taproot is fundamental:

### Shared Foundation

| Property | Nostr | Bitcoin Taproot |
|----------|-------|-----------------|
| Curve | secp256k1 | secp256k1 |
| Public Key Format | x-only (32 bytes) | x-only (32 bytes) |
| Signature Scheme | Schnorr | Schnorr |

### Implications

- Your npub can derive a P2TR address
- Nostr keys can sign Bitcoin transactions
- Identity and value transfer unified

## Implementation Guide

### For Client Developers

1. **Start with NIP-01** - Understand base protocol
2. **Add NIP-57** - Enable zapping (most requested)
3. **Integrate NIP-47** - Wallet connectivity
4. **Consider Taproot** - On-chain integration

### For Wallet Developers

1. **Implement NIP-47** - Become NWC compatible
2. **Support NIP-57** - Generate zap receipts
3. **Consider P2TR** - Taproot address derivation

### For Marketplace Builders

1. **Choose NIP-15 or NIP-99** - Based on needs
2. **Integrate payments** - NIP-57 or NIP-47
3. **Add messaging** - NIP-04 or NIP-17

## NIP Resources

### Official Repository

- [nostr-protocol/nips](https://github.com/nostr-protocol/nips)

### Reference Sites

- [nips.nostr.com](https://nips.nostr.com)
- [nostr-nips.com](https://nostr-nips.com)

### Discussion

- GitHub Issues on NIP repo
- Nostr itself (discuss on protocol)

## Contributing

### Proposing a NIP

1. **Write the spec** following existing format
2. **Open PR** on nips repository
3. **Discuss** with community
4. **Implement** in at least one client
5. **Iterate** based on feedback

### Best Practices

- Study existing NIPs first
- Start with clear problem statement
- Consider edge cases
- Think about backwards compatibility
- Get community input early

## See Also

- [NIP-47: Nostr Wallet Connect](/nips/nip-47)
- [NIP-57: Lightning Zaps](/nips/nip-57)
- [NIP-75: Zap Goals](/nips/nip-75)

---

:::tip Stay Updated
The NIP repository on GitHub is the source of truth. NIPs can be updated, and new finance-related NIPs are regularly proposed.
:::
