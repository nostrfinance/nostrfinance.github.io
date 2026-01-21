---
sidebar_position: 5
title: NIP-61 (NutZaps)
description: Cashu eCash payments on Nostr
---

# NIP-61: NutZaps

[NIP-61](https://github.com/nostr-protocol/nips/blob/master/61.md) defines NutZaps - Cashu eCash tokens sent as Nostr payments, providing a privacy-preserving alternative to Lightning zaps.

## Summary

| Aspect | Detail |
|--------|--------|
| **Kinds** | 9321 (NutZap), 10019 (preferences) |
| **Purpose** | Private eCash payments |
| **Status** | Merged |
| **Depends on** | NIP-01, Cashu protocol |

## Overview

NutZaps are:
- P2PK-locked Cashu tokens
- Published as Nostr events
- Claimable only by recipient
- More private than Lightning zaps

## Mint Preferences (kind 10019)

Recipients publish their trusted mints:

```json
{
  "kind": 10019,
  "pubkey": "recipient_pubkey",
  "content": "",
  "tags": [
    ["mint", "https://mint.example.com", "sat"],
    ["mint", "https://backup.mint.com", "sat"],
    ["relay", "wss://relay.example.com"],
    ["relay", "wss://backup.relay.com"],
    ["pubkey", "p2pk_pubkey"]
  ]
}
```

### Tags

| Tag | Description |
|-----|-------------|
| `mint` | Trusted mint URL and unit |
| `relay` | Where to send NutZaps |
| `pubkey` | Optional: specific P2PK pubkey |

## NutZap Event (kind 9321)

The payment itself:

```json
{
  "kind": 9321,
  "pubkey": "sender_pubkey",
  "created_at": 1234567890,
  "content": "Great post! Here's a tip.",
  "tags": [
    ["p", "recipient_pubkey"],
    ["e", "zapped_event_id"],
    ["proof", "<cashu_token_json>"],
    ["mint", "https://mint.example.com"],
    ["u", "sat"]
  ]
}
```

### Tags Explained

| Tag | Required | Description |
|-----|----------|-------------|
| `p` | Yes | Recipient's pubkey |
| `proof` | Yes | Cashu token proofs |
| `mint` | Yes | Mint URL |
| `e` | No | Event being zapped |
| `a` | No | Addressable event |
| `u` | No | Unit (default: sat) |

### Proof Tag Format

```json
{
  "proofs": [
    {
      "amount": 8,
      "secret": "P2PK:<pubkey>:<conditions>",
      "C": "signature_point",
      "id": "keyset_id"
    }
  ]
}
```

## P2PK Locking

Tokens are Pay-to-Public-Key locked:

```
Secret format: P2PK:<recipient_pubkey>

Only holder of corresponding private key can spend
```

### Conditions (Optional)

```javascript
const secret = {
  kind: "P2PK",
  data: recipientPubkey,
  conditions: {
    sigflag: "SIG_INPUTS", // Must sign proofs
    locktime: null,        // No time lock
    refund: null           // No refund path
  }
};
```

## Flow

```
Sender                          Recipient
  │                                  │
  │ 1. Fetch mint prefs (10019)     │
  │◄─────────────────────────────────│
  │                                  │
  │ 2. Mint P2PK tokens             │
  │      at recipient's mint        │
  │                                  │
  │ 3. Publish NutZap (9321)        │
  │─────────────────────────────────►│
  │                                  │
  │                4. Claim tokens   │
  │                   (swap at mint) │
  │                                  │
```

## Claiming NutZaps

### Detection

Monitor for incoming NutZaps:

```javascript
const filter = {
  kinds: [9321],
  '#p': [myPubkey]
};
```

### Claiming

1. Parse proof from NutZap
2. Sign claim with your private key
3. Swap at mint for fresh tokens

```javascript
async function claimNutZap(nutzapEvent) {
  const proof = JSON.parse(nutzapEvent.tags.find(t => t[0] === 'proof')[1]);
  const mintUrl = nutzapEvent.tags.find(t => t[0] === 'mint')[1];

  // Connect to mint
  const mint = new CashuMint(mintUrl);
  const wallet = new CashuWallet(mint);

  // Claim with signature
  const signature = await signP2PKClaim(proof, myPrivkey);
  const freshTokens = await wallet.receive(proof, { signature });

  return freshTokens;
}
```

## Privacy Comparison

| Aspect | Lightning Zaps | NutZaps |
|--------|----------------|---------|
| Amount visibility | Public | Can be hidden |
| Sender visibility | Public (or ephemeral key) | Nostr pubkey visible |
| Payment route | Lightning network | Direct via Nostr |
| Receipt | Public event | Claim is private |

## Implementation

### Sending a NutZap

```javascript
async function sendNutZap(recipientPubkey, eventId, amount, message) {
  // 1. Get recipient's mint preferences
  const prefs = await fetchEvent({
    kinds: [10019],
    authors: [recipientPubkey]
  });

  const mintUrl = prefs.tags.find(t => t[0] === 'mint')[1];
  const relays = prefs.tags.filter(t => t[0] === 'relay').map(t => t[1]);

  // 2. Mint P2PK-locked tokens
  const mint = new CashuMint(mintUrl);
  const wallet = new CashuWallet(mint);

  const tokens = await wallet.mintTokens(amount, {
    p2pk: recipientPubkey
  });

  // 3. Publish NutZap
  const nutzap = {
    kind: 9321,
    pubkey: myPubkey,
    content: message,
    tags: [
      ['p', recipientPubkey],
      ['e', eventId],
      ['proof', JSON.stringify(tokens)],
      ['mint', mintUrl],
      ['u', 'sat']
    ]
  };

  await signAndPublish(nutzap, relays);
}
```

### Setting Up to Receive

```javascript
async function setupNutZapReceiving(trustedMints, relays) {
  const prefs = {
    kind: 10019,
    pubkey: myPubkey,
    content: '',
    tags: [
      ...trustedMints.map(m => ['mint', m, 'sat']),
      ...relays.map(r => ['relay', r])
    ]
  };

  await signAndPublish(prefs);
}
```

### Monitoring and Claiming

```javascript
class NutZapMonitor {
  constructor(wallet, pubkey) {
    this.wallet = wallet;
    this.pubkey = pubkey;
  }

  async start(relays) {
    const filter = {
      kinds: [9321],
      '#p': [this.pubkey],
      since: Math.floor(Date.now() / 1000)
    };

    for (const relay of relays) {
      relay.subscribe(filter, async (event) => {
        await this.processNutZap(event);
      });
    }
  }

  async processNutZap(event) {
    try {
      const claimed = await this.claimTokens(event);
      console.log(`Claimed ${claimed.amount} sats`);
    } catch (error) {
      console.error('Failed to claim NutZap:', error);
    }
  }
}
```

## Considerations

### Mint Trust

- Tokens are only as good as the mint
- Recipients set their trusted mints
- Senders must use recipient's mints

### Timing

- Claim promptly to avoid issues
- Mints may have token expiry
- Proofs can be swept by recipient anytime

### Amount Visibility

- Individual proof amounts are visible
- Total can be inferred
- Privacy depends on denomination structure

## Resources

- [NIP-61 Specification](https://github.com/nostr-protocol/nips/blob/master/61.md)
- [Cashu Protocol](https://cashu.space)
- [NutZaps Guide](/payments/nutzaps)
- [Cashu Wallets](/wallets/cashu)

---

:::tip Private Tipping
NutZaps offer privacy advantages over Lightning zaps, especially for amounts and payment patterns. Use them when you want more financial privacy on Nostr.
:::
