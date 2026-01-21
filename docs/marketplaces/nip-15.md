---
sidebar_position: 2
title: NIP-15 Marketplaces
description: Structured marketplace protocol for Nostr
---

# NIP-15: Nostr Marketplace

[NIP-15](https://github.com/nostr-protocol/nips/blob/master/15.md) defines a structured protocol for creating marketplaces on Nostr, enabling merchants to publish products and buyers to place orders using Lightning payments.

## Overview

NIP-15 introduces three main event types:

| Kind | Name | Purpose |
|------|------|---------|
| 30017 | Stall | Merchant's store configuration |
| 30018 | Product | Individual product listings |
| 4 | DM | Order communication (encrypted) |

## Stall Events (kind 30017)

A stall represents a merchant's store:

```json
{
  "kind": 30017,
  "pubkey": "merchant_pubkey",
  "content": "{\"id\":\"stall_id\",\"name\":\"My Store\",\"description\":\"Quality goods\",\"currency\":\"sat\",\"shipping\":[{\"id\":\"ship1\",\"name\":\"Standard\",\"cost\":5000,\"regions\":[\"worldwide\"]}]}",
  "tags": [
    ["d", "stall_id"]
  ]
}
```

### Stall Content Schema

```typescript
interface Stall {
  id: string;
  name: string;
  description?: string;
  currency: string; // "sat", "USD", etc.
  shipping: ShippingMethod[];
}

interface ShippingMethod {
  id: string;
  name: string;
  cost: number;
  regions: string[];
}
```

### Example Stall

```json
{
  "id": "bitcoin-merch",
  "name": "Bitcoin Merchandise",
  "description": "Official Bitcoin-themed products",
  "currency": "sat",
  "shipping": [
    {
      "id": "domestic",
      "name": "US Shipping",
      "cost": 5000,
      "regions": ["US"]
    },
    {
      "id": "international",
      "name": "International",
      "cost": 15000,
      "regions": ["worldwide"]
    }
  ]
}
```

## Product Events (kind 30018)

Products are items for sale within a stall:

```json
{
  "kind": 30018,
  "pubkey": "merchant_pubkey",
  "content": "{\"id\":\"product1\",\"stall_id\":\"stall_id\",\"name\":\"Bitcoin T-Shirt\",\"description\":\"100% cotton\",\"images\":[\"https://...\"],\"currency\":\"sat\",\"price\":21000,\"quantity\":50}",
  "tags": [
    ["d", "product1"],
    ["t", "clothing"],
    ["t", "bitcoin"]
  ]
}
```

### Product Content Schema

```typescript
interface Product {
  id: string;
  stall_id: string;
  name: string;
  description?: string;
  images?: string[];
  currency: string;
  price: number;
  quantity?: number;
  specs?: [string, string][]; // Key-value pairs
  shipping?: ShippingCost[];
}

interface ShippingCost {
  id: string; // References stall shipping method
  cost: number; // Additional cost for this product
}
```

### Product Example

```json
{
  "id": "btc-hoodie-black",
  "stall_id": "bitcoin-merch",
  "name": "Bitcoin Hoodie - Black",
  "description": "Premium quality hoodie with embroidered Bitcoin logo",
  "images": [
    "https://example.com/hoodie-front.jpg",
    "https://example.com/hoodie-back.jpg"
  ],
  "currency": "sat",
  "price": 50000,
  "quantity": 25,
  "specs": [
    ["Material", "80% Cotton, 20% Polyester"],
    ["Sizes", "S, M, L, XL"],
    ["Color", "Black"]
  ]
}
```

## Order Flow

### 1. Customer Creates Order

Customer sends encrypted DM to merchant:

```json
{
  "kind": 4,
  "content": "<encrypted order JSON>",
  "tags": [
    ["p", "merchant_pubkey"]
  ]
}
```

Order content (before encryption):

```json
{
  "type": 0,
  "id": "order_id",
  "items": [
    {
      "product_id": "btc-hoodie-black",
      "quantity": 1
    }
  ],
  "shipping_id": "domestic",
  "contact": {
    "nostr": "customer_npub",
    "email": "customer@example.com"
  },
  "address": "123 Bitcoin St, Satoshi City, 12345"
}
```

### 2. Merchant Responds

Merchant sends payment request:

```json
{
  "type": 1,
  "id": "order_id",
  "message": "Thanks for your order!",
  "payment_options": [
    {
      "type": "ln",
      "link": "lnbc500000n1..."
    }
  ]
}
```

### 3. Customer Pays

Customer pays Lightning invoice.

### 4. Merchant Confirms

```json
{
  "type": 2,
  "id": "order_id",
  "message": "Payment received! Shipping in 2-3 days.",
  "shipped": false
}
```

### Order Types

| Type | Purpose |
|------|---------|
| 0 | New order from customer |
| 1 | Payment request from merchant |
| 2 | Order status update |

## Client-Side Architecture

NIP-15 specifies that marketplace clients should be:

> "Entirely client-side, either as a stand-alone app, or as a purely frontend webpage."

### How It Works

1. Client subscribes to merchant pubkeys
2. Fetches stalls and products
3. Displays searchable catalog
4. Handles order DMs
5. Integrates wallet for payments

### Search and Discovery

Clients can filter products by:
- Tags (`t` tag)
- Stall ID
- Price range
- Merchant reputation

## Implementation Example

### Creating a Stall

```javascript
const stall = {
  kind: 30017,
  content: JSON.stringify({
    id: "my-store",
    name: "My Bitcoin Store",
    description: "Quality products for Bitcoiners",
    currency: "sat",
    shipping: [{
      id: "standard",
      name: "Standard Shipping",
      cost: 10000,
      regions: ["worldwide"]
    }]
  }),
  tags: [
    ["d", "my-store"]
  ]
};

await publishEvent(stall);
```

### Listing a Product

```javascript
const product = {
  kind: 30018,
  content: JSON.stringify({
    id: "btc-mug",
    stall_id: "my-store",
    name: "Bitcoin Coffee Mug",
    description: "Start your day with Bitcoin",
    images: ["https://example.com/mug.jpg"],
    currency: "sat",
    price: 15000,
    quantity: 100
  }),
  tags: [
    ["d", "btc-mug"],
    ["t", "drinkware"],
    ["t", "bitcoin"]
  ]
};

await publishEvent(product);
```

## Challenges

### Current Limitations

- **Manual processing** - No automated fulfillment
- **Trust** - No built-in escrow
- **Scale** - Hard to manage many orders
- **Inventory** - Manual stock updates

### Being Addressed

- Merchant tools development
- Escrow proposals
- Order management systems
- Integration with fulfillment APIs

## See Also

- [NIP-15 Specification](https://github.com/nostr-protocol/nips/blob/master/15.md)
- [NIP-99 Classifieds](/marketplaces/nip-99)
- [Marketplace Implementations](/marketplaces/implementations)

---

:::tip Origin Story
NIP-15 was inspired by Diagon Alley, a LNbits marketplace extension. The concepts around resilient commerce helped influence Nostr protocol development.
:::
