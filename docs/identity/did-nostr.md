---
sidebar_position: 1
title: DID:Nostr
description: Decentralized Identifiers for Nostr
---

# DID:Nostr - Decentralized Identifiers

The `did:nostr` method connects Nostr identities with the W3C Decentralized Identifier (DID) standard, enabling Nostr keypairs to participate in the broader decentralized identity ecosystem.

## What is DID:Nostr?

DID:Nostr provides:
- **W3C-compatible** identity format
- **Nostr keypair** as the root of trust
- **Verifiable credentials** support
- **Portable identity** across systems

```
did:nostr:<64-char-hex-pubkey>
     │         │
     │         └── Your Nostr public key (hex format)
     │
     └── DID method name
```

## DID Format

### Structure

```
did:nostr:b889ff5b1513b641e2a139f661a661364979c5beee91842f8f0ef42ab558e9d4
```

Note: Uses hex pubkey, not npub format.

### Conversion

```javascript
// npub to DID
const npub = "npub1hrz7lpwuuqvmv4fzwdvmwp2xfsxhgyjlwpjxhut9e3grvzce786sx2fylu";
const hex = nip19.decode(npub).data; // 64-char hex
const did = `did:nostr:${hex}`;

// DID to npub
const pubkey = did.replace('did:nostr:', '');
const npub = nip19.npubEncode(pubkey);
```

## DID Document

A DID Document describes the identity:

```json
{
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://w3id.org/security/multikey/v1"
  ],
  "id": "did:nostr:b889ff5b1513b641e2a139f661a661364979c5beee91842f8f0ef42ab558e9d4",
  "verificationMethod": [{
    "id": "did:nostr:b889ff5b1513b641e2a139f661a661364979c5beee91842f8f0ef42ab558e9d4#key-0",
    "type": "Multikey",
    "controller": "did:nostr:b889ff5b1513b641e2a139f661a661364979c5beee91842f8f0ef42ab558e9d4",
    "publicKeyMultibase": "z..."
  }],
  "authentication": [
    "did:nostr:...#key-0"
  ],
  "assertionMethod": [
    "did:nostr:...#key-0"
  ]
}
```

## Resolution Methods

### 1. Offline Resolution (Minimal)

Generate DID Document from pubkey alone:

```javascript
function resolveOffline(did) {
  const pubkey = did.replace('did:nostr:', '');
  return {
    id: did,
    verificationMethod: [{
      id: `${did}#key-0`,
      type: "Multikey",
      controller: did,
      publicKeyMultibase: toMultibase(pubkey)
    }],
    authentication: [`${did}#key-0`],
    assertionMethod: [`${did}#key-0`]
  };
}
```

### 2. HTTP Resolution

Check well-known endpoint:

```
GET https://domain.com/.well-known/did/nostr/<pubkey>.json
```

### 3. Relay Resolution

Query Nostr relays for enhanced data:
- Profile info (kind 0)
- Contact list (kind 3)
- Service endpoints

## Enhanced DID Document

With Nostr metadata:

```json
{
  "@context": [...],
  "id": "did:nostr:...",
  "verificationMethod": [...],
  "authentication": [...],
  "service": [{
    "id": "did:nostr:...#nostr-relays",
    "type": "NostrRelay",
    "serviceEndpoint": [
      "wss://relay.damus.io",
      "wss://nos.lol"
    ]
  }],
  "nostrProfile": {
    "name": "Alice",
    "about": "Nostr user",
    "picture": "https://...",
    "nip05": "alice@example.com",
    "timestamp": 1234567890
  },
  "follows": [
    "did:nostr:...",
    "did:nostr:..."
  ]
}
```

## Use Cases

### Verifiable Credentials

Issue credentials tied to Nostr identity:

```json
{
  "@context": ["https://www.w3.org/2018/credentials/v1"],
  "type": ["VerifiableCredential", "ProofOfHumanity"],
  "issuer": "did:nostr:<issuer_pubkey>",
  "credentialSubject": {
    "id": "did:nostr:<subject_pubkey>",
    "verified": true
  },
  "proof": {
    "type": "SchnorrSignature2023",
    "created": "2024-01-01T00:00:00Z",
    "verificationMethod": "did:nostr:...#key-0",
    "proofValue": "..."
  }
}
```

### Authentication

Use DID:Nostr for login:

1. Service requests proof of DID ownership
2. User signs challenge with Nostr key
3. Service verifies signature
4. User authenticated

### Cross-Platform Identity

Link Nostr identity to other systems:

```json
{
  "id": "did:nostr:...",
  "alsoKnownAs": [
    "did:web:example.com:users:alice",
    "did:key:z..."
  ]
}
```

## Finance Applications

### Payment Identity

DID:Nostr can include payment info:

```json
{
  "service": [{
    "id": "did:nostr:...#lightning",
    "type": "LightningAddress",
    "serviceEndpoint": "alice@getalby.com"
  }]
}
```

### Credential-Based Access

Gate financial services with verifiable credentials:

1. User presents DID
2. Service checks credentials
3. Access granted based on claims

### KYC Credentials

Issue compliance credentials:
- One-time verification
- Portable across services
- Privacy-preserving (selective disclosure)

## Implementations

### DID:Nostr Explorer

Web-based explorer:
- View DID documents
- Check profiles
- See social graph
- [nostrcg.github.io/did-nostr](https://nostrcg.github.io/did-nostr/)

### nostr.rocks Resolver

HTTP resolver:
- Well-known path resolution
- Compliant DID documents

### nostr-did-resolver

JavaScript library:
- Relay-based resolution
- TypeScript support
- [GitHub](https://github.com/block-core/nostr-did-resolver)

## Specification

### Status

The DID:Nostr specification is:
- Draft status
- W3C Nostr Community Group
- Active development

### Links

- [Specification](https://nostrcg.github.io/did-nostr/)
- [GitHub](https://github.com/nostrcg/did-nostr)
- [W3C Nostr CG](https://www.w3.org/community/nostr/)

## Example Code

### Resolving a DID

```javascript
import { Resolver } from 'did-resolver';
import { getResolver } from 'nostr-did-resolver';

const resolver = new Resolver(getResolver());

const result = await resolver.resolve(
  'did:nostr:b889ff5b1513b641e2a139f661a661364979c5beee91842f8f0ef42ab558e9d4'
);

console.log(result.didDocument);
```

### Creating Verifiable Presentation

```javascript
const presentation = {
  "@context": ["https://www.w3.org/2018/credentials/v1"],
  "type": ["VerifiablePresentation"],
  "holder": `did:nostr:${myPubkey}`,
  "verifiableCredential": [credential],
  "proof": await signWithNostr(presentationData)
};
```

---

:::tip Bridge to Web3
DID:Nostr bridges Nostr's social identity with the broader decentralized identity ecosystem, enabling interoperability with systems that speak the DID language.
:::
