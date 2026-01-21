---
sidebar_position: 4
title: NutZaps (NIP-61)
description: Private eCash payments on Nostr
---

# NutZaps - Private eCash Payments

NutZaps are Cashu eCash tokens sent via Nostr, providing a privacy-preserving alternative to regular zaps. Defined by [NIP-61](https://github.com/nostr-protocol/nips/blob/master/61.md), they combine Cashu's privacy with Nostr's social layer.

## What Are NutZaps?

NutZaps are:
- **P2PK-locked Cashu tokens** - Only the recipient can spend them
- **Published on Nostr** - As kind 9321 events
- **Privacy-preserving** - Amounts can be hidden from observers
- **Instant** - No Lightning routing required

### NutZaps vs Regular Zaps

| Feature | Zaps (NIP-57) | NutZaps (NIP-61) |
|---------|---------------|------------------|
| Privacy | Public amounts | Private amounts |
| Payment | Lightning | Cashu eCash |
| Receipt | Public event | Token claim |
| Speed | Fast | Instant |
| Fees | Routing fees | Minimal/none |

## How NutZaps Work

### The NutZap Flow

```
┌──────────┐                              ┌──────────┐
│  Sender  │                              │ Receiver │
│ (Alice)  │                              │  (Bob)   │
└────┬─────┘                              └────┬─────┘
     │                                         │
     │ 1. Fetch Bob's mint preferences         │
     │◄────────────────────────────────────────│
     │    (kind 10019 event)                   │
     │                                         │
     │ 2. Mint P2PK-locked tokens              │
     │    at Bob's preferred mint              │
     │                                         │
     │ 3. Publish NutZap (kind 9321)          │
     │────────────────────────────────────────►│
     │                                         │
     │                    4. Bob claims tokens │
     │                       to his wallet     │
     │                                         │
```

### Step-by-Step

1. **Sender fetches preferences**
   - Looks up recipient's kind 10019 event
   - Gets list of trusted mints and relays

2. **Tokens minted**
   - Sender mints Cashu tokens at recipient's mint
   - Tokens are P2PK-locked to recipient's pubkey

3. **NutZap published**
   - Kind 9321 event with token proofs
   - Published to recipient's preferred relays

4. **Recipient claims**
   - Recipient's wallet detects NutZap
   - Swaps tokens into their wallet

## Event Structures

### Mint Preferences (kind 10019)

Recipients publish their Cashu mint preferences:

```json
{
  "kind": 10019,
  "pubkey": "recipient_pubkey",
  "content": "",
  "tags": [
    ["mint", "https://mint.example.com", "sat"],
    ["mint", "https://backup-mint.com", "sat"],
    ["relay", "wss://relay.example.com"],
    ["pubkey", "p2pk_receiving_pubkey"]
  ]
}
```

| Tag | Purpose |
|-----|---------|
| `mint` | Trusted Cashu mint URL |
| `relay` | Where to publish NutZaps |
| `pubkey` | Key for P2PK locking (optional) |

### NutZap Event (kind 9321)

```json
{
  "kind": 9321,
  "pubkey": "sender_pubkey",
  "content": "Thanks for the great content!",
  "tags": [
    ["p", "recipient_pubkey"],
    ["e", "event_being_zapped"],
    ["proof", "{...cashu_proofs...}"],
    ["mint", "https://mint.example.com"]
  ]
}
```

| Tag | Purpose |
|-----|---------|
| `p` | Recipient's pubkey |
| `e` | Event being tipped (optional) |
| `proof` | Cashu token proofs |
| `mint` | Mint that issued tokens |

## Setting Up NutZaps

### For Receiving

1. **Choose trusted mints**
   - Research mint reputation
   - Consider mint size and liquidity

2. **Publish preferences**
   - Create kind 10019 event
   - List your trusted mints

3. **Monitor for NutZaps**
   - Wallet should auto-detect
   - Claim tokens promptly

### For Sending

1. **Check recipient's mints**
   - Fetch their kind 10019
   - Ensure you have balance at their mint

2. **Mint tokens**
   - Create P2PK-locked proofs
   - Lock to recipient's pubkey

3. **Publish NutZap**
   - Create kind 9321 event
   - Include proofs and mint info

## P2PK Locking

NutZaps use Pay-to-Public-Key (P2PK) locking:

```
Token locked to: recipient_pubkey
Only spendable by: holder of recipient_privkey
```

This ensures:
- Only the intended recipient can claim
- Anyone can see the event but not spend tokens
- Signature required to redeem

## Privacy Benefits

### What's Hidden

- **Exact amount** (can be hidden in proof structure)
- **Sender identity** (if using anonymous pubkey)
- **Payment route** (no Lightning gossip)

### What's Visible

- **That a NutZap occurred** (kind 9321 is public)
- **Which mint was used**
- **Recipient pubkey**

### Enhanced Privacy Tips

1. Use anonymous sender keys
2. Use mints with good privacy practices
3. Avoid reusing proofs or patterns

## Cashu Integration

NutZaps leverage Cashu eCash:

### Cashu Properties

- **Blinded signatures** - Mint can't link minting to spending
- **Bearer tokens** - Whoever holds proofs owns them
- **Lightning interop** - Deposit/withdraw via Lightning

### Mint Trust

:::warning Trust Considerations
Cashu mints are custodial. The mint could:
- Disappear with funds
- Refuse to honor tokens
- Track certain patterns

Choose reputable mints and keep small amounts.
:::

## Implementations

### Wallets with NutZap Support

- **Nutstash** - Web wallet with NutZap
- **eNuts** - Mobile Cashu wallet
- **Minibits** - Mobile with Nostr integration

### Libraries

- **cashu-ts** - TypeScript Cashu library
- **cashu-rs** - Rust implementation
- **ndk-wallet** - NDK wallet toolkit

## Example Code

### Publishing Mint Preferences

```javascript
const mintPrefs = {
  kind: 10019,
  content: "",
  tags: [
    ["mint", "https://mint.minibits.cash", "sat"],
    ["relay", "wss://relay.damus.io"],
  ]
};
await publishEvent(mintPrefs);
```

### Sending a NutZap

```javascript
// 1. Get recipient's preferences
const prefs = await fetchEvent(recipientPubkey, 10019);
const mintUrl = prefs.tags.find(t => t[0] === 'mint')[1];

// 2. Mint P2PK tokens
const tokens = await mintP2PKTokens(mintUrl, recipientPubkey, 1000);

// 3. Publish NutZap
const nutzap = {
  kind: 9321,
  content: "Great post!",
  tags: [
    ["p", recipientPubkey],
    ["e", eventId],
    ["proof", JSON.stringify(tokens)],
    ["mint", mintUrl]
  ]
};
await publishEvent(nutzap);
```

## See Also

- [NIP-61 Specification](https://github.com/nostr-protocol/nips/blob/master/61.md)
- [Cashu Wallets](/wallets/cashu)
- [NIP-60: Cashu Wallet](/nips/nip-60)
- [Regular Zaps](/payments/zaps)

---

:::info When to Use NutZaps
Use NutZaps when you want more privacy than regular zaps provide. They're ideal for tips where you don't want the amount publicly visible, or when you prefer eCash's privacy properties.
:::
