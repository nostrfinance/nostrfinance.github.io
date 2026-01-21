---
sidebar_position: 1
title: Web Ledgers
description: Universal balance mapping for the web
---

# Web Ledgers

[Web Ledgers](https://webledgers.org) is a specification for mapping web identifiers to numerical balances, enabling distributed ledger systems that transcend platform boundaries.

## Overview

Web Ledgers provides:
- **Universal identifiers** - URIs as account addresses
- **Cross-platform balances** - Same format everywhere
- **Nostr integration** - DIDs and pubkeys supported
- **JSON-LD format** - Standardized, extensible

```
URI (any web identifier) → Balance (numerical value)
```

## Core Concept

Traditional ledgers map identifiers to balances:

| Identifier | Balance |
|------------|---------|
| user@example | 1,000 |
| did:nostr:abc | 500 |
| https://... | 2,500 |

Web Ledgers extends this to any URI:

```json
{
  "@context": "https://webledgers.org/context.json",
  "ledger": [
    {
      "id": "did:nostr:abc123...",
      "balance": 10000
    },
    {
      "id": "mailto:alice@example.com",
      "balance": 5000
    }
  ]
}
```

## Specification

### Data Model

A Web Ledger consists of entries:

```typescript
interface LedgerEntry {
  id: string;        // URI identifier
  balance: number;   // Numerical balance
  unit?: string;     // Currency unit (default: sat)
}

interface WebLedger {
  "@context": string;
  ledger: LedgerEntry[];
  unit?: string;     // Default unit
  timestamp?: number;
}
```

### Supported URI Schemes

| Scheme | Example | Use Case |
|--------|---------|----------|
| `did:nostr:` | `did:nostr:abc123...` | Nostr identity |
| `mailto:` | `mailto:user@example.com` | Email |
| `https:` | `https://example.com/user` | Web identity |
| `bitcoin:` | `bitcoin:bc1q...` | Bitcoin address |
| `lightning:` | `lightning:lnurl...` | Lightning |

### Currency Units

```json
{
  "ledger": [
    { "id": "did:nostr:...", "balance": 1000000, "unit": "sat" },
    { "id": "did:nostr:...", "balance": 100, "unit": "USD" },
    { "id": "did:nostr:...", "balance": 1.5, "unit": "BTC" }
  ]
}
```

Default unit is `sat` (satoshis) if not specified.

## Nostr Integration

### DID:Nostr Entries

```json
{
  "@context": "https://webledgers.org/context.json",
  "ledger": [
    {
      "id": "did:nostr:b889ff5b1513b641e2a139f661a661364979c5beee91842f8f0ef42ab558e9d4",
      "balance": 50000
    }
  ]
}
```

### Npub Format Support

While DIDs are preferred, npub format can be used:

```json
{
  "id": "npub1hrz7lpwuuqvmv4fzwdvmwp2xfsxhgyjlwpjxhut9e3grvzce786sx2fylu",
  "balance": 50000
}
```

### Publishing on Nostr

Ledgers can be published as Nostr events:

```json
{
  "kind": 30078,
  "pubkey": "issuer_pubkey",
  "content": "{\"@context\":\"https://webledgers.org/context.json\",\"ledger\":[...]}",
  "tags": [
    ["d", "my-ledger"],
    ["t", "webledger"]
  ]
}
```

## Use Cases

### Community Tokens

Track community currency balances:

```json
{
  "@context": "https://webledgers.org/context.json",
  "name": "BitcoinersClub Points",
  "unit": "points",
  "ledger": [
    { "id": "did:nostr:alice...", "balance": 1500 },
    { "id": "did:nostr:bob...", "balance": 2300 },
    { "id": "did:nostr:carol...", "balance": 800 }
  ]
}
```

### Rewards Programs

Loyalty points across platforms:

```json
{
  "@context": "https://webledgers.org/context.json",
  "name": "MerchantRewards",
  "unit": "points",
  "ledger": [
    { "id": "mailto:customer@example.com", "balance": 5000 },
    { "id": "did:nostr:...", "balance": 3500 }
  ]
}
```

### Multi-Currency Portfolio

```json
{
  "@context": "https://webledgers.org/context.json",
  "name": "UserPortfolio",
  "ledger": [
    { "id": "bitcoin:bc1q...", "balance": 0.5, "unit": "BTC" },
    { "id": "did:nostr:...", "balance": 1000000, "unit": "sat" },
    { "id": "ethereum:0x...", "balance": 2.5, "unit": "ETH" }
  ]
}
```

### Audit Trails

Financial record keeping:

```json
{
  "@context": "https://webledgers.org/context.json",
  "name": "Q1 2024 Balances",
  "timestamp": 1711929600,
  "auditor": "did:nostr:auditor...",
  "ledger": [...]
}
```

## Implementation

### Creating a Ledger

```javascript
const ledger = {
  "@context": "https://webledgers.org/context.json",
  "name": "My Token Ledger",
  "unit": "token",
  "ledger": []
};

function addEntry(id, balance) {
  ledger.ledger.push({ id, balance });
}

function getBalance(id) {
  const entry = ledger.ledger.find(e => e.id === id);
  return entry ? entry.balance : 0;
}

function transfer(from, to, amount) {
  const fromEntry = ledger.ledger.find(e => e.id === from);
  const toEntry = ledger.ledger.find(e => e.id === to);

  if (fromEntry.balance >= amount) {
    fromEntry.balance -= amount;
    toEntry.balance += amount;
    return true;
  }
  return false;
}
```

### Publishing to Nostr

```javascript
import { signEvent, getEventHash } from 'nostr-tools';

const ledgerEvent = {
  kind: 30078,
  pubkey: issuerPubkey,
  created_at: Math.floor(Date.now() / 1000),
  content: JSON.stringify(ledger),
  tags: [
    ["d", "community-points"],
    ["t", "webledger"]
  ]
};

ledgerEvent.id = getEventHash(ledgerEvent);
ledgerEvent.sig = signEvent(ledgerEvent, issuerPrivkey);

await publishToRelays(ledgerEvent);
```

### Reading from Nostr

```javascript
const filter = {
  kinds: [30078],
  authors: [issuerPubkey],
  "#d": ["community-points"]
};

const events = await fetchFromRelays(filter);
const latestLedger = JSON.parse(events[0].content);
```

## Security Considerations

### Authorization

- Ledger updates should be signed
- Verify issuer identity before trusting
- Consider multi-sig for high-value ledgers

### Privacy

- Ledger contents may be public
- Consider encryption for sensitive data
- Use DIDs for pseudonymity

### Validation

- Verify balances are non-negative
- Check for duplicate entries
- Validate URI formats

## Specification Status

:::info Community Draft
Web Ledgers is a community group draft under the W3C Web Payments Community Group. It is not a W3C Standard.
:::

## Resources

- [Web Ledgers Specification](https://webledgers.org)
- [W3C Web Payments CG](https://www.w3.org/community/webpayments/)
- [JSON-LD](https://json-ld.org)
- [DID:Nostr](/identity/did-nostr)

---

:::tip Interoperability
Web Ledgers enables value tracking across any platform that can handle URIs. Your Nostr identity can hold balances alongside email addresses, web profiles, and cryptocurrency addresses.
:::
