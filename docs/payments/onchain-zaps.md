---
sidebar_position: 4
title: On-Chain Zaps
description: Bitcoin tips directly to Nostr identities
---

# On-Chain Zaps

On-chain zaps enable direct Bitcoin transfers to any Nostr user without Lightning Network intermediaries. By leveraging the shared cryptography between Nostr and Bitcoin Taproot, you can send Bitcoin to anyone's npub - whether they're ready to receive or not.

## Why On-Chain Zaps Matter

On-chain zaps embrace what makes Nostr special: **your npub is already a Bitcoin address**. No intermediaries, no setup, no permission needed.

| Aspect | Lightning Zaps | On-Chain Zaps |
|--------|---------------|---------------|
| Recipient setup | LNURL, Lightning address, wallet config | **None** - npub is enough |
| Sender setup | Funded channels, liquidity management | Any Bitcoin wallet |
| Availability | Recipient online, channels open | Funds wait on-chain |
| Amount limits | Channel capacity constraints | Unlimited |
| Permanence | Relay-dependent receipts | **Blockchain-secured** |
| Privacy | Route-based (good) | Configurable (raw → tweaked → silent) |

Lightning has its place for high-frequency micropayments, but on-chain is the **native** path - same cryptography, no layers between.

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

### Choosing Your Privacy Level

| Use Case | Recommended Approach |
|----------|---------------------|
| Public tips (attribution wanted) | Raw npub → P2TR |
| Moderate privacy | Tweaked keys |
| High privacy | Silent Payments + NIP-17 |

### When On-Chain Shines

- **Any amount** - No channel capacity limits
- **No recipient setup** - Works for any npub, even if they've never configured payments
- **Permanent proof** - Blockchain receipt, not relay-dependent
- **True self-custody** - No intermediary nodes
- **Offline receiving** - Funds arrive whether recipient is online or not

### When Lightning May Fit

- Sub-second settlement needed
- Very high frequency (dozens per day)
- Recipient has reliable Lightning infrastructure

## Simple Tweaks: A Privacy Middle Ground

Between raw npub derivation (fully public) and Silent Payments (complex), there's a practical middle ground: **tweaked keys**.

### The Problem with Raw Derivation

```
npub1abc... → bc1pabc...
```

Anyone can compute this mapping. Your npub becomes a transparent window into your Bitcoin holdings.

### Tweaked Key Approach

Instead of deriving P2TR directly from the raw npub, apply a tweak:

```javascript
import { sha256 } from '@noble/hashes/sha256';
import { secp256k1 } from '@noble/curves/secp256k1';

function tweakedP2TR(npubHex, tweakData = 'nostr-zap') {
  // Compute tweak: H(pubkey || domain)
  const tweak = sha256(
    Buffer.concat([
      Buffer.from(npubHex, 'hex'),
      Buffer.from(tweakData)
    ])
  );
  
  // Tweaked pubkey: P' = P + tweak*G
  const pubPoint = secp256k1.ProjectivePoint.fromHex(npubHex);
  const tweakPoint = secp256k1.ProjectivePoint.BASE.multiply(
    BigInt('0x' + Buffer.from(tweak).toString('hex'))
  );
  const tweakedPub = pubPoint.add(tweakPoint);
  
  // Derive P2TR from tweaked key
  return deriveP2TR(tweakedPub.toHex());
}
```

### Privacy Tradeoff Spectrum

| Approach | Privacy | Complexity | Recipient Setup |
|----------|---------|------------|-----------------|
| Raw npub → P2TR | None | Trivial | None |
| **Tweaked key** | Moderate | Low | Know the tweak |
| Silent Payments | High | Moderate | Wallet support |
| Fresh key per tx | Maximum | High | Per-tx coordination |

### How Tweaks Help

1. **Address unlinkability**: `bc1p-tweaked` can't be trivially mapped back to `npub1...`
2. **Still spendable**: Owner knows their nsec + tweak, can derive the spending key
3. **Deterministic**: Same sender + recipient + tweak = same address (good for recurring)
4. **No scanning**: Unlike Silent Payments, no blockchain scanning needed

### Sender-Specific Tweaks

For better privacy, use sender-specific tweaks:

```javascript
// Sender includes their pubkey in the tweak
const tweak = sha256(senderPubkey + recipientPubkey + 'zap');
// Now each sender→recipient pair has a unique address
```

The recipient can try known sender pubkeys to find payments, or senders notify via NIP-17 DM.

## Silent Payments: Privacy-Enhanced On-Chain

For maximum privacy, **Silent Payments** (BIP-352) combined with Nostr notifications solve address reuse:

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
| Fees | ~1 sat (but channel costs) | Market rate (often under $1) |
| Privacy | Route-based | Configurable (tweaks/silent) |
| Setup | LNURL + wallet + channels | **None** (npub = address) |
| Max amount | Channel limited | **Unlimited** |
| Offline receive | No (must be online) | **Yes** |
| Proof | Relay-dependent receipt | **Blockchain-permanent** |
| Complexity | High (liquidity mgmt) | Low (just Bitcoin) |
| Native to Nostr | No (separate system) | **Yes** (same keys) |

## Testing on Testnet

On-chain zaps are perfect for testnet experimentation - same cryptography, zero risk.

### Why Use Testnet

| Benefit | Description |
|---------|-------------|
| **Free coins** | Faucets provide test sats |
| **Same code paths** | Identical derivation logic |
| **Safe iteration** | Mistakes cost nothing |
| **Client testing** | Verify UX before mainnet |

### Deriving Testnet Addresses

```javascript
import { payments, networks } from 'bitcoinjs-lib';

function npubToTestnetP2TR(npubHex) {
  const { address } = payments.p2tr({
    internalPubkey: Buffer.from(npubHex, 'hex'),
    network: networks.testnet  // tb1p... address
  });
  return address;
}
```

### Testnet4 Faucets

**Testnet4** is the current recommended testnet - more stable than testnet3, actively maintained.

- [mempool.space/testnet4/faucet](https://mempool.space/testnet4/faucet) - Mempool faucet
- [coinfaucet.eu](https://coinfaucet.eu/en/btc-testnet4/) - Coinfaucet
- [faucet.testnet4.dev](https://faucet.testnet4.dev/) - Testnet4.dev
- [testnet4.info](https://testnet4.info/) - Testnet4.info

See [awesome-testnet4](https://github.com/testnet4/awesome-testnet4) for more resources.

### Testnet3 (Legacy)

Still works, but testnet4 is preferred:
- [coinfaucet.eu/btc-testnet](https://coinfaucet.eu/en/btc-testnet/) - Testnet3

### Which Network?

| Network | Status | Best For |
|---------|--------|----------|
| **Testnet4** | Current | All testing (recommended) |
| Testnet3 | Legacy | Existing integrations |
| Regtest | Local | Development |

## Proof of Publication

An underappreciated property: on-chain zaps create **immutable, timestamped proof** that a payment was made to a specific Nostr identity.

### What You Get

```mermaid
flowchart LR
    tx["Bitcoin Transaction"]
    tx --> block["Block #850,000<br/>Timestamp: 2026-06-08"]
    tx --> output["Output: bc1pabc..."]
    output --> npub["Provably linked to<br/>npub1abc..."]
```

The blockchain permanently records:
- **When**: Block timestamp (unforgeable)
- **How much**: Exact satoshi amount
- **To whom**: P2TR address → npub mapping is deterministic

### Use Cases for Proof of Publication

| Use Case | How It Helps |
|----------|--------------|
| **Provable donations** | "I donated X sats to @developer on date Y" |
| **Grant accountability** | Public record of fund distribution |
| **Patronage history** | Verifiable support timeline |
| **Contract payments** | Timestamped proof of payment |
| **Dispute resolution** | Immutable payment evidence |

### Verification

Anyone can verify a claimed on-chain zap:

```javascript
function verifyOnChainZap(txid, npub, expectedAmount) {
  // 1. Fetch transaction from any block explorer
  const tx = await fetchTransaction(txid);
  
  // 2. Derive expected address from npub
  const expectedAddress = npubToP2TR(npub);
  
  // 3. Check outputs
  const matchingOutput = tx.outputs.find(
    o => o.address === expectedAddress && o.value >= expectedAmount
  );
  
  return {
    verified: !!matchingOutput,
    blockHeight: tx.blockHeight,
    timestamp: tx.blockTime,
    amount: matchingOutput?.value
  };
}
```

### Contrast with Lightning

| Aspect | Lightning Zap | On-Chain Zap |
|--------|--------------|--------------|
| Public proof | Zap receipt (kind 9735) | Blockchain tx |
| Immutability | Relay-dependent | Bitcoin-secured |
| Timestamp | Event created_at | Block timestamp |
| Verifiable by | Nostr users | Anyone with internet |
| Permanence | Relay retention | Forever |

Lightning zap receipts are Nostr events - they can be lost if relays purge data. On-chain transactions are permanent.

### Combining Both

For important payments, do both:
1. **On-chain zap** → Permanent blockchain proof
2. **Nostr announcement** → Social visibility

```json
{
  "kind": 1,
  "content": "Just supported @developer with an on-chain zap! 🔗",
  "tags": [
    ["p", "developer_npub"],
    ["r", "https://mempool.space/tx/abc123..."]
  ]
}
```

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

## Further Reading

- [On-Chain Zaps in Ditto](https://soapbox.pub/blog/onchain-zaps-in-ditto) - The original Soapbox article that started it all
- [On-Chain Infrastructure](/payments/onchain) - PSBT, multisig, escrow
- [Taproot Wallets](/wallets/taproot) - Understanding P2TR
- [Key Tweaks](/cryptography/tweaks) - Privacy via derived keys
- [P2P Trading](/payments/p2p-trading) - Fiat on/off ramps
- [NIP-17](https://github.com/nostr-protocol/nips/blob/master/17.md) - Private DMs for notifications

---

:::tip The Native Path
On-chain zaps are the purest expression of "Nostr is Taproot Native" - your identity IS your wallet. No channels to manage, no liquidity to worry about, no LNURL to configure. Just Bitcoin, the way it was designed.
:::
