---
sidebar_position: 3
title: Schnorr Security
description: Nonce attacks, lattice vulnerabilities, and key safety
---

# Schnorr Security

Schnorr signatures are elegant and efficient, but unforgiving. A single nonce reuse or bias leaks your private key. This page covers the attacks and how to avoid them.

## How Schnorr Signing Works

A Schnorr signature on message `m` with private key `x`:

```
1. Generate random nonce k
2. Compute R = k·G (nonce point)
3. Compute e = H(R || P || m) (challenge)
4. Compute s = k + e·x (response)
5. Signature is (R, s)
```

Verification checks: `s·G = R + e·P`

The security hinges entirely on **nonce `k` being truly random and secret**.

## Nonce Reuse Attack

### The Attack

If you sign two different messages with the **same nonce k**:

```
Signature 1: (R, s₁) where s₁ = k + e₁·x
Signature 2: (R, s₂) where s₂ = k + e₂·x

Subtract:
s₁ - s₂ = e₁·x - e₂·x = (e₁ - e₂)·x

Solve for x:
x = (s₁ - s₂) / (e₁ - e₂)
```

**Private key recovered.** Attacker now controls your identity and funds.

### Real-World Examples

- **PlayStation 3 hack (2010)**: Sony reused the same k for all ECDSA signatures. Hackers extracted the private key and broke PS3 security.
- **Blockchain.info (2014)**: Bug caused nonce reuse, some users lost funds.

### Prevention

```javascript
// WRONG: predictable nonce
const k = hash(message); // Same message = same k!

// WRONG: weak random
const k = Math.random() * CURVE_ORDER; // Predictable

// RIGHT: RFC 6979 deterministic nonce
const k = deriveNonce(privateKey, message); // Deterministic but unique per message

// RIGHT: randomness + message binding
const k = hash(randomBytes(32) || privateKey || message);
```

**RFC 6979** is the standard: derive k deterministically from the private key and message. Same inputs = same k, but different messages = different k. No randomness needed (avoids RNG failures).

## Lattice Attacks

### Biased Nonces

Even if nonces aren't reused, **biased nonces** can leak the key.

If your nonce generation has any bias (e.g., certain bits are predictable), an attacker can collect many signatures and use **lattice reduction** to recover the private key.

### How It Works

Suppose the top 8 bits of k are always zero (a "short" nonce). Given ~100 signatures:

1. Set up a lattice problem from the signature equations
2. Use LLL or BKZ algorithm to find short vectors
3. Recover k values, then x

### Partial Nonce Leakage

Even leaking **a few bits** of each nonce is dangerous:

| Bits leaked per nonce | Signatures needed |
|----------------------|-------------------|
| 1 bit | ~200 |
| 2 bits | ~100 |
| 4 bits | ~50 |
| 8 bits | ~25 |

### Prevention

- Use **full 256-bit random nonces** or RFC 6979
- Never truncate or compress nonces
- Use constant-time implementations (no timing leaks)

## Implementation Pitfalls

### Timing Attacks

Variable-time operations leak information:

```javascript
// WRONG: branches on secret data
if (k > CURVE_ORDER / 2) {
  k = CURVE_ORDER - k;
}

// RIGHT: constant-time conditional
k = constantTimeSelect(k > CURVE_ORDER / 2, CURVE_ORDER - k, k);
```

### Side Channels

- **Power analysis**: Measure power consumption during signing
- **EM emissions**: Radio signals from CPU operations
- **Cache timing**: Memory access patterns

**Mitigation**: Use audited libraries with side-channel protections. Don't sign on shared/untrusted hardware.

### Bad Randomness

```javascript
// WRONG: system time
const k = Date.now();

// WRONG: predictable seed
const k = hash("nostr" + messageCount);

// WRONG: weak PRNG
Math.random(); // Not cryptographic!

// RIGHT: OS entropy
const k = crypto.getRandomValues(new Uint8Array(32));

// BEST: RFC 6979 (no RNG needed)
const k = rfc6979(privateKey, message);
```

## Nostr-Specific Concerns

### Event Signing

Every Nostr event is signed with Schnorr. If your client has bad nonce generation, you leak your nsec.

**Trust your client.** Use established clients with audited signing code:
- Check they use `@noble/curves` or similar
- Avoid experimental/unaudited implementations
- Never use browser extensions from unknown sources

### Multiple Devices

Signing from multiple devices increases risk:
- More implementations = more bug surface
- Clock/RNG issues on mobile devices
- Shared keys across security boundaries

### Key Rotation Doesn't Fix Bad Nonces

If you signed with biased nonces, rotating to a new key doesn't help - the old key is already compromised. Attacker can impersonate your old identity or steal funds sent to old P2TR addresses.

## Aggregated Signatures (MuSig)

Multi-party Schnorr (MuSig, MuSig2) has additional attack vectors:

### Rogue Key Attack

A malicious cosigner picks their pubkey to cancel out yours:

```
P_malicious = P_malicious' - P_honest
P_aggregate = P_honest + P_malicious = P_malicious'
```

**Mitigation**: MuSig2 requires proof-of-possession or key aggregation coefficients.

### Wagner's Attack

Parallel signing sessions can be exploited to forge signatures.

**Mitigation**: MuSig2 uses two-round signing with nonce commitments.

## Checklist

### For Users

- [ ] Use established clients/wallets
- [ ] Don't sign on untrusted devices
- [ ] Backup nsec securely (not on devices that sign)
- [ ] Use hardware wallets for high-value keys

### For Developers

- [ ] Use audited libraries (`@noble/curves`, `libsecp256k1`)
- [ ] Implement RFC 6979 or use library's default
- [ ] Never roll custom nonce generation
- [ ] Constant-time operations for secret data
- [ ] Test against known-answer vectors
- [ ] Consider hardware security modules for servers

## Libraries

| Library | Language | RFC 6979 | Audited |
|---------|----------|----------|---------|
| @noble/curves | JS/TS | Yes | Yes |
| secp256k1 (Bitcoin Core) | C | Yes | Yes |
| libsecp256k1-zkp | C | Yes | Yes |
| python-ecdsa | Python | Yes | Partial |

## See Also

- [RFC 6979: Deterministic ECDSA/Schnorr](https://tools.ietf.org/html/rfc6979)
- [BIP-340: Schnorr Signatures](https://github.com/bitcoin/bips/blob/master/bip-0340.mediawiki)
- [X-Only Pubkeys](/cryptography/x-only-pubkeys) - Lifting issues
- [Tweaks](/cryptography/tweaks) - Key derivation

---

:::danger Nonce Reuse = Key Loss
A single reused nonce exposes your private key instantly. There is no recovery. Use RFC 6979 or audited randomness - never roll your own nonce generation.
:::
