---
sidebar_position: 4
title: Marketplace Implementations
description: Platforms and tools for Nostr commerce
---

# Marketplace Implementations

Several platforms and tools enable commerce on Nostr. Here's a guide to the current ecosystem.

## Marketplace Platforms

### Shopstr

**Global, permissionless marketplace for Bitcoin commerce**

- **Website:** [shopstr.store](https://shopstr.store)
- **GitHub:** [shopstr-eng/shopstr](https://github.com/shopstr-eng/shopstr)

Features:
- NIP-15 and NIP-99 support
- NIP-17 private direct messages
- Lightning payments
- Product listings and search
- Seller profiles

### LNbits Nostr Market

**Self-hosted marketplace extension**

- **GitHub:** [lnbits/nostrmarket](https://github.com/lnbits/nostrmarket)

Features:
- Runs on LNbits
- Customizable marketplace
- Merchant tools
- Order management
- Lightning integration

### Plebeian Market

**Community marketplace with auctions**

Features:
- Auction support
- Stall management
- Fiat pricing option
- Multiple payment methods

## Merchant Tools

### Stall Creation

Tools for creating and managing stalls:

```javascript
// Example: Using nostr-tools to create a stall
import { getEventHash, signEvent } from 'nostr-tools';

const stall = {
  kind: 30017,
  pubkey: yourPubkey,
  created_at: Math.floor(Date.now() / 1000),
  content: JSON.stringify({
    id: "my-stall",
    name: "My Store",
    description: "Quality Bitcoin merchandise",
    currency: "sat",
    shipping: [{
      id: "worldwide",
      name: "Worldwide Shipping",
      cost: 10000,
      regions: ["worldwide"]
    }]
  }),
  tags: [["d", "my-stall"]]
};

stall.id = getEventHash(stall);
stall.sig = signEvent(stall, yourPrivkey);
```

### Product Management

```javascript
const product = {
  kind: 30018,
  pubkey: yourPubkey,
  created_at: Math.floor(Date.now() / 1000),
  content: JSON.stringify({
    id: "product-001",
    stall_id: "my-stall",
    name: "Bitcoin Hardware Wallet",
    description: "Secure your Bitcoin with this hardware wallet",
    images: ["https://example.com/wallet.jpg"],
    currency: "sat",
    price: 150000,
    quantity: 10,
    specs: [
      ["Model", "Standard"],
      ["Color", "Black"]
    ]
  }),
  tags: [
    ["d", "product-001"],
    ["t", "hardware-wallet"],
    ["t", "security"]
  ]
};
```

## Client Integration

### Web Clients with Marketplace

| Client | Marketplace Support |
|--------|-------------------|
| Nostrudel | Product viewing |
| Coracle | Basic listings |
| Snort | Limited |

### Dedicated Apps

- **Shopstr** - Full marketplace experience
- **Amethyst** - Product viewing

## Libraries and SDKs

### nostr-tools

General Nostr library with marketplace event support:

```bash
npm install nostr-tools
```

### NDK (Nostr Development Kit)

Higher-level toolkit:

```bash
npm install @nostr-dev-kit/ndk
```

Example:
```javascript
import NDK from '@nostr-dev-kit/ndk';

const ndk = new NDK({ explicitRelayUrls: ['wss://relay.damus.io'] });
await ndk.connect();

// Fetch marketplace products
const products = await ndk.fetchEvents({
  kinds: [30018],
  '#t': ['electronics']
});
```

## Payment Integration

### Lightning Payments

Most implementations use Lightning:

```javascript
// Generate invoice for order
async function createOrderInvoice(amount, orderId) {
  const invoice = await wallet.createInvoice({
    amount: amount,
    description: `Order ${orderId}`
  });
  return invoice;
}
```

### NWC Integration

For wallet connectivity:

```javascript
import { NDKNWCWallet } from '@nostr-dev-kit/ndk-wallet';

const wallet = new NDKNWCWallet(ndk);
await wallet.connect(nwcConnectionString);

// Pay merchant invoice
await wallet.pay({ invoice: merchantInvoice });
```

## Deployment Options

### Self-Hosted

Run your own marketplace:

1. **LNbits + Nostr Market**
   ```bash
   # Install LNbits
   # Enable Nostr Market extension
   # Configure products
   ```

2. **Custom Implementation**
   - Build on nostr-tools/NDK
   - Host on any web server
   - Connect to public relays

### Hosted Platforms

Use existing platforms:
- Create account with Nostr key
- Set up stall
- Start selling

## Example Workflows

### Setting Up a Store

```
1. Generate Nostr keypair (or use existing)
2. Create stall event (kind 30017)
3. Add products (kind 30018)
4. Set up Lightning receiving (NWC or direct)
5. Publish to relays
6. Share stall link
```

### Processing an Order

```
1. Receive DM from customer
2. Verify product availability
3. Calculate total (product + shipping)
4. Generate Lightning invoice
5. Send invoice to customer
6. Receive payment
7. Ship product
8. Update order status
```

## Future Development

### Being Built

- Escrow systems
- Automated fulfillment
- Inventory sync
- Multi-vendor platforms
- Reputation/reviews

### Needed

- Better mobile experiences
- Fiat on/off ramps
- Shipping integrations
- Tax handling
- Multi-language support

## Resources

### Documentation

- [NIP-15 Spec](https://github.com/nostr-protocol/nips/blob/master/15.md)
- [NIP-99 Spec](https://github.com/nostr-protocol/nips/blob/master/99.md)

### Communities

- Nostr marketplace builders
- Bitcoin commerce groups
- LNbits community

### Examples

- Shopstr source code
- LNbits Nostr Market extension
- Sample implementations on GitHub

---

:::tip Getting Started
Start with an existing platform like Shopstr to understand the flow. Once comfortable, consider building custom solutions for specific needs.
:::
