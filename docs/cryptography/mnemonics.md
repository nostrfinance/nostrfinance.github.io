---
sidebar_position: 5
title: Mnemonics & Seeds
description: BIP-39 seed phrases and their relationship to nsec
---

# Mnemonics & Seeds

Most Bitcoin users backup their keys as **seed phrases** (12 or 24 words). Since Nostr uses the same cryptography, your seed phrase can derive your nsec - or your nsec can be your entire "seed."

## BIP-39 Seed Phrases

A seed phrase is a human-readable encoding of entropy:

| Words | Entropy | Security |
|-------|---------|----------|
| 12 | 128 bits | Strong |
| 24 | 256 bits | Maximum |

```
abandon abandon abandon abandon abandon abandon 
abandon abandon abandon abandon abandon about
```

This encodes 128 bits of randomness + 4-bit checksum.

### From Words to Seed

```javascript
import { mnemonicToSeedSync } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';

const mnemonic = "abandon abandon abandon ..."; // 12 or 24 words
const passphrase = ""; // Optional, often empty

// BIP-39: mnemonic → 512-bit seed
const seed = mnemonicToSeedSync(mnemonic, passphrase);
// seed is 64 bytes
```

The passphrase is sometimes called the "25th word" - it's optional but adds another factor.

## Seed to Nostr Key

### Direct Derivation (Simple)

The simplest approach: hash the seed to get a 32-byte private key.

```javascript
import { sha256 } from '@noble/hashes/sha256';

function seedToNsec(seed) {
  // Hash seed to get 32-byte private key
  const privkey = sha256(seed);
  return privkey;
}
```

**Pros**: Dead simple, one step.  
**Cons**: Non-standard, not interoperable.

### BIP-32 Derivation (Standard)

The "proper" way uses hierarchical derivation:

```javascript
import { HDKey } from '@scure/bip32';

function seedToNostrKey(seed, path = "m/44'/1237'/0'/0/0") {
  const master = HDKey.fromMasterSeed(seed);
  const derived = master.derive(path);
  return derived.privateKey;
}
```

**Path components**:
- `44'` - BIP-44 purpose
- `1237'` - Nostr coin type (registered)
- `0'` - Account
- `0` - External chain
- `0` - Address index

### The Path Debate

Some argue against a dedicated Nostr path:

| Approach | Path | Argument |
|----------|------|----------|
| Dedicated | m/44'/1237'/... | "Nostr-specific derivation" |
| Bitcoin | m/86'/0'/... | "Same keys, Taproot native" |
| Direct hash | N/A | "Why complicate it?" |

**Our take**: If your npub IS your Bitcoin key, why derive separately? Use the same key for both, or just use nsec directly.

## nsec as Seed

You don't need a mnemonic at all. Your nsec IS 32 bytes of entropy:

```
nsec → 32 bytes → full private key
```

### Converting nsec to Mnemonic

If you want a word backup of your nsec:

```javascript
import { entropyToMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { nip19 } from 'nostr-tools';

function nsecToMnemonic(nsec) {
  const { data: privkey } = nip19.decode(nsec);
  // 32 bytes = 256 bits = 24 words
  return entropyToMnemonic(privkey, wordlist);
}

function mnemonicToNsec(mnemonic) {
  const entropy = mnemonicToEntropy(mnemonic, wordlist);
  return nip19.nsecEncode(entropy);
}
```

This gives you 24 words that directly encode your nsec - no derivation path needed.

### Tradeoff

| Method | Words | Derives | Interop |
|--------|-------|---------|---------|
| nsec as entropy | 24 | Direct | Nostr only |
| BIP-39 + path | 12-24 | Via BIP-32 | Wallet standard |

For Nostr-only use, nsec-as-entropy is simpler. For Bitcoin interop, BIP-39 + derivation may help with existing wallet recovery flows.

## Passphrase Considerations

BIP-39 passphrases add security but also risk:

```javascript
// Empty passphrase (common)
const seed1 = mnemonicToSeedSync(mnemonic, "");

// With passphrase (more secure)
const seed2 = mnemonicToSeedSync(mnemonic, "my secret passphrase");

// seed1 ≠ seed2 - completely different keys!
```

**Danger**: Forget the passphrase = lose access. No recovery possible.

**Benefit**: Attacker finds your mnemonic but not passphrase = still safe.

## Backup Strategies

### Option 1: Mnemonic Only

- Write down 12-24 words
- Store securely (safe, bank box, split locations)
- Remember derivation path (or use direct-from-entropy)

### Option 2: nsec Directly

- Encode nsec as 24 words (direct entropy)
- No derivation path to remember
- Simpler mental model

### Option 3: Encrypted Digital

- Encrypt nsec with strong password
- Store encrypted blob
- Risk: password management

### Metal Backups

For maximum durability:
- Stamp words into steel plates
- Survives fire, flood, time
- Products: Cryptosteel, Billfodl, etc.

## Testnet Considerations

For testing, generate separate keys:

```javascript
// Never use mainnet mnemonics on testnet code
const testMnemonic = generateMnemonic(wordlist, 128);
const testNsec = mnemonicToNsec(testMnemonic);
```

Testnet keys should be disposable. Don't derive from your real seed.

## Common Mistakes

### 1. Screenshot Mnemonics

```
❌ Phone screenshot of seed words
❌ Cloud-synced notes
❌ Email to yourself
```

These are immediately compromised if any device is breached.

### 2. Forgetting Passphrase

```
Mnemonic: abandon abandon abandon ... about
Passphrase: ??? (forgotten)
Result: Funds/identity lost forever
```

If using a passphrase, back it up separately but securely.

### 3. Wrong Derivation Path

```javascript
// Generated with:
const key1 = derive("m/44'/1237'/0'/0/0");

// Recovering with:
const key2 = derive("m/44'/0'/0'/0/0"); // WRONG PATH

// key1 ≠ key2 - different keys!
```

Document your derivation path with your mnemonic backup.

### 4. Partial Backups

```
✓ abandon abandon abandon
✓ abandon abandon abandon  
✓ abandon abandon abandon
✗ (missing last 3 words)
```

12-word mnemonic with 3 words missing = 2048³ = 8 billion possibilities. Recoverable with effort, but don't rely on it.

## See Also

- [BIP-39: Mnemonic Code](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)
- [BIP-32: HD Wallets](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki)
- [Schnorr Security](/cryptography/schnorr-security) - Protect your keys
- [Taproot Wallets](/wallets/taproot) - Using keys for Bitcoin

---

:::info One Key, One Backup
Whether you use a mnemonic or nsec directly, the goal is the same: securely backup 32 bytes of entropy. Everything else derives from that. Lose it = lose everything.
:::
