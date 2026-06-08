---
sidebar_position: 2
title: X-Only Public Keys
description: The 1-byte tradeoff and the lifting problem
---

# X-Only Public Keys

Both Nostr and Bitcoin Taproot use **x-only public keys** - 32 bytes instead of 33. This saves space but introduces the "lifting problem."

## Standard vs X-Only

A point on secp256k1 has coordinates (x, y). Traditional pubkeys encode both:

| Format | Size | Structure |
|--------|------|-----------|
| Uncompressed | 65 bytes | `04` + x (32) + y (32) |
| Compressed | 33 bytes | `02`/`03` + x (32) |
| **X-only** | 32 bytes | x (32) |

The prefix byte in compressed format indicates y's parity (even = `02`, odd = `03`).

X-only drops this prefix entirely.

## The Lifting Problem

For any x-coordinate on secp256k1, there are **two valid y values**: one even, one odd.

```
Given x, valid points are:
  P₁ = (x, y)      where y is even
  P₂ = (x, -y)     where -y is odd (mod p)
```

When you see only x, which point did the creator mean?

### Why This Matters

**Signature verification** needs the full point. If you lift to the wrong y:
- Verification fails
- Or worse, you verify against the wrong key

**Tweaking** compounds the problem:
- Tweak P₁, get P₁'
- Tweak P₂, get P₂'
- P₁' ≠ P₂' — different addresses!

## BIP-340's Solution

BIP-340 (Schnorr for Bitcoin) cuts the ambiguity:

> The public key is the x-coordinate of a point P on the curve whose y-coordinate is even.

**Always even y.** No ambiguity, no prefix byte needed.

### Negation Trick

What if your keypair has odd y? Negate the private key:

```python
if y is odd:
    private_key = curve_order - private_key
    # Now the corresponding pubkey has even y
```

The private key changes, but you control it, so this is fine.

### Code Example

```javascript
import { secp256k1 } from '@noble/curves/secp256k1';

function liftX(xHex) {
  // Lift x-only to full point, assuming even y (BIP-340)
  const x = BigInt('0x' + xHex);
  const P = secp256k1.ProjectivePoint.fromAffine(
    secp256k1.utils.liftX(x)
  );
  return P;
}

function ensureEvenY(privateKey) {
  const P = secp256k1.ProjectivePoint.BASE.multiply(privateKey);
  const y = P.toAffine().y;
  
  // If y is odd, negate the private key
  if (y % 2n !== 0n) {
    return secp256k1.CURVE.n - privateKey;
  }
  return privateKey;
}
```

## Implications for Nostr

Nostr inherits x-only from BIP-340. Your npub is 32 bytes of x-coordinate.

### Signing

When signing Nostr events:
1. Ensure your privkey corresponds to even-y pubkey
2. Sign per BIP-340 (Schnorr)
3. Verifiers lift your npub assuming even y

### Interop with Bitcoin

Same lifting rules. Your npub lifts to a P2TR internal key with even y.

```
npub1abc... → lift(x) → P2TR address bc1p...
```

## The Tradeoff

### Benefits

- **1 byte saved** per pubkey (33 → 32)
- **Simpler encoding** - no prefix parsing
- **Uniform format** - all pubkeys same size

### Costs

- **Lifting complexity** - must handle in every operation
- **Parity tracking** - tweaks need careful y-coordinate handling
- **Footgun potential** - easy to mess up in custom code

### Is It Worth It?

Debatable. The 1-byte savings is minimal. The complexity is real.

But Bitcoin chose it for Taproot, Nostr adopted BIP-340, and here we are. The workaround (always even y) is well-defined and battle-tested.

## Parity in Tweaks

When tweaking an x-only pubkey:

```python
# Lift to point (assuming even y)
P = lift(x)

# Compute tweak
t = hash(x || data)

# Apply tweak
P' = P + t*G

# P' might have odd y!
# For Taproot: the output key's parity is tracked separately
# For simple tweaks: may need to negate
```

Taproot handles this via the "parity bit" in control blocks. Simple tweaks need explicit handling.

## Libraries Handle This

Good news: mature libraries abstract the complexity.

| Library | Language | Handles Lifting |
|---------|----------|-----------------|
| @noble/curves | JS/TS | Yes |
| secp256k1-py | Python | Yes |
| libsecp256k1 | C | Yes |
| bitcoin-core/secp256k1 | C | Yes |

**Don't roll your own.** Use audited libraries that handle parity correctly.

## Common Pitfalls

### 1. Assuming Any Y Works

```javascript
// WRONG: random y choice
const P = new Point(x, computeY(x));

// RIGHT: always even y per BIP-340
const P = liftX(x); // library handles it
```

### 2. Forgetting Tweak Parity

```javascript
// WRONG: ignoring output parity
const tweakedPub = P.add(tweak.multiply(G));
const address = pubkeyToP2TR(tweakedPub.x);

// RIGHT: track parity for spending
const { pubkey, parity } = taprootTweak(P, tweak);
```

### 3. Signing with Wrong Parity

```javascript
// WRONG: signing without parity check
const sig = schnorrSign(msg, privkey);

// RIGHT: ensure even y before signing
const adjustedKey = ensureEvenY(privkey);
const sig = schnorrSign(msg, adjustedKey);
```

## See Also

- [BIP-340: Schnorr Signatures](https://github.com/bitcoin/bips/blob/master/bip-0340.mediawiki)
- [Schnorr Security](/cryptography/schnorr-security) - Nonce attacks
- [Tweaks](/cryptography/tweaks) - Key derivation

---

:::warning Use Libraries
X-only lifting is subtle. Unless you're implementing a cryptographic library, use existing tools that handle parity correctly. Rolling your own is a footgun.
:::
