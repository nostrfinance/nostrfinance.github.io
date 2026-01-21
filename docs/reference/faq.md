---
sidebar_position: 3
title: FAQ
description: Frequently asked questions about Nostr finance
---

# Frequently Asked Questions

Common questions about finance on Nostr.

## General

### What is Nostr?

Nostr (Notes and Other Stuff Transmitted by Relays) is an open protocol for decentralized, censorship-resistant communication. It uses public-key cryptography for identity and messages are transmitted through relays.

### Is Nostr a cryptocurrency?

No. Nostr is a communication protocol, not a cryptocurrency. However, it integrates with Bitcoin and Lightning Network for payments.

### How is Nostr related to Bitcoin?

Nostr and Bitcoin:
- Use the same cryptography (secp256k1)
- Are both decentralized protocols
- Complement each other (communication + value)
- Share similar philosophies

## Payments

### What are zaps?

Zaps are Lightning Network payments tied to Nostr events. When you "zap" someone, you send them Bitcoin via Lightning while creating a public receipt on Nostr.

### How do I send zaps?

1. Set up a Lightning wallet (like Alby)
2. Connect it to your Nostr client via NWC
3. Click the lightning bolt on any post
4. Choose an amount and confirm

### Can I receive zaps without running a node?

Yes! You can use custodial services like Alby or get a Lightning address from various providers. You don't need to run your own node.

### What are NutZaps?

NutZaps are Cashu eCash payments sent via Nostr. They offer more privacy than Lightning zaps since amounts can be hidden.

### Are zaps public?

Yes, standard zaps are public. The amount, sender, and recipient are visible on Nostr. For privacy, consider NutZaps.

## Wallets

### What is NWC (Nostr Wallet Connect)?

NWC is a protocol that lets Nostr apps communicate with Lightning wallets. You generate a connection string in your wallet and paste it into apps to enable payments.

### Which wallet should I use?

For beginners:
- **Alby** - Easy browser extension
- **Primal** - Built-in wallet

For more control:
- **Alby Hub** - Self-custodial
- **Zeus** - Mobile with node connection

### Is Cashu custodial?

Yes, Cashu mints are custodial - they hold the Bitcoin backing your tokens. Only use amounts you're comfortable risking with any given mint.

### Can I use hardware wallets with Nostr?

Hardware wallet integration is still developing. Some projects are working on Ledger apps for Nostr key management.

## Privacy

### How private are Nostr payments?

| Payment Type | Privacy Level |
|--------------|---------------|
| Zaps | Low (public amounts) |
| Anonymous Zaps | Medium (sender hidden) |
| NutZaps | Higher (amounts can be hidden) |
| Direct Lightning | Varies by route |

### Can I use Nostr anonymously?

You can create anonymous accounts easily. However, if you tie them to payments or other identifying data, privacy decreases.

### Does the relay see my payments?

Relays see encrypted NWC messages but can't read contents. They see zap receipts as public events.

## Security

### How do I protect my keys?

- **Never share your nsec** (private key)
- Use NIP-07 extensions for signing
- Store backups offline
- Consider hardware wallets for large amounts

### What if I lose my keys?

There's no recovery option. If you lose your private key:
- You lose access to that identity
- Any funds tied to it are lost
- You'll need to create a new identity

### Can someone steal my Bitcoin through Nostr?

Your Nostr private key doesn't directly control Bitcoin. However:
- NWC connections have spending permissions
- Set budgets on NWC connections
- Revoke unused connections

## Technical

### What's the difference between NIP-15 and NIP-99?

**NIP-15**: Structured e-commerce with stalls, products, and defined order flow
**NIP-99**: Flexible classified listings for any type of offer

### Do I need to run a relay?

No, but it can be beneficial:
- Guaranteed access to your data
- Privacy from third parties
- Support the network

### How do I verify zap receipts?

```javascript
// Check:
// 1. Receipt signature is valid
// 2. Description contains valid zap request
// 3. Zap request signature is valid
// 4. Tags match between request and receipt
```

## Business

### Can I accept Bitcoin payments on Nostr?

Yes! You can:
- Add a Lightning address to your profile
- Set up a NIP-15 marketplace stall
- Create NIP-99 classified listings
- Accept direct Lightning payments

### Are there fees for zaps?

- No Nostr protocol fees
- Lightning routing fees (usually minimal)
- Some services may charge

### How do subscriptions work on Nostr?

NIP-88 (draft) defines recurring zaps for subscriptions. Not fully standardized yet, but some apps implement it.

## Comparison

### How does Nostr compare to Patreon?

| Feature | Nostr | Patreon |
|---------|-------|---------|
| Platform fee | 0% | 5-12% |
| Payment method | Bitcoin | Credit card |
| Censorship | Resistant | Platform controlled |
| Identity | Cryptographic | Email/password |

### Is Nostr better than Lightning apps?

They're complementary:
- Nostr = Social/identity layer
- Lightning = Payment layer

Together they're more powerful than either alone.

## Getting Help

### Where can I get support?

- Ask on Nostr (search for developers)
- GitHub issues on relevant repos
- Community channels

### How can I contribute?

- Improve documentation (like this site)
- Report bugs
- Build applications
- Run relays
- Donate to developers

---

:::tip More Questions?
Ask on Nostr! The community is helpful and developers are often directly accessible.
:::
