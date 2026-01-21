---
sidebar_position: 2
title: NIP-47 (NWC)
description: Nostr Wallet Connect specification
---

# NIP-47: Nostr Wallet Connect

[NIP-47](https://github.com/nostr-protocol/nips/blob/master/47.md) defines Nostr Wallet Connect (NWC), a protocol for connecting Lightning wallets to applications via Nostr.

## Summary

| Aspect | Detail |
|--------|--------|
| **Kind** | 23194 (request), 23195 (response) |
| **Purpose** | Wallet ↔ App communication |
| **Status** | Merged |
| **Depends on** | NIP-01, NIP-04 |

## Overview

NWC enables applications to:
- Pay Lightning invoices
- Create invoices
- Check balances
- List transactions

All communication is encrypted and passes through Nostr relays.

## Connection String

```
nostr+walletconnect://<wallet_pubkey>?relay=<relay_url>&secret=<secret>
```

### Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `wallet_pubkey` | Yes | Wallet service public key |
| `relay` | Yes | Relay URL for communication |
| `secret` | Yes | Shared secret for encryption |
| `lud16` | No | Lightning address hint |

## Event Kinds

### Request (kind 23194)

From app to wallet:

```json
{
  "kind": 23194,
  "pubkey": "app_connection_pubkey",
  "content": "<encrypted JSON-RPC request>",
  "tags": [
    ["p", "wallet_service_pubkey"]
  ]
}
```

### Response (kind 23195)

From wallet to app:

```json
{
  "kind": 23195,
  "pubkey": "wallet_service_pubkey",
  "content": "<encrypted JSON-RPC response>",
  "tags": [
    ["p", "app_connection_pubkey"],
    ["e", "request_event_id"]
  ]
}
```

## Methods

### pay_invoice

Pay a Lightning invoice:

**Request:**
```json
{
  "method": "pay_invoice",
  "params": {
    "invoice": "lnbc1000n1..."
  }
}
```

**Response:**
```json
{
  "result_type": "pay_invoice",
  "result": {
    "preimage": "0123456789abcdef..."
  }
}
```

### make_invoice

Create an invoice:

**Request:**
```json
{
  "method": "make_invoice",
  "params": {
    "amount": 1000,
    "description": "Test payment",
    "expiry": 3600
  }
}
```

**Response:**
```json
{
  "result_type": "make_invoice",
  "result": {
    "type": "incoming",
    "invoice": "lnbc1000n1...",
    "description": "Test payment",
    "payment_hash": "abc123...",
    "amount": 1000,
    "created_at": 1234567890,
    "expiry": 3600
  }
}
```

### get_balance

Check wallet balance:

**Request:**
```json
{
  "method": "get_balance",
  "params": {}
}
```

**Response:**
```json
{
  "result_type": "get_balance",
  "result": {
    "balance": 50000
  }
}
```

### get_info

Get wallet information:

**Request:**
```json
{
  "method": "get_info",
  "params": {}
}
```

**Response:**
```json
{
  "result_type": "get_info",
  "result": {
    "alias": "My Wallet",
    "color": "#ff9900",
    "pubkey": "node_pubkey",
    "network": "mainnet",
    "block_height": 800000,
    "methods": ["pay_invoice", "make_invoice", "get_balance", "get_info"]
  }
}
```

### lookup_invoice

Check invoice status:

**Request:**
```json
{
  "method": "lookup_invoice",
  "params": {
    "payment_hash": "abc123..."
  }
}
```

### list_transactions

Get transaction history:

**Request:**
```json
{
  "method": "list_transactions",
  "params": {
    "from": 1234567890,
    "until": 1234657890,
    "limit": 10,
    "offset": 0,
    "type": "incoming"
  }
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `RATE_LIMITED` | Too many requests |
| `NOT_IMPLEMENTED` | Method not supported |
| `INSUFFICIENT_BALANCE` | Not enough funds |
| `PAYMENT_FAILED` | Payment couldn't complete |
| `NOT_FOUND` | Resource not found |
| `QUOTA_EXCEEDED` | Budget limit reached |
| `RESTRICTED` | Operation not allowed |
| `UNAUTHORIZED` | Authentication failed |
| `INTERNAL` | Server error |
| `OTHER` | Unspecified error |

**Error Response:**
```json
{
  "result_type": "pay_invoice",
  "error": {
    "code": "INSUFFICIENT_BALANCE",
    "message": "Not enough funds in wallet"
  }
}
```

## Security

### Encryption

All content is NIP-04 encrypted between app and wallet.

### Budget Controls

Wallets SHOULD implement:
- Daily/weekly/monthly limits
- Per-transaction limits
- Per-app quotas

### Connection Management

- Each connection uses unique keypair
- Connections can be revoked
- Apps should not reuse keys across users

## Implementation

### Client Side (App)

```javascript
import { nip04 } from 'nostr-tools';

async function payInvoice(invoice) {
  const request = {
    method: 'pay_invoice',
    params: { invoice }
  };

  const encrypted = await nip04.encrypt(
    connectionSecret,
    walletPubkey,
    JSON.stringify(request)
  );

  const event = {
    kind: 23194,
    pubkey: connectionPubkey,
    content: encrypted,
    tags: [['p', walletPubkey]]
  };

  // Sign and publish
  await publishEvent(event);

  // Subscribe for response
  const response = await waitForResponse(event.id);
  return JSON.parse(await nip04.decrypt(
    connectionSecret,
    walletPubkey,
    response.content
  ));
}
```

### Service Side (Wallet)

```javascript
// Subscribe to requests
const filter = {
  kinds: [23194],
  '#p': [walletServicePubkey]
};

relay.subscribe(filter, async (event) => {
  // Decrypt request
  const request = JSON.parse(await nip04.decrypt(
    walletPrivkey,
    event.pubkey,
    event.content
  ));

  // Process request
  const result = await processRequest(request);

  // Send encrypted response
  const response = {
    kind: 23195,
    content: await nip04.encrypt(
      walletPrivkey,
      event.pubkey,
      JSON.stringify(result)
    ),
    tags: [
      ['p', event.pubkey],
      ['e', event.id]
    ]
  };

  await publishEvent(response);
});
```

## Resources

- [NIP-47 Specification](https://github.com/nostr-protocol/nips/blob/master/47.md)
- [NWC Documentation](https://nwc.dev)
- [Alby NWC Guide](https://guides.getalby.com)

---

:::tip Universal Protocol
NWC removes the need for custom integrations. Any NWC-compatible wallet works with any NWC-compatible app.
:::
