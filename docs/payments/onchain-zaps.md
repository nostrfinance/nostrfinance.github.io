---
sidebar_position: 4
title: On-Chain Zaps
description: Bitcoin tips directly to Nostr identities
---

# On-Chain Zaps

On-chain zaps enable direct Bitcoin transfers to any Nostr user without Lightning Network intermediaries. By leveraging the shared cryptography between Nostr and Bitcoin Taproot, you can send Bitcoin to anyone's npub - whether they're ready to receive or not.

## Why On-Chain Zaps Matter

Lightning zaps (NIP-57) revolutionized Nostr payments, but they have friction:

| Challenge | Lightning Zaps | On-Chain Zaps |
|-----------|---------------|---------------|
| Recipient setup | Requires LNURL/LN address | None - npub is enough |
| Sender setup | Needs funded channels | Any Bitcoin wallet |
| Availability | Recipient must be online | Funds wait on-chain |
| Amount limits | Channel capacity | No upper limit |

**The key insight**: Your npub already IS a Bitcoin address. No setup required.

## How It Works

### The Cryptographic Bridge

Nostr and Bitcoin Taproot use identical cryptography:

```mermaid
flowchart LR
    npub["npub1abc...<br/>(Nostr identity)"]
    p2tr["bc1pabc...<br/>(P2TR address)"]
    npub -->|"Same secp256k1 key"| p2tr
```

Both are x-only public keys on secp256k1. The encoding differs, but the underlying key is the same.

### Deriving a P2TR Address

```javascript
import { nip19 } from 'nostr-tools';
import * as bitcoin from 'bitcoinjs-lib';

function npubToP2TR(npub) {
  // Decode npub to get raw pubkey
  const { data: pubkey } = nip19.decode(npub);
  
  // Create P2TR address (x-only pubkey, same as Nostr)
  const { address } = bitcoin.payments.p2tr({
    internalPubkey: Buffer.from(pubkey, 'hex'),
    network: bitcoin.networks.bitcoin
  });
  
  return address; // bc1p...
}

// Example
const npub = 'npub1sg6plzptd64u62a878hep2kev88swjh3tw00gjsfl8f237lmu63q0uf63m';
const btcAddress = npubToP2TR(npub);
// bc1p... derived directly from npub
```

### Simple On-Chain Zap Flow

```mermaid
sequenceDiagram
    participant Alice as Sender
    participant BTC as Bitcoin Network
    participant Bob as Recipient (npub)

    Alice->>Alice: 1. Derive bc1p... from Bob's npub
    Alice->>BTC: 2. Send Bitcoin to bc1p...
    BTC->>BTC: 3. Transaction confirms
    Bob->>BTC: 4. Scan for funds (knows his key)
    Note over Bob: Bob can spend with his nsec
```

## Client Support

### Ditto

[Ditto 2.12](https://soapbox.pub/blog/onchain-zaps-in-ditto) shipped on-chain zaps first:
- One-click on-chain tips
- Automatic address derivation
- Integrated with Soapbox UI

### Amethyst

Android's leading Nostr client added support within 24 hours:
- On-chain zap option alongside Lightning
- Wallet integration
- Transaction tracking

### More Coming

The simplicity of the approach means any client can add support:
1. Derive P2TR from recipient's npub
2. Generate a Bitcoin URI or QR
3. User pays with any Bitcoin wallet

## Privacy Considerations

:::warning Public Ledger
On-chain zaps create a permanent, public link between your npub and Bitcoin transactions. Consider the tradeoffs.
:::

### The Privacy Tradeoff

| Aspect | Implication |
|--------|-------------|
| **Address reuse** | All zaps to same npub go to same address |
| **Public history** | Anyone can see total received |
| **Sender correlation** | Your funding source is visible |
| **Dust attacks** | Anyone can send tiny amounts |

### When On-Chain Makes Sense

- Large tips where Lightning capacity is insufficient
- Recipients without Lightning setup
- Long-term savings/accumulation
- When you don't mind public attribution

### When to Use Lightning Instead

- Privacy-sensitive payments
- Frequent small tips
- When recipient has LNURL configured

## Silent Payments: Privacy-Enhanced On-Chain

For privacy-conscious on-chain payments, **Silent Payments** (BIP-352) combined with Nostr notifications solve address reuse:

### How Silent Payments Work

```mermaid
flowchart TB
    subgraph sender["Sender (Alice)"]
        A["Alice's key (a)"]
    end
    
    subgraph recipient["Recipient (Bob)"]
        B["Bob's npub (B)"]
    end
    
    subgraph derive["Derive Stealth Address"]
        secret["Shared secret S = aB"]
        stealth["Unique address P = B + H(S)G"]
    end
    
    subgraph notify["NIP-17 Notification"]
        dm["Encrypted DM with derivation info"]
    end
    
    A --> secret
    B --> secret
    secret --> stealth
    stealth --> notify
```

### Nostr as Notification Layer

Instead of on-chain notifications (OP_RETURN), use NIP-17 encrypted DMs:

```javascript
// Sender creates notification for recipient
const notification = {
  kind: 14, // NIP-17 chat message (sealed + gift-wrapped)
  content: JSON.stringify({
    type: 'silent_payment',
    sender_pubkey: alicePubkey,
    counter: i,
    txid: transactionId
  }),
  tags: [['p', bobPubkey]]
};

// Wrapped per NIP-17 for privacy
// Bob receives everything needed to find and spend the UTXO
```

**Benefits:**
- No address reuse (each payment gets unique address)
- No on-chain scanning required
- Private notification via encrypted DMs
- Works with existing Nostr infrastructure

## Integration with Wallets

### Sparrow Wallet

Sparrow has a "color-address" plugin demonstrating:
- Stealth address generation from npub
- NIP-17 notification broadcasting
- Automatic UTXO detection

### Future: NWC for On-Chain

Nostr Wallet Connect (NIP-47) could extend to on-chain:

```javascript
// Hypothetical NWC on-chain method
{
  "method": "pay_onchain",
  "params": {
    "address": "bc1p...",
    "amount": 100000,  // sats
    "fee_rate": 10     // sat/vB
  }
}
```

## Implementation Guide

### For Client Developers

1. **Add P2TR derivation** - Convert npub to bc1p address
2. **Generate payment URI** - `bitcoin:bc1p...?amount=0.001`
3. **Show QR code** - User scans with any Bitcoin wallet
4. **Optional: Track payments** - Monitor address for incoming txs

### For Wallet Developers

1. **Recognize npub inputs** - Auto-convert to P2TR
2. **Support Silent Payments** - BIP-352 + NIP-17 notifications
3. **Integrate NWC** - Remote signing for on-chain

### Example: Minimal On-Chain Zap Button

```typescript
import { nip19 } from 'nostr-tools';
import { payments, networks } from 'bitcoinjs-lib';

function OnChainZapButton({ recipientNpub, amountSats }) {
  const handleZap = () => {
    const { data: pubkey } = nip19.decode(recipientNpub);
    
    const { address } = payments.p2tr({
      internalPubkey: Buffer.from(pubkey, 'hex'),
      network: networks.bitcoin
    });
    
    const btcAmount = amountSats / 100_000_000;
    const uri = `bitcoin:${address}?amount=${btcAmount}`;
    
    window.open(uri); // Opens user's Bitcoin wallet
  };
  
  return <button onClick={handleZap}>Zap On-Chain</button>;
}
```

## Comparison: Lightning vs On-Chain Zaps

| Feature | Lightning (NIP-57) | On-Chain |
|---------|-------------------|----------|
| Speed | Instant | 10-60 min confirmation |
| Fees | ~1 sat | Variable (market rate) |
| Privacy | Route-based | Public ledger |
| Setup | LNURL required | None (npub = address) |
| Max amount | Channel limited | Unlimited |
| Offline receive | No | Yes |
| Proof | Zap receipt (kind 9735) | On-chain transaction |

## Best Practices

### For Senders

1. **Check for Lightning first** - If recipient has lud16, use Lightning
2. **Confirm large amounts** - On-chain is permanent
3. **Consider fees** - Batch if sending to multiple recipients
4. **Use Silent Payments** - When privacy matters

### For Recipients

1. **Monitor your address** - Funds may arrive unexpectedly
2. **Consider privacy** - Your on-chain history becomes public
3. **Set up Lightning too** - Offer both options
4. **Use separate keys** - Consider derived keys for large holdings

## See Also

- [Taproot Wallets](/wallets/taproot) - Understanding P2TR
- [Lightning Zaps](/payments/zaps) - NIP-57 Lightning payments
- [On-Chain Payments](/payments/onchain) - General on-chain guide
- [NIP-17](https://github.com/nostr-protocol/nips/blob/master/17.md) - Private DMs for notifications

---

:::tip The Simplest Path
On-chain zaps are the most direct expression of "Nostr is Taproot Native" - your identity IS your wallet. While Lightning remains best for most zaps, on-chain opens the door to anyone with Bitcoin, no setup required.
:::
