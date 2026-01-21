---
sidebar_position: 3
title: NIP-99 Classifieds
description: Flexible classified listings on Nostr
---

# NIP-99: Classified Listings

[NIP-99](https://github.com/nostr-protocol/nips/blob/master/99.md) provides a simpler, more flexible approach to commerce on Nostr through classified-style listings. It's lighter weight than NIP-15 and supports a broader range of use cases.

## Overview

NIP-99 uses a single event type (kind 30402) that can represent:

- Physical products
- Services
- Job postings
- Rentals
- Free items (giveaways)
- Personal ads

## Event Structure

```json
{
  "kind": 30402,
  "pubkey": "seller_pubkey",
  "content": "Full description of the listing with markdown support...",
  "tags": [
    ["d", "unique-listing-id"],
    ["title", "Vintage Bitcoin Hardware Wallet"],
    ["summary", "Rare collectible hardware wallet in mint condition"],
    ["published_at", "1234567890"],
    ["location", "San Francisco, CA"],
    ["price", "100000", "sat"],
    ["t", "electronics"],
    ["t", "bitcoin"],
    ["image", "https://example.com/image1.jpg"],
    ["image", "https://example.com/image2.jpg"]
  ]
}
```

## Tag Reference

| Tag | Required | Description |
|-----|----------|-------------|
| `d` | Yes | Unique identifier |
| `title` | Yes | Listing title |
| `summary` | No | Short description |
| `published_at` | Yes | Unix timestamp |
| `location` | No | Geographic location |
| `price` | No | Amount, currency, frequency |
| `t` | No | Category/topic tags |
| `image` | No | Image URLs |
| `thumb` | No | Thumbnail URL |
| `status` | No | "active", "sold", "pending" |
| `e` | No | Reference to related events |

## Price Tag Format

The price tag supports multiple formats:

```
["price", "<amount>", "<currency>", "<frequency>"]
```

### Examples

```json
// One-time purchase in sats
["price", "50000", "sat"]

// Monthly subscription
["price", "10000", "sat", "month"]

// Fiat pricing
["price", "99.99", "USD"]

// Free
["price", "0", "sat"]

// Negotiable (no price tag, mention in description)
```

## Use Cases

### Physical Product

```json
{
  "kind": 30402,
  "content": "Brand new Bitcoin hoodie, never worn. Size Large.\n\n**Material:** 100% cotton\n**Shipping:** Included in price for US",
  "tags": [
    ["d", "btc-hoodie-001"],
    ["title", "Bitcoin Hoodie - Size L"],
    ["summary", "New Bitcoin hoodie, US shipping included"],
    ["published_at", "1234567890"],
    ["price", "35000", "sat"],
    ["location", "Austin, TX"],
    ["t", "clothing"],
    ["image", "https://example.com/hoodie.jpg"],
    ["status", "active"]
  ]
}
```

### Service Offering

```json
{
  "kind": 30402,
  "content": "Professional Bitcoin consulting services.\n\n**What I offer:**\n- Security audits\n- Self-custody setup\n- Node configuration\n\nAvailable for video calls worldwide.",
  "tags": [
    ["d", "btc-consulting"],
    ["title", "Bitcoin Consulting Services"],
    ["summary", "Expert Bitcoin consulting - security, custody, nodes"],
    ["published_at", "1234567890"],
    ["price", "100000", "sat", "hour"],
    ["t", "services"],
    ["t", "consulting"]
  ]
}
```

### Job Posting

```json
{
  "kind": 30402,
  "content": "We're hiring a Nostr developer!\n\n**Requirements:**\n- TypeScript experience\n- Understanding of NIPs\n- Remote work\n\nPaid in Bitcoin.",
  "tags": [
    ["d", "nostr-dev-job"],
    ["title", "Nostr Developer - Remote"],
    ["summary", "Full-time Nostr development position, paid in BTC"],
    ["published_at", "1234567890"],
    ["price", "5000000", "sat", "month"],
    ["location", "Remote"],
    ["t", "jobs"],
    ["t", "developer"]
  ]
}
```

### Rental

```json
{
  "kind": 30402,
  "content": "Cozy apartment in Bitcoin-friendly neighborhood.\n\nAccepting Bitcoin/Lightning for rent payments.",
  "tags": [
    ["d", "apt-rental-sf"],
    ["title", "1BR Apartment - Mission District"],
    ["summary", "1 bedroom apartment, Bitcoin accepted"],
    ["published_at", "1234567890"],
    ["price", "2000", "USD", "month"],
    ["location", "San Francisco, CA"],
    ["t", "rentals"],
    ["t", "housing"],
    ["image", "https://example.com/apt1.jpg"]
  ]
}
```

### Free Giveaway

```json
{
  "kind": 30402,
  "content": "Giving away old Bitcoin books. Free to good home!\n\nPick up only.",
  "tags": [
    ["d", "free-btc-books"],
    ["title", "Free Bitcoin Books"],
    ["summary", "Bitcoin books giveaway, local pickup"],
    ["published_at", "1234567890"],
    ["price", "0", "sat"],
    ["location", "Denver, CO"],
    ["t", "free"],
    ["t", "books"]
  ]
}
```

## NIP-99 vs NIP-15

| Aspect | NIP-99 | NIP-15 |
|--------|--------|--------|
| Complexity | Simple | Structured |
| Event types | 1 | 3+ |
| Use cases | Broad | E-commerce focused |
| Order flow | Manual/DM | Defined protocol |
| Best for | Classifieds, services | Online stores |

## Transaction Flow

### Basic Flow

```
1. Seller publishes listing (kind 30402)
2. Buyer discovers listing
3. Buyer contacts seller via DM (kind 4 or 14)
4. Negotiate details if needed
5. Seller provides Lightning invoice
6. Buyer pays
7. Seller fulfills
8. Seller updates status tag to "sold"
```

### Using NIP-17 Private DMs

For privacy, use NIP-17 gift-wrapped DMs:

```
Buyer → Encrypted DM → Seller
Seller → Invoice → Buyer
Buyer → Payment → Done
```

## E-Commerce Extension

For standardized e-commerce on NIP-99, additional tags can be used:

```json
{
  "tags": [
    // Standard tags...
    ["shipping", "domestic", "5000", "sat"],
    ["shipping", "international", "15000", "sat"],
    ["sku", "BTC-HOODIE-L-BLK"],
    ["quantity", "10"],
    ["condition", "new"]
  ]
}
```

## Implementation

### Creating a Listing

```javascript
const listing = {
  kind: 30402,
  content: "Detailed description here...",
  tags: [
    ["d", generateId()],
    ["title", "My Product"],
    ["summary", "Short summary"],
    ["published_at", String(Math.floor(Date.now() / 1000))],
    ["price", "10000", "sat"],
    ["t", "category"],
    ["image", "https://..."],
    ["status", "active"]
  ]
};

await signAndPublish(listing);
```

### Updating Listing

Use same `d` tag to update:

```javascript
const update = {
  kind: 30402,
  tags: [
    ["d", "existing-listing-id"], // Same d tag
    ["title", "Updated Title"],
    ["status", "sold"], // Mark as sold
    // ... other tags
  ]
};
```

### Querying Listings

```javascript
// All active listings from a user
const filter = {
  kinds: [30402],
  authors: [pubkey],
  "#status": ["active"]
};

// Listings by category
const filter = {
  kinds: [30402],
  "#t": ["electronics"]
};

// Listings in location
const filter = {
  kinds: [30402],
  "#location": ["San Francisco"]
};
```

## Best Practices

### For Sellers

1. **Clear descriptions** - Include all relevant details
2. **Good images** - Multiple angles, good lighting
3. **Accurate pricing** - Include shipping costs
4. **Responsive** - Reply to inquiries promptly
5. **Update status** - Mark items as sold

### For Buyers

1. **Verify seller** - Check reputation/history
2. **Ask questions** - Before committing
3. **Use escrow** - For large purchases (if available)
4. **Document** - Keep records of transactions

## See Also

- [NIP-99 Specification](https://github.com/nostr-protocol/nips/blob/master/99.md)
- [NIP-15 Marketplaces](/marketplaces/nip-15)
- [Marketplace Implementations](/marketplaces/implementations)

---

:::tip Flexibility Over Structure
NIP-99's flexibility makes it ideal for one-off sales, services, and diverse listing types. Use NIP-15 when you need full e-commerce structure with inventory management.
:::
