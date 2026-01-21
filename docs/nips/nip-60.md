---
sidebar_position: 4
title: NIP-60 (Cashu Wallets)
description: Cashu wallet storage on Nostr
---

# NIP-60: Cashu Wallets

[NIP-60](https://github.com/nostr-protocol/nips/blob/master/60.md) defines how Cashu eCash wallets store their state on Nostr, enabling wallet portability across devices and applications.

## Summary

| Aspect | Detail |
|--------|--------|
| **Kinds** | 17375 (wallet), 7375 (tokens), 7376 (history) |
| **Purpose** | Cashu wallet storage |
| **Status** | Merged |
| **Depends on** | NIP-01, Cashu protocol |

## Overview

NIP-60 enables:
- Store Cashu tokens as Nostr events
- Access wallet from any device
- Wallet follows your Nostr identity
- Encrypted token storage

## Event Kinds

| Kind | Name | Purpose |
|------|------|---------|
| 17375 | Wallet | Wallet metadata and config |
| 7375 | Wallet Tokens | Unspent Cashu proofs |
| 7376 | Wallet History | Spending records |

## Wallet Event (kind 17375)

Stores wallet configuration:

```json
{
  "kind": 17375,
  "pubkey": "user_pubkey",
  "content": "<encrypted JSON>",
  "tags": [
    ["d", "wallet_id"],
    ["mint", "https://mint.example.com"],
    ["relay", "wss://relay.example.com"],
    ["name", "My Cashu Wallet"]
  ]
}
```

### Content (encrypted)

```json
{
  "mints": [
    {
      "url": "https://mint.example.com",
      "keysets": ["keyset_id_1", "keyset_id_2"]
    }
  ],
  "unit": "sat"
}
```

### Tags

| Tag | Description |
|-----|-------------|
| `d` | Wallet identifier |
| `mint` | Trusted mint URLs |
| `relay` | Preferred relays |
| `name` | Human-readable name |

## Token Event (kind 7375)

Stores unspent Cashu proofs:

```json
{
  "kind": 7375,
  "pubkey": "user_pubkey",
  "content": "<encrypted proofs>",
  "tags": [
    ["a", "17375:user_pubkey:wallet_id"]
  ]
}
```

### Content (encrypted)

```json
{
  "mint": "https://mint.example.com",
  "proofs": [
    {
      "amount": 8,
      "secret": "secret_string",
      "C": "signature_point",
      "id": "keyset_id"
    },
    {
      "amount": 4,
      "secret": "secret_string_2",
      "C": "signature_point_2",
      "id": "keyset_id"
    }
  ]
}
```

Each event contains proofs from one mint.

## History Event (kind 7376)

Optional spending history:

```json
{
  "kind": 7376,
  "pubkey": "user_pubkey",
  "content": "<encrypted history>",
  "tags": [
    ["a", "17375:user_pubkey:wallet_id"],
    ["e", "related_event_id"]
  ]
}
```

### Content (encrypted)

```json
{
  "direction": "out",
  "amount": 100,
  "mint": "https://mint.example.com",
  "timestamp": 1234567890,
  "memo": "Coffee payment"
}
```

## Encryption

All content MUST be encrypted using NIP-44:
- Only the owner can read proofs
- Relays see encrypted blobs
- Cross-device access with same keys

```javascript
import { nip44 } from 'nostr-tools';

const encrypted = nip44.encrypt(
  privateKey,
  publicKey,
  JSON.stringify(proofs)
);
```

## Token Management

### Storing Tokens

After minting or receiving:

```javascript
async function storeTokens(proofs, mint, walletId) {
  const content = JSON.stringify({ mint, proofs });
  const encrypted = await nip44.encrypt(privateKey, publicKey, content);

  const event = {
    kind: 7375,
    pubkey: publicKey,
    content: encrypted,
    tags: [['a', `17375:${publicKey}:${walletId}`]]
  };

  await signAndPublish(event);
}
```

### Retrieving Tokens

```javascript
async function getTokens(walletId) {
  const events = await fetchEvents({
    kinds: [7375],
    authors: [publicKey],
    '#a': [`17375:${publicKey}:${walletId}`]
  });

  const allProofs = [];
  for (const event of events) {
    const decrypted = await nip44.decrypt(privateKey, publicKey, event.content);
    const { proofs } = JSON.parse(decrypted);
    allProofs.push(...proofs);
  }

  return allProofs;
}
```

### Spending Tokens

1. Fetch current token events
2. Select proofs to spend
3. Execute Cashu transaction
4. Delete old token event
5. Store change as new event

```javascript
async function spendTokens(amount, walletId) {
  // Get all proofs
  const proofs = await getTokens(walletId);

  // Select proofs for spending
  const { send, keep } = selectProofs(proofs, amount);

  // Cashu swap/send
  const result = await cashuWallet.send(send);

  // Update stored proofs (delete old, store change)
  await deleteTokenEvents(walletId);
  if (keep.length > 0) {
    await storeTokens(keep, mintUrl, walletId);
  }

  return result;
}
```

## Multi-Device Sync

### Consistency

Multiple devices accessing same wallet:
- Always fetch latest events before spending
- Use event creation timestamps
- Handle potential conflicts

### Best Practice

```javascript
// Before any operation
async function syncWallet(walletId) {
  // 1. Fetch latest token events
  const tokenEvents = await fetchLatestTokenEvents(walletId);

  // 2. Consolidate proofs
  const proofs = await extractAndValidateProofs(tokenEvents);

  // 3. Check for double-spends (validate with mint)
  const validProofs = await validateWithMint(proofs);

  return validProofs;
}
```

## Implementation

### Creating Wallet

```javascript
async function createWallet(name, mints) {
  const walletId = generateId();

  const walletEvent = {
    kind: 17375,
    pubkey: publicKey,
    content: await encrypt({
      mints: mints.map(url => ({ url, keysets: [] })),
      unit: 'sat'
    }),
    tags: [
      ['d', walletId],
      ...mints.map(m => ['mint', m]),
      ['name', name]
    ]
  };

  await signAndPublish(walletEvent);
  return walletId;
}
```

### Full Example

```javascript
class NostrCashuWallet {
  constructor(ndk, walletId) {
    this.ndk = ndk;
    this.walletId = walletId;
  }

  async getBalance() {
    const proofs = await this.getProofs();
    return proofs.reduce((sum, p) => sum + p.amount, 0);
  }

  async getProofs() {
    const events = await this.ndk.fetchEvents({
      kinds: [7375],
      authors: [this.ndk.signer.pubkey],
      '#a': [`17375:${this.ndk.signer.pubkey}:${this.walletId}`]
    });

    const proofs = [];
    for (const event of events) {
      const decrypted = await decrypt(event.content);
      proofs.push(...JSON.parse(decrypted).proofs);
    }
    return proofs;
  }

  async storeProofs(proofs, mint) {
    const event = {
      kind: 7375,
      content: await encrypt(JSON.stringify({ mint, proofs })),
      tags: [['a', `17375:${this.ndk.signer.pubkey}:${this.walletId}`]]
    };
    await this.ndk.publish(event);
  }
}
```

## Resources

- [NIP-60 Specification](https://github.com/nostr-protocol/nips/blob/master/60.md)
- [Cashu Protocol](https://cashu.space)
- [Cashu Wallets Guide](/wallets/cashu)

---

:::tip Portable Wallets
NIP-60 means your Cashu wallet travels with your Nostr identity. Log in to any compatible app and your tokens are there.
:::
