---
sidebar_position: 3
title: Quick Start Guide
description: Get started with Nostr finance in minutes
---

# Quick Start Guide

This guide will get you set up with Nostr finance capabilities in just a few steps.

## Prerequisites

You'll need:
- A Nostr client (app)
- A Lightning wallet
- Some Bitcoin (satoshis)

## Step 1: Choose a Nostr Client

Popular clients with finance support:

| Client | Platform | Key Features |
|--------|----------|--------------|
| [Damus](https://damus.io) | iOS | Native zaps, NWC support |
| [Amethyst](https://github.com/vitorpamplona/amethyst) | Android | Full NWC, Cashu integration |
| [Primal](https://primal.net) | Web/iOS/Android | Built-in wallet, zaps |
| [Nostrudel](https://nostrudel.ninja) | Web | Advanced features, NWC |
| [Coracle](https://coracle.social) | Web | Privacy-focused, zaps |

## Step 2: Set Up a Lightning Wallet

### Option A: Alby (Recommended for Beginners)

1. Install [Alby Browser Extension](https://getalby.com)
2. Create an account or connect existing wallet
3. Fund with Bitcoin via Lightning or on-chain

```
Alby provides:
✓ Browser extension for web apps
✓ NWC connection strings
✓ Lightning address (you@getalby.com)
✓ Nostr key management
```

### Option B: Alby Hub (Self-Custodial)

For more control:
1. Set up [Alby Hub](https://albyhub.com)
2. Open Lightning channels
3. Generate NWC connection for apps

### Option C: Other Wallets

Compatible wallets include:
- **Zeus** - Mobile wallet with NWC
- **Mutiny** - Web-based, privacy-focused
- **Phoenix** - Simple mobile Lightning
- **Wallet of Satoshi** - Custodial, easy setup

## Step 3: Connect Wallet to Nostr Client

### Using NWC (Nostr Wallet Connect)

1. In your wallet, generate an NWC connection string:
   ```
   nostr+walletconnect://pubkey?relay=wss://...&secret=...
   ```

2. In your Nostr client:
   - Go to Settings → Wallet
   - Paste the NWC connection string
   - Set a budget (optional but recommended)

3. Test with a small zap

### Using Lightning Address

If your client supports Lightning addresses:
1. Set your Lightning address in your Nostr profile
2. Others can now zap you directly

```json
{
  "lud16": "yourname@getalby.com"
}
```

## Step 4: Send Your First Zap

1. Find a post you appreciate
2. Click the lightning bolt (⚡) icon
3. Select an amount:
   - 21 sats - Small tip
   - 100 sats - Nice appreciation
   - 1000 sats - Great content!
   - Custom amount

4. Confirm the payment
5. See your zap appear on the post

## Step 5: Receive Zaps

To receive zaps, ensure your profile has:

```json
{
  "lud16": "you@wallet.com",
  "lud06": "https://your-lnurl-endpoint..."
}
```

Most clients set this automatically when you configure a wallet.

## Next Steps

Now that you're set up, explore more:

### Learn About Payments
- [Zaps in Detail](/payments/zaps) - How Lightning zaps work
- [On-Chain Payments](/payments/onchain) - Bitcoin P2TR payments
- [Subscriptions](/payments/subscriptions) - Recurring payments

### Explore Wallets
- [Nostr Wallet Connect](/wallets/nwc) - The NWC protocol
- [Taproot Wallets](/wallets/taproot) - Native Bitcoin integration

### Advanced Features
- [Marketplaces](/marketplaces/overview) - Buy and sell on Nostr
- [Crowdfunding](/payments/crowdfunding) - Fund projects with zaps

## Troubleshooting

### Zaps Not Working

1. **Check wallet connection** - Verify NWC string is correct
2. **Check balance** - Ensure sufficient funds
3. **Check relays** - NWC requires relay connectivity
4. **Check recipient** - They need `lud16` in profile

### Wallet Not Connecting

1. **Verify connection string** - Copy entire string
2. **Check relay status** - NWC relay must be online
3. **Regenerate connection** - Create new NWC string

### Not Receiving Zaps

1. **Check profile** - `lud16` must be set correctly
2. **Test Lightning address** - Try sending yourself sats
3. **Update profile** - Republish kind 0 event

---

:::tip Start Small
Begin with small amounts (21-100 sats) while learning. This minimizes any mistakes while you get comfortable with the system.
:::
