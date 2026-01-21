---
sidebar_position: 1
title: Wallets Overview
description: Bitcoin and Lightning wallets for Nostr
---

# Nostr Wallets Overview

Wallets are essential for Nostr finance - they hold your Bitcoin and enable payments. Because Nostr is **Taproot native**, your Nostr keys can directly control Bitcoin.

## The Taproot Connection

Your Nostr keypair uses the same cryptography as Bitcoin Taproot (secp256k1):

```
Your nsec (private key) → Signs Nostr events AND Bitcoin transactions
Your npub (public key) → Your identity AND your P2TR address
```

This means you can hold Bitcoin directly with your Nostr identity - no separate wallet required for on-chain.

## Wallet Types

### By Custody Model

| Type | Control | Security | Ease of Use |
|------|---------|----------|-------------|
| **Custodial** | Third party | Lower | Easiest |
| **Self-custodial** | You | Higher | Moderate |
| **Hardware** | You + device | Highest | Advanced |

### By Integration Level

| Level | Description | Examples |
|-------|-------------|----------|
| **Native** | Built into Nostr client | Primal, Damus built-in |
| **Connected** | Via NWC protocol | Alby, Zeus via NWC |
| **Taproot Direct** | Using Nostr keys | P2TR from npub |

## Recommended Wallets

### For Beginners

#### Alby (Browser Extension)
- Easy setup
- Browser integration
- NWC support
- [Get Alby →](/wallets/alby)

#### Primal (Built-in)
- No separate wallet needed
- Automatic setup
- Mobile + web
- [primal.net](https://primal.net)

### For Power Users

#### Alby Hub (Self-Custodial)
- Your own Lightning node
- Full control
- Advanced features
- [albyhub.com](https://albyhub.com)

#### Zeus (Mobile)
- Connect to your node
- Self-custodial
- NWC support
- [zeusln.app](https://zeusln.app)

### For On-Chain / Taproot

#### Sparrow Wallet
- Full Taproot support
- Import Nostr keys
- PSBT support
- [sparrowwallet.com](https://sparrowwallet.com)

#### Hardware Wallets
- Ledger, Trezor, Coldcard
- P2TR support
- Maximum security
- [Learn more →](/wallets/taproot)

## Connection Methods

### Nostr Wallet Connect (NWC)

The standard way to connect wallets to Nostr apps:

```
nostr+walletconnect://[pubkey]?relay=[relay]&secret=[secret]
```

Benefits:
- One connection for all apps
- Budget controls
- Works across devices
- [Learn more →](/wallets/nwc)

### Lightning Address

Simple receiving address in email format:

```
yourname@getalby.com
```

Set in your Nostr profile:
```json
{
  "lud16": "yourname@getalby.com"
}
```

### P2TR Address (On-Chain)

Derive from your npub for on-chain receiving:

```json
{
  "bitcoin": "bc1p..."
}
```

## Wallet Comparison

| Wallet | Type | NWC | Platform | On-Chain |
|--------|------|-----|----------|----------|
| Alby Extension | Custodial* | Yes | Browser | No |
| Alby Hub | Self-custodial | Yes | Self-hosted | No |
| Zeus | Self-custodial | Yes | Mobile | Yes |
| Mutiny | Self-custodial | Yes | Web | Yes |
| Phoenix | Self-custodial | No | Mobile | Yes |
| Primal | Custodial | Built-in | Mobile/Web | No |
| Sparrow | Self-custodial | No | Desktop | Yes |

*Alby is transitioning to Alby Hub for self-custody

## Setting Up for Nostr

### Step 1: Choose a Wallet

Consider:
- How much control you want
- Your technical comfort level
- Platforms you use (mobile, desktop, web)
- Lightning vs on-chain needs

### Step 2: Fund the Wallet

Options:
- Buy Bitcoin on exchange, transfer
- Receive Lightning payment
- Peer-to-peer purchase
- Mining rewards

### Step 3: Connect to Nostr

#### Via NWC
1. Generate NWC connection string in wallet
2. Paste into Nostr client settings
3. Set spending budget
4. Test with small zap

#### Via Lightning Address
1. Get Lightning address from wallet
2. Add to Nostr profile (`lud16`)
3. Others can now zap you

#### Via P2TR (On-Chain)
1. Derive P2TR address from npub
2. Add to Nostr profile (`bitcoin`)
3. Receive on-chain payments

## Security Best Practices

### Spending Wallets

For daily zapping:
- Keep small amounts
- Use NWC with budgets
- Can be custodial for convenience

### Savings

For larger amounts:
- Self-custodial
- Hardware wallet
- P2TR addresses from derived keys
- Multi-signature if large

### Key Management

```
✓ Backup seed phrase
✓ Store offline
✓ Test recovery
✓ Consider key derivation for Bitcoin
✗ Store digitally
✗ Share with others
```

## Common Tasks

### Sending Zaps

1. Click ⚡ on content
2. Select amount
3. Confirm in wallet
4. Done!

### Receiving Zaps

Ensure profile has:
```json
{
  "lud16": "you@wallet.com"
}
```

### On-Chain Payments

For larger amounts:
```json
{
  "bitcoin": "bc1p..."
}
```

### Checking Balance

Via NWC:
```json
{
  "method": "get_balance",
  "params": {}
}
```

## Troubleshooting

### Wallet Not Connecting

1. Check NWC string is complete
2. Verify relay is accessible
3. Regenerate connection

### Zaps Not Sending

1. Check balance
2. Verify budget not exceeded
3. Check recipient's LNURL

### Not Receiving Zaps

1. Verify `lud16` in profile
2. Test Lightning address externally
3. Check wallet service status

## Further Reading

- [Nostr Wallet Connect](/wallets/nwc)
- [Taproot Wallets](/wallets/taproot)
- [Alby Guide](/wallets/alby)
- [NDK Wallet Toolkit](/wallets/ndk-wallet)

---

:::tip Taproot Native
Your Nostr keys are Bitcoin keys. For on-chain payments, you can derive a P2TR address directly from your npub - no separate wallet needed for receiving.
:::
