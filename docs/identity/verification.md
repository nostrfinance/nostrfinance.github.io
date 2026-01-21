---
sidebar_position: 2
title: Identity Verification
description: Verifying Nostr identities for finance
---

# Identity Verification on Nostr

Identity verification is crucial for financial applications. Nostr provides several mechanisms for establishing and verifying identity.

## Verification Methods

### NIP-05 Verification

Human-readable identity verification:

```
alice@example.com → Verifies alice owns pubkey
```

How it works:
1. Alice claims `alice@example.com` in profile
2. `example.com` hosts verification file
3. Clients check and display verification

#### Well-Known File

```
GET https://example.com/.well-known/nostr.json?name=alice
```

Response:
```json
{
  "names": {
    "alice": "b889ff5b1513b641e2a139f661a661364979c5beee91842f8f0ef42ab558e9d4"
  },
  "relays": {
    "b889ff5b1513b641e2a139f661a661364979c5beee91842f8f0ef42ab558e9d4": [
      "wss://relay.example.com"
    ]
  }
}
```

#### Profile Setup

```json
{
  "kind": 0,
  "content": "{\"name\":\"Alice\",\"nip05\":\"alice@example.com\"}"
}
```

### Web-of-Trust

Social verification through follows:
- Who do trusted accounts follow?
- Mutual follows indicate relationship
- Community vouching

```
Verification Score:
  - Followed by trusted accounts: +weight
  - Mutual follows: +weight
  - Account age: +weight
  - Content quality: +weight
```

### Verifiable Credentials

W3C-standard credentials:

```json
{
  "@context": ["https://www.w3.org/2018/credentials/v1"],
  "type": ["VerifiableCredential", "IdentityCredential"],
  "issuer": "did:nostr:<verifier_pubkey>",
  "credentialSubject": {
    "id": "did:nostr:<user_pubkey>",
    "name": "Alice Smith",
    "verified": true,
    "verificationLevel": "enhanced"
  }
}
```

## Financial Verification

### KYC Integration

For regulated services:

```
User                   KYC Provider              Service
  │                         │                        │
  │  1. Request verification│                        │
  │────────────────────────►│                        │
  │                         │                        │
  │  2. Complete KYC        │                        │
  │◄───────────────────────►│                        │
  │                         │                        │
  │  3. Receive credential  │                        │
  │◄────────────────────────│                        │
  │                         │                        │
  │  4. Present credential  │                        │
  │─────────────────────────┼───────────────────────►│
  │                         │                        │
  │  5. Verify & grant access                        │
  │◄────────────────────────┼────────────────────────│
```

### Proof of Reserves

For custodians:

```json
{
  "type": "ProofOfReserves",
  "issuer": "did:nostr:<custodian>",
  "timestamp": 1234567890,
  "reserves": {
    "btc": "100.5",
    "proof": "merkle_root_hash"
  }
}
```

### Credit Scoring

Decentralized reputation:
- Payment history (privacy-preserving)
- Platform reputation scores
- Community vouches

## Implementation

### Checking NIP-05

```javascript
async function verifyNip05(nip05, pubkey) {
  const [name, domain] = nip05.split('@');
  const url = `https://${domain}/.well-known/nostr.json?name=${name}`;

  const response = await fetch(url);
  const data = await response.json();

  return data.names[name] === pubkey;
}
```

### Web-of-Trust Score

```javascript
function calculateTrustScore(pubkey, trustedSet) {
  let score = 0;

  // Check follows from trusted accounts
  for (const trusted of trustedSet) {
    if (isFollowedBy(pubkey, trusted)) {
      score += FOLLOW_WEIGHT;
    }
    if (isMutualFollow(pubkey, trusted)) {
      score += MUTUAL_WEIGHT;
    }
  }

  // Account age factor
  const age = getAccountAge(pubkey);
  score += Math.min(age / 365, 1) * AGE_WEIGHT;

  return score;
}
```

### Verifying Credentials

```javascript
async function verifyCredential(credential) {
  // Check signature
  const issuerDid = credential.issuer;
  const proof = credential.proof;

  const issuerDoc = await resolveDid(issuerDid);
  const verificationMethod = issuerDoc.verificationMethod[0];

  return verifySignature(
    credential,
    proof.proofValue,
    verificationMethod.publicKey
  );
}
```

## Trust Levels

### For Financial Applications

| Level | Requirements | Capabilities |
|-------|--------------|--------------|
| **Basic** | Nostr pubkey | View, small zaps |
| **Verified** | NIP-05 | Medium transactions |
| **Enhanced** | KYC credential | Large transactions |
| **Premium** | Multiple verifications | Full access |

### Progressive Disclosure

```
Start: Anonymous (pubkey only)
  │
  ├─► Add NIP-05 → More trust
  │
  ├─► Social verification → More trust
  │
  └─► KYC credential → Maximum trust
```

## Privacy Considerations

### Selective Disclosure

Reveal only what's needed:
- Prove "over 18" without revealing birthdate
- Prove "in allowed jurisdiction" without exact location
- Prove "KYC'd" without revealing details

### Zero-Knowledge Proofs

Future direction:
- Prove properties without revealing data
- Privacy-preserving compliance
- Minimal information disclosure

## Best Practices

### For Services

1. **Start permissionless** - Basic features without verification
2. **Progressive verification** - Request more for higher risk
3. **Multiple methods** - Accept various proof types
4. **Privacy respect** - Minimize data collection

### For Users

1. **Set up NIP-05** - Basic verification
2. **Build social graph** - Follow trusted accounts
3. **Obtain credentials** - As needed for services
4. **Protect privacy** - Share minimally

## See Also

- [DID:Nostr](/identity/did-nostr)
- [Keys & Cryptography](/identity/keys)
- [NIP-05 Specification](https://github.com/nostr-protocol/nips/blob/master/05.md)

---

:::info Balance
Financial verification on Nostr balances the need for trust with the protocol's permissionless nature. Services can require more verification for higher-risk activities while maintaining basic access for everyone.
:::
