---
sidebar_position: 5
title: NDK Wallet Toolkit
description: Developer toolkit for Nostr wallet integration
---

# NDK Wallet Toolkit

The `@nostr-dev-kit/ndk-wallet` package provides a comprehensive wallet toolkit for building Nostr finance applications. It implements NIP-47 (NWC), NIP-57 (Zaps), and NIP-60 (Cashu) specifications.

## Overview

NDK Wallet is designed for developers building:
- Nostr clients with wallet features
- Financial applications on Nostr
- Cashu eCash integrations
- NWC-enabled services

```
┌────────────────────────────────────────┐
│           NDK Wallet Toolkit           │
├────────────┬────────────┬──────────────┤
│  NIP-47    │   NIP-57   │   NIP-60     │
│  NWC       │   Zaps     │   Cashu      │
├────────────┴────────────┴──────────────┤
│              NDK Core                  │
└────────────────────────────────────────┘
```

## Installation

```bash
npm install @nostr-dev-kit/ndk-wallet
# or
yarn add @nostr-dev-kit/ndk-wallet
```

## Features

| Feature | Description | NIP |
|---------|-------------|-----|
| NWC Client | Connect to wallets via NWC | NIP-47 |
| Cashu Wallet | eCash wallet management | NIP-60 |
| Nutzap Monitor | Auto-claim NutZaps | NIP-61 |
| Zap Support | Send and receive zaps | NIP-57 |

## NWC Client

### Connecting to a Wallet

```typescript
import NDK from '@nostr-dev-kit/ndk';
import { NDKNWCWallet } from '@nostr-dev-kit/ndk-wallet';

const ndk = new NDK({
  explicitRelayUrls: ['wss://relay.damus.io']
});
await ndk.connect();

// Create NWC wallet from connection string
const wallet = new NDKNWCWallet(ndk);
await wallet.connect('nostr+walletconnect://...');
```

### Paying Invoices

```typescript
// Pay a Lightning invoice
const result = await wallet.pay({
  invoice: 'lnbc1000n1...'
});

console.log('Payment preimage:', result.preimage);
```

### Creating Invoices

```typescript
// Generate invoice
const invoice = await wallet.createInvoice({
  amount: 1000, // sats
  description: 'Test payment'
});

console.log('Pay this:', invoice.invoice);
```

### Checking Balance

```typescript
const balance = await wallet.getBalance();
console.log('Balance:', balance, 'sats');
```

## Cashu Wallet (NIP-60)

### Initializing Cashu Wallet

```typescript
import { NDKCashuWallet } from '@nostr-dev-kit/ndk-wallet';

const cashuWallet = new NDKCashuWallet(ndk);
await cashuWallet.load(); // Load from Nostr events

// Set trusted mints
cashuWallet.trustedMints = [
  'https://mint.example.com'
];
```

### Minting Tokens

```typescript
// Mint tokens from Lightning
const mintQuote = await cashuWallet.mint(1000); // 1000 sats

// Get Lightning invoice to pay
console.log('Pay:', mintQuote.invoice);

// After payment, claim tokens
await cashuWallet.claimMintQuote(mintQuote);
```

### Sending Cashu

```typescript
// Send tokens to another user
const tokens = await cashuWallet.send(500, recipientPubkey);
```

### Balance

```typescript
// Get total balance
const balance = cashuWallet.balance;
console.log('Cashu balance:', balance, 'sats');

// Balance per mint
for (const [mint, amount] of cashuWallet.mintBalances) {
  console.log(`${mint}: ${amount} sats`);
}
```

## Nutzap Monitor

Automatically detect and claim incoming NutZaps:

```typescript
import { NutzapMonitor } from '@nostr-dev-kit/ndk-wallet';

const monitor = new NutzapMonitor(ndk, cashuWallet);

// Listen for incoming nutzaps
monitor.on('nutzap', async (nutzap) => {
  console.log('Received nutzap:', nutzap.amount);
  await monitor.claim(nutzap);
});

// Start monitoring
await monitor.start();
```

## Zap Integration

### Sending Zaps

```typescript
import { zapEvent } from '@nostr-dev-kit/ndk-wallet';

// Zap an event
const event = await ndk.fetchEvent('nevent1...');
const zapResult = await zapEvent(event, wallet, {
  amount: 1000,
  comment: 'Great post!'
});
```

### Checking Zap Receipts

```typescript
// Get zaps for an event
const zaps = await event.zaps();
const totalSats = zaps.reduce((sum, z) => sum + z.amount, 0);
console.log('Total zapped:', totalSats);
```

## Wallet State Management

### Persisting Wallet State

NIP-60 wallets automatically persist to Nostr:

```typescript
// Wallet state is stored as Nostr events
// kind 17375 - Wallet info
// kind 7375 - Token proofs (encrypted)
// kind 7376 - Spending history (optional)

// Save current state
await cashuWallet.save();

// Load from Nostr on new device
const wallet = new NDKCashuWallet(ndk);
await wallet.load();
// Wallet restored from your Nostr events
```

### Event Encryption

Token proofs are encrypted with your Nostr private key:

```typescript
// Only you can decrypt your wallet events
// Events are published to your preferred relays
// Accessible from any device with your keys
```

## Complete Example

```typescript
import NDK from '@nostr-dev-kit/ndk';
import {
  NDKNWCWallet,
  NDKCashuWallet,
  NutzapMonitor
} from '@nostr-dev-kit/ndk-wallet';

async function main() {
  // Initialize NDK
  const ndk = new NDK({
    explicitRelayUrls: [
      'wss://relay.damus.io',
      'wss://nos.lol'
    ]
  });
  await ndk.connect();

  // Set user (for signing/encryption)
  ndk.signer = yourSigner;

  // Option 1: NWC Wallet
  const nwcWallet = new NDKNWCWallet(ndk);
  await nwcWallet.connect('nostr+walletconnect://...');

  // Check balance
  const balance = await nwcWallet.getBalance();
  console.log('NWC Balance:', balance);

  // Option 2: Cashu Wallet
  const cashuWallet = new NDKCashuWallet(ndk);
  cashuWallet.trustedMints = ['https://mint.example.com'];
  await cashuWallet.load();

  // Monitor for NutZaps
  const monitor = new NutzapMonitor(ndk, cashuWallet);
  monitor.on('nutzap', (nz) => console.log('Received:', nz.amount));
  await monitor.start();

  // Mint some tokens
  const quote = await cashuWallet.mint(1000);
  console.log('Pay to mint:', quote.invoice);
}

main();
```

## Configuration Options

### NDKNWCWallet Options

```typescript
const wallet = new NDKNWCWallet(ndk, {
  timeout: 30000, // Request timeout
  budgetSats: 100000, // Optional client-side budget
});
```

### NDKCashuWallet Options

```typescript
const wallet = new NDKCashuWallet(ndk, {
  trustedMints: ['https://...'],
  autoSave: true, // Auto-save state changes
  relays: ['wss://...'], // Preferred relays for state
});
```

## Error Handling

```typescript
try {
  await wallet.pay({ invoice });
} catch (error) {
  if (error.code === 'INSUFFICIENT_BALANCE') {
    console.log('Not enough funds');
  } else if (error.code === 'PAYMENT_FAILED') {
    console.log('Lightning routing failed');
  } else {
    console.log('Unknown error:', error.message);
  }
}
```

## Resources

- [NDK Documentation](https://ndk.fyi)
- [GitHub Repository](https://github.com/nostr-dev-kit/ndk)
- [NPM Package](https://www.npmjs.com/package/@nostr-dev-kit/ndk-wallet)
- [NIP-47 Spec](https://github.com/nostr-protocol/nips/blob/master/47.md)
- [NIP-60 Spec](https://github.com/nostr-protocol/nips/blob/master/60.md)

---

:::tip Developer Tool
NDK Wallet abstracts away the complexity of Nostr finance protocols. Focus on your application logic while NDK handles the NIP implementations.
:::
