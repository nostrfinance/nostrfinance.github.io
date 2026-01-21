---
sidebar_position: 3
title: Cashu eCash
description: Privacy-preserving digital cash on Bitcoin
---

# Cashu eCash

Cashu is a Chaumian eCash system built on Bitcoin, providing privacy-preserving digital cash with Lightning Network interoperability. When integrated with Nostr via [NIP-60](/nips/nip-60), it enables private payments and wallet portability.

## What is Cashu?

Cashu implements blind signatures to create bearer tokens:

```
Bitcoin/Lightning → Mint → eCash Tokens → Private Transfers → Redeem → Bitcoin/Lightning
```

### Key Properties

| Property | Description |
|----------|-------------|
| **Privacy** | Mint can't link minting to spending |
| **Instant** | No blockchain confirmation needed |
| **Low fees** | Minimal or no transaction fees |
| **Bearer** | Whoever holds tokens owns them |
| **Interoperable** | Works with Lightning Network |

## How Cashu Works

### Blind Signatures

```
1. User creates secret message
2. User blinds the message
3. Mint signs the blinded message
4. User unblinds to get valid signature
5. Mint can't link original message to signature
```

This process ensures:
- Mint verifies user paid
- Mint creates valid token
- Mint can't track token's journey

### Token Structure

Cashu tokens ("nuts") contain:
- Mint URL
- Proofs (cryptographic signatures)
- Amount
- Secret

```json
{
  "token": [{
    "mint": "https://mint.example.com",
    "proofs": [{
      "amount": 8,
      "secret": "secret_string",
      "C": "signature_point",
      "id": "keyset_id"
    }]
  }]
}
```

## Cashu on Nostr

### NIP-60: Cashu Wallets

NIP-60 defines how to store Cashu wallets on Nostr:

```
Wallet Info (kind 17375) → Wallet metadata
Token Proofs (kind 7375) → Encrypted tokens
Spending History (kind 7376) → Transaction log
```

Benefits:
- Wallet follows you across apps
- Encrypted with your Nostr key
- Accessible anywhere

### Wallet Event (kind 17375)

```json
{
  "kind": 17375,
  "content": "{encrypted wallet metadata}",
  "tags": [
    ["d", "wallet_id"],
    ["mint", "https://mint.example.com"],
    ["name", "My Cashu Wallet"]
  ]
}
```

### Token Event (kind 7375)

```json
{
  "kind": 7375,
  "content": "{encrypted cashu proofs}",
  "tags": [
    ["a", "17375:pubkey:wallet_id"]
  ]
}
```

## NutZaps

[NIP-61](/nips/nip-61) defines NutZaps - Cashu tokens as Nostr payments:

```
Sender mints P2PK tokens → Publishes NutZap → Recipient claims tokens
```

See [NutZaps documentation](/payments/nutzaps) for details.

## Setting Up Cashu

### Choose a Mint

Considerations:
- Reputation and longevity
- Geographic location
- Fee structure
- Liquidity

:::warning Mint Trust
Cashu mints are custodial. Only store amounts you're willing to risk with each mint.
:::

### Popular Mints

Research and verify before using:
- Check community recommendations
- Start with small amounts
- Test withdrawals work

### Wallet Options

| Wallet | Platform | Features |
|--------|----------|----------|
| Nutstash | Web | Full-featured |
| eNuts | Mobile | Easy to use |
| Minibits | Mobile | Nostr integration |
| Cashu.me | Web | Simple interface |

## Using Cashu

### Minting Tokens

1. Send Lightning payment to mint
2. Receive Cashu tokens
3. Tokens stored in wallet

```javascript
// Mint 1000 sats worth of tokens
const invoice = await mint.requestMint(1000);
// Pay the invoice
await payInvoice(invoice.pr);
// Claim tokens
const tokens = await mint.mintTokens(1000, invoice.hash);
```

### Sending Tokens

1. Select amount to send
2. Generate token string
3. Share with recipient
4. Recipient claims tokens

```javascript
// Create sendable tokens
const token = await wallet.send(1000);
// Token string to share
console.log(token.encoded);
// cashuAeyJ0b2...
```

### Receiving Tokens

1. Receive token string
2. Verify with mint
3. Swap for fresh tokens

```javascript
// Receive and swap tokens
await wallet.receive(tokenString);
```

### Redeeming to Lightning

1. Generate Lightning invoice
2. Request mint to pay
3. Receive payment

```javascript
// Withdraw to Lightning
const invoice = "lnbc1000n1...";
const result = await mint.melt(invoice);
```

## Privacy Features

### What's Hidden

- **From the mint**: Which tokens you spend (unlinkable)
- **From observers**: Transaction amounts (if designed well)
- **From network**: No public blockchain trace

### What's Visible

- **Mint**: Knows total deposits/withdrawals
- **Mint**: Could track patterns over time
- **Token holder**: Can prove ownership

### Enhancing Privacy

1. **Use multiple mints** - Spread trust
2. **Mix denominations** - Avoid patterns
3. **Swap frequently** - Fresh tokens
4. **Anonymous deposits** - Via Lightning

## Cashu vs Lightning

| Aspect | Lightning | Cashu |
|--------|-----------|-------|
| Privacy | Route visible | Mint-blind |
| Speed | Fast | Instant |
| Fees | Routing fees | Mint fees |
| Custody | Self possible | Mint custodial |
| Offline | No | Yes (send) |
| Denomination | Any | Fixed sets |

### When to Use Each

**Use Lightning when:**
- Self-custody is priority
- Large amounts
- Direct payments

**Use Cashu when:**
- Privacy is priority
- Small amounts
- Frequent transfers

## Development

### Libraries

- **cashu-ts** - TypeScript
- **cashu-rs** - Rust
- **cashu-ffi** - FFI bindings
- **cashu-python** - Python

### Example: Basic Wallet

```typescript
import { CashuMint, CashuWallet } from '@cashu/cashu-ts';

// Connect to mint
const mint = new CashuMint('https://mint.example.com');
const wallet = new CashuWallet(mint);

// Get mint info
const info = await mint.getInfo();
console.log('Mint:', info.name);

// Mint tokens
const { pr, hash } = await mint.requestMint(1000);
console.log('Pay this invoice:', pr);

// After payment, claim tokens
const proofs = await mint.mintTokens(1000, hash);
console.log('Received tokens:', proofs.length);
```

## Security Considerations

### Mint Risks

- **Rug pull** - Mint disappears with funds
- **Selective service** - Mint refuses redemption
- **Privacy leaks** - Mint tracks patterns

### Mitigation

1. **Small amounts** - Limit exposure
2. **Multiple mints** - Diversify risk
3. **Regular redemption** - Don't leave funds long
4. **Reputation** - Use known mints

### Token Security

- Tokens are bearer instruments
- Whoever has them can spend them
- Backup securely
- Don't share token strings publicly

## Resources

- [Cashu Protocol](https://cashu.space)
- [NIP-60 Specification](https://github.com/nostr-protocol/nips/blob/master/60.md)
- [cashu-ts Library](https://github.com/cashubtc/cashu-ts)
- [Cashu Documentation](https://docs.cashu.space)

---

:::tip Privacy Layer
Think of Cashu as a privacy layer for Bitcoin. It trades some trust (in mints) for enhanced privacy. Use it for amounts where privacy matters more than absolute security.
:::
