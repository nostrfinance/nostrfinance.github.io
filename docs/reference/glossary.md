---
sidebar_position: 1
title: Glossary
description: Terms and definitions for Nostr finance
---

# Glossary

Key terms and definitions used throughout Nostr finance.

## A

### Alby
Popular Bitcoin Lightning wallet with browser extension and NWC support. [Learn more →](/wallets/alby)

## B

### Bech32
Encoding format used for Nostr keys (npub, nsec) and Lightning invoices.

### Blocktrails
System for anchoring evolving state to Bitcoin using key tweaking. [Learn more →](/standards/blocktrails)

### BOLT11
Standard format for Lightning Network payment invoices.

## C

### Cashu
Chaumian eCash protocol built on Bitcoin for privacy-preserving payments. [Learn more →](/wallets/cashu)

### Channel (Lightning)
Payment pathway between two Lightning nodes enabling off-chain transactions.

### Client
Application that connects to Nostr relays to send and receive events.

## D

### DID (Decentralized Identifier)
W3C standard for decentralized identifiers. DID:Nostr uses Nostr keys as DIDs. [Learn more →](/identity/did-nostr)

## E

### eCash
Digital cash with privacy properties, implemented by Cashu on Bitcoin.

### Event
The fundamental data unit in Nostr - a signed JSON object.

## I

### Invoice
Lightning Network payment request containing amount and destination.

## K

### Kind
Numeric identifier for event types in Nostr (e.g., kind 1 = text note, kind 9735 = zap receipt).

## L

### Lightning Address
Human-readable payment address in email format (e.g., user@service.com).

### Lightning Network
Layer 2 scaling solution for Bitcoin enabling instant, low-fee payments. [Learn more →](/payments/lightning-network)

### LNURL
Protocol simplifying Lightning interactions (pay, withdraw, auth).

## M

### Millisatoshi (msat)
One thousandth of a satoshi, used for precise Lightning amounts.

### Mint
Cashu service that issues and redeems eCash tokens.

## N

### NIP (Nostr Implementation Possibility)
Specification documents defining how Nostr works. [Learn more →](/nips/overview)

### NIP-05
DNS-based identity verification for Nostr users (e.g., alice@example.com).

### NIP-07
Browser extension signing protocol for Nostr.

### NIP-47
Nostr Wallet Connect (NWC) specification. [Learn more →](/nips/nip-47)

### NIP-57
Lightning Zaps specification. [Learn more →](/nips/nip-57)

### NIP-60
Cashu wallet storage specification. [Learn more →](/nips/nip-60)

### NIP-61
NutZaps (eCash payments) specification. [Learn more →](/nips/nip-61)

### NIP-75
Zap Goals (crowdfunding) specification. [Learn more →](/nips/nip-75)

### Nostr
Notes and Other Stuff Transmitted by Relays - decentralized communication protocol.

### npub
Bech32-encoded Nostr public key (e.g., npub1abc...).

### nsec
Bech32-encoded Nostr private key. **Keep secret!**

### NutZap
Cashu eCash payment sent via Nostr. [Learn more →](/payments/nutzaps)

### NWC (Nostr Wallet Connect)
Protocol for connecting wallets to apps via Nostr. [Learn more →](/wallets/nwc)

## P

### P2PK (Pay to Public Key)
Locking mechanism where only the holder of a private key can spend.

### Preimage
Secret value revealed upon Lightning payment completion, serving as proof.

### Proof (Cashu)
Cryptographic token representing spendable eCash.

## R

### Relay
Server that stores and forwards Nostr events. [Learn more →](/infrastructure/relays)

### RGB
Smart contract protocol for Bitcoin using client-side validation. [Learn more →](/assets/rgb-protocol)

## S

### Satoshi (sat)
Smallest unit of Bitcoin (0.00000001 BTC). Named after Bitcoin's creator.

### secp256k1
Elliptic curve used by both Bitcoin and Nostr for cryptography.

### Stall
Merchant's store in NIP-15 marketplace protocol.

## T

### Taproot
Bitcoin upgrade enabling improved privacy and efficiency, used by Taproot Assets.

### Taproot Assets
Protocol for issuing assets on Bitcoin with Lightning support. [Learn more →](/assets/taproot-assets)

## V

### V4V (Value for Value)
Economic model where content is free and users voluntarily pay what they think it's worth.

### Verifiable Credential
W3C standard for cryptographically verifiable claims about identity.

## W

### Web Ledgers
Specification for mapping URIs to balances across platforms. [Learn more →](/standards/webledgers)

### WebLN
JavaScript API for Lightning wallet interactions in web browsers.

## Z

### Zap
Lightning Network payment tied to a Nostr event. [Learn more →](/payments/zaps)

### Zap Goal
Crowdfunding target funded via zaps (NIP-75). [Learn more →](/payments/crowdfunding)

### Zap Receipt
Nostr event (kind 9735) proving a zap payment occurred.

### Zap Request
Nostr event (kind 9734) initiating a zap payment.

---

:::tip Suggest Additions
Missing a term? [Contribute on GitHub](https://github.com/nostrfinance/nostrfinance.github.io) to help improve this glossary.
:::
