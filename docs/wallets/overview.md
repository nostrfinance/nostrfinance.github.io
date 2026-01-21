---
sidebar_position: 1
title: Wallets Overview
description: Bitcoin and Lightning wallets for Nostr
---

# Nostr Wallets Overview

Wallets are essential for Nostr finance - they hold your Bitcoin and enable payments. This guide covers the different wallet types and how they integrate with Nostr.

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
| **External** | Manual invoices | Any Lightning wallet |

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

### For Privacy

#### Mutiny Wallet
- Self-custodial
- Privacy-focused
- Web-based
- [mutinywallet.com](https://mutinywallet.com)

#### Cashu Wallets
- eCash privacy
- Instant transfers
- [More on Cashu →](/wallets/cashu)

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

### LNURL

Protocol for Lightning interactions:
- lnurl-pay (receiving)
- lnurl-withdraw (claiming)
- lnurl-auth (login)

## Wallet Comparison

| Wallet | Type | NWC | Platform | Cashu |
|--------|------|-----|----------|-------|
| Alby Extension | Custodial* | Yes | Browser | No |
| Alby Hub | Self-custodial | Yes | Self-hosted | No |
| Zeus | Self-custodial | Yes | Mobile | Yes |
| Mutiny | Self-custodial | Yes | Web | No |
| Phoenix | Self-custodial | No | Mobile | No |
| Primal | Custodial | Built-in | Mobile/Web | No |
| Minibits | Self-custodial | No | Mobile | Yes |

*Alby is transitioning to Alby Hub for self-custody

## Setting Up for Nostr

### Step 1: Choose a Wallet

Consider:
- How much control you want
- Your technical comfort level
- Platforms you use (mobile, desktop, web)
- Privacy requirements

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

## Security Best Practices

### Spending Wallets

For daily zapping:
- Keep small amounts
- Use NWC with budgets
- Can be custodial for convenience

### Savings

For larger amounts:
- Self-custodial
- Hardware wallet backup
- Multi-signature if large

### Key Management

```
✓ Backup seed phrase
✓ Store offline
✓ Test recovery
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

### Checking Balance

Via NWC:
```json
{
  "method": "get_balance",
  "params": {}
}
```

### Creating Invoices

```json
{
  "method": "make_invoice",
  "params": {
    "amount": 1000,
    "description": "Thanks!"
  }
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
- [Cashu eCash](/wallets/cashu)
- [Alby Guide](/wallets/alby)
- [NDK Wallet Toolkit](/wallets/ndk-wallet)

---

:::tip Start Simple
Begin with a custodial wallet like Alby to learn. Once comfortable, graduate to self-custodial options for more control and security.
:::
