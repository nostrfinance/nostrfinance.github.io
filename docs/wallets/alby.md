---
sidebar_position: 4
title: Alby Wallet
description: Bitcoin Lightning wallet and Nostr key management
---

# Alby Wallet

Alby is a popular Bitcoin Lightning wallet ecosystem with deep Nostr integration. It provides browser extensions, self-hosted nodes, and mobile apps for managing Lightning payments and Nostr identities.

## Alby Products

### Alby Browser Extension

The gateway to Lightning and Nostr on the web:

- **Lightning payments** in browsers
- **Nostr key management** (NIP-07)
- **NWC connections** for apps
- **WebLN support** for web apps

**Get it:**
- [Chrome/Brave/Edge](https://chrome.google.com/webstore/detail/alby/iokeahhehimjnekafflcihljlcjccdbe)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/alby/)

### Alby Hub

Self-custodial Lightning node management:

- **Your own node** - Full control
- **NWC server** - Generate connections
- **Channel management** - Easy liquidity
- **App connections** - Link to services

**Get it:** [albyhub.com](https://albyhub.com)

### Alby Go

Mobile app for Bitcoin on the go:

- **Companion to Alby Hub**
- **Mobile payments**
- **NWC mobile client**

## Setting Up Alby Extension

### Installation

1. Install from browser store
2. Create or import account
3. Set up PIN/password
4. Fund via Lightning

### Connecting to Nostr

Alby can manage your Nostr keys:

1. Go to Settings → Nostr
2. Generate new keys OR import existing
3. Apps can request signing (NIP-07)

```javascript
// Web app requesting Nostr signature
const pubkey = await window.nostr.getPublicKey();
const signed = await window.nostr.signEvent(event);
```

### Lightning Address

Every Alby account gets:
```
yourname@getalby.com
```

Use this in your Nostr profile:
```json
{
  "lud16": "yourname@getalby.com"
}
```

## Setting Up Alby Hub

### Requirements

- Server (VPS, home server, Raspberry Pi)
- Bitcoin (for channel funding)
- Domain (optional but recommended)

### Installation

```bash
# Docker installation
docker run -d \
  --name albyhub \
  -p 8080:8080 \
  -v albyhub_data:/data \
  ghcr.io/getalby/hub:latest
```

Or use one-click deployment:
- Umbrel
- Start9
- RaspiBlitz

### Channel Management

Alby Hub simplifies Lightning channels:

1. **Auto-channel opening** - Guided process
2. **Liquidity providers** - Easy inbound
3. **Channel health** - Monitoring

## NWC with Alby

### Generating NWC Connection

1. In Alby Hub: Connections → Create App
2. Set permissions and budget
3. Copy connection string
4. Paste in Nostr client

### Budget Controls

```
Daily limit: 10,000 sats
Per-payment max: 1,000 sats
Monthly limit: 100,000 sats
```

### Managing Connections

View and revoke connections:
- See active apps
- Monitor spending
- Revoke access instantly

## Features

### For Regular Users

| Feature | Extension | Hub |
|---------|-----------|-----|
| Receive zaps | ✓ | ✓ |
| Send zaps | ✓ | ✓ |
| Lightning address | ✓ | ✓ |
| NWC connections | ✓ | ✓ |
| Nostr key signing | ✓ | - |
| Self-custody | - | ✓ |

### For Developers

| Feature | Description |
|---------|-------------|
| WebLN | Standard Lightning API |
| NIP-07 | Nostr key signing |
| NWC | Wallet connectivity |
| Webhooks | Event notifications |
| API | Programmatic access |

## WebLN Integration

Alby implements WebLN for web apps:

```javascript
// Check if WebLN is available
if (typeof window.webln !== 'undefined') {
  await window.webln.enable();

  // Send payment
  const result = await window.webln.sendPayment('lnbc...');

  // Make invoice
  const invoice = await window.webln.makeInvoice({
    amount: 1000,
    defaultMemo: 'Test payment'
  });

  // Get info
  const info = await window.webln.getInfo();
}
```

## 2025 Transition

:::info Important Update
As of January 2025, Alby phased out their shared custodial wallet. Users should:
- Set up Alby Hub for self-custody, OR
- Connect external wallet via NWC

The browser extension continues to work for signing and connecting to external wallets.
:::

### Migration Options

1. **Alby Hub** - Self-host your own node
2. **Connect wallet** - Use NWC with any compatible wallet
3. **Lightning address** - Point to different provider

## Best Practices

### Security

- **Secure your seed** - Backup Alby Hub seed phrase
- **Use strong PIN** - Protect extension access
- **Budget connections** - Limit NWC spending
- **Regular updates** - Keep software current

### For Zapping

- **Set reasonable budget** - Match your spending
- **Multiple connections** - Different apps, different budgets
- **Monitor usage** - Check spending regularly

### For Receiving

- **Share Lightning address** - Easy for payers
- **Sufficient inbound** - Ensure channel capacity
- **Backup regularly** - Protect your channels

## Troubleshooting

### Extension Issues

**Can't sign Nostr events:**
1. Check extension is unlocked
2. Verify site has permission
3. Check console for errors

**Payments failing:**
1. Check wallet balance
2. Verify connection active
3. Try smaller amount

### Hub Issues

**Channels not working:**
1. Check node is synced
2. Verify channel state
3. Check routing liquidity

**NWC not connecting:**
1. Verify relay accessible
2. Check connection string
3. Regenerate if needed

## Resources

- [Alby Website](https://getalby.com)
- [Alby Hub](https://albyhub.com)
- [Documentation](https://guides.getalby.com)
- [GitHub](https://github.com/getAlby)
- [NWC Guide](https://nwc.dev)

---

:::tip Ecosystem Integration
Alby's strength is its ecosystem integration - one account connects you to Lightning, Nostr, and the broader web. Start with the extension, graduate to Hub when ready for self-custody.
:::
