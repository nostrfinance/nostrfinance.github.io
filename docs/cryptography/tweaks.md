---
sidebar_position: 4
title: Key Tweaks
description: Simple tweaks, Taproot tweaks, and domain separation
---

# Key Tweaks

A "tweak" derives a new keypair from an existing one. The owner can spend from the tweaked key, but outsiders can't link it back to the original. Tweaks are foundational to Taproot and useful for Nostr privacy.

## What Is a Tweak?

Given a keypair (x, P) where P = x·G:

```
tweak = H(P || data)           # Hash to scalar
P' = P + tweak·G               # Tweaked pubkey
x' = x + tweak                 # Tweaked privkey
```

The new keypair (x', P') is mathematically related but visually unlinkable.

**Key property**: Knowing x and the tweak, you can compute x' and spend. Without x, knowing the tweak doesn't help.

## Simple Tweaks

The simplest form: hash the pubkey with a domain string.

```javascript
import { sha256 } from '@noble/hashes/sha256';
import { secp256k1 } from '@noble/curves/secp256k1';

function simpleTweak(pubkeyHex, domain) {
  // Compute tweak scalar
  const tweakBytes = sha256(
    Buffer.concat([
      Buffer.from(pubkeyHex, 'hex'),
      Buffer.from(domain)
    ])
  );
  const tweak = BigInt('0x' + Buffer.from(tweakBytes).toString('hex'));
  
  // Apply to pubkey: P' = P + tweak·G
  const P = secp256k1.ProjectivePoint.fromHex(pubkeyHex);
  const tweakPoint = secp256k1.ProjectivePoint.BASE.multiply(tweak);
  const tweakedPub = P.add(tweakPoint);
  
  return {
    pubkey: tweakedPub.toHex(),
    tweak: tweakBytes
  };
}

function derivePrivkey(privkey, tweakBytes) {
  // x' = x + tweak (mod n)
  const tweak = BigInt('0x' + Buffer.from(tweakBytes).toString('hex'));
  const x = BigInt('0x' + privkey);
  const xPrime = (x + tweak) % secp256k1.CURVE.n;
  return xPrime.toString(16).padStart(64, '0');
}
```

### Use Cases

| Domain String | Purpose |
|---------------|---------|
| `"nostr-zap"` | On-chain zap addresses |
| `"nostr-dm"` | Encryption keypairs |
| `sender || recipient` | Sender-specific addresses |

## Taproot Tweaks (BIP-341)

Taproot tweaks commit to a script tree:

```
tweak = H_taptweak(P || merkle_root)
Q = P + tweak·G
```

Where:
- `P` is the internal pubkey
- `merkle_root` is the root of the script tree (or empty for keypath-only)
- `Q` is the output pubkey (appears in bc1p... address)

### Keypath vs Scriptpath

| Path | When Used | Privacy |
|------|-----------|---------|
| Keypath | Single signature | Scripts hidden |
| Scriptpath | Complex conditions | Reveals used script only |

**Keypath spending** looks identical regardless of what scripts exist. The script tree is only revealed if you use it.

### Parity Handling

Taproot requires careful parity tracking:

```javascript
function taprootTweak(internalPubkey, merkleRoot) {
  // Per BIP-341: if P has odd y, negate before tweaking
  const P = liftX(internalPubkey);
  const parity = P.y % 2n !== 0n;
  
  const tweak = taggedHash('TapTweak', 
    internalPubkey + (merkleRoot || '')
  );
  
  const Q = P.add(G.multiply(tweak));
  
  return {
    outputPubkey: Q.x, // x-only
    parity: Q.y % 2n !== 0n,
    tweak
  };
}
```

The parity is stored in the control block for scriptpath spends.

## Domain Separation

Tweaks should use **tagged hashes** to prevent cross-protocol attacks:

```javascript
function taggedHash(tag, data) {
  const tagHash = sha256(tag);
  return sha256(Buffer.concat([tagHash, tagHash, data]));
}

// Different domains = different tweaks even with same data
taggedHash('TapTweak', data);    // For Taproot
taggedHash('NostrZap', data);    // For Nostr on-chain
taggedHash('SilentPayment', data); // For BIP-352
```

**Why it matters**: Without domain separation, a tweak intended for one purpose could be exploited in another context.

## Sender-Specific Tweaks

For on-chain zaps with better privacy:

```javascript
function senderTweak(senderPub, recipientPub) {
  return sha256(Buffer.concat([
    Buffer.from(senderPub, 'hex'),
    Buffer.from(recipientPub, 'hex'),
    Buffer.from('nostr-zap-v1')
  ]));
}

// Each sender→recipient pair gets unique address
const tweak = senderTweak(alicePub, bobPub);
const bobAddressForAlice = applyTweak(bobPub, tweak);
```

**Recipient recovery**: Bob tries all known sender pubkeys to find payments. Or Alice notifies via NIP-17 DM.

## Tweak Chains

Tweaks can be chained for hierarchical derivation:

```javascript
// Master → Purpose → Account → Address
const purpose = simpleTweak(master, 'purpose-0');
const account = simpleTweak(purpose.pubkey, 'account-0');
const address = simpleTweak(account.pubkey, 'address-0');
```

This resembles HD wallets but without BIP-32's complexity.

## Security Considerations

### Tweak Must Be Unpredictable

If an attacker can predict your tweak:
- They can compute your tweaked pubkey (surveillance)
- With enough signatures, lattice attacks may apply

**Use cryptographic hashes** with secret or unpredictable inputs.

### Don't Reuse Tweaks

Like nonces, tweak reuse can leak information:

```javascript
// WRONG: same tweak for different keys
const tweak = sha256('static-domain');
const addr1 = applyTweak(key1, tweak);
const addr2 = applyTweak(key2, tweak);
// addr1 - addr2 = key1 - key2 (linkable!)

// RIGHT: include the key in tweak computation
const tweak1 = sha256(key1 + 'domain');
const tweak2 = sha256(key2 + 'domain');
```

### Parity Footguns

X-only pubkeys + tweaks = parity complexity:

```javascript
// WRONG: ignoring parity
const tweaked = P.add(tweak.multiply(G));
const address = encode(tweaked.x);
// Might be unspendable if parity is wrong!

// RIGHT: track and handle parity
const { pubkey, parity } = taprootTweak(P, merkleRoot);
// Store parity for spending
```

## Comparison: Tweaks vs HD Derivation

| Aspect | Simple Tweaks | BIP-32 HD |
|--------|--------------|-----------|
| Spec complexity | Low | High |
| Hardened derivation | Via hash input | Native support |
| Chain codes | Not needed | 32 extra bytes |
| Cross-compatibility | Custom | Wallet standard |
| Backup | Original key + domains | Master seed |

For Nostr, simple tweaks are often sufficient. BIP-32 adds complexity without clear benefit when your identity IS your key.

## See Also

- [BIP-341: Taproot](https://github.com/bitcoin/bips/blob/master/bip-0341.mediawiki)
- [X-Only Pubkeys](/cryptography/x-only-pubkeys) - Parity handling
- [On-Chain Zaps](/payments/onchain-zaps) - Tweaks for privacy
- [Silent Payments](/cryptography/silent-payments) - Advanced privacy

---

:::tip Tweaks Enable Privacy
A single npub can generate unlimited unlinkable addresses via tweaks. The tradeoff: you need to track which tweaks were used, or use a notification system like NIP-17.
:::
