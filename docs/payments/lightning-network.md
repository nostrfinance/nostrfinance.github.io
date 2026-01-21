---
sidebar_position: 3
title: Lightning Network
description: Understanding Lightning Network payments on Nostr
---

# Lightning Network

The Lightning Network is a Layer 2 scaling solution for Bitcoin that enables instant, low-cost payments. It's the backbone of Nostr's payment infrastructure.

## What is Lightning Network?

Lightning is a network of payment channels built on top of Bitcoin:

```
┌─────────────────────────────────────────────────┐
│              Lightning Network                   │
│   ┌─────┐     ┌─────┐     ┌─────┐     ┌─────┐ │
│   │Node │◄───►│Node │◄───►│Node │◄───►│Node │ │
│   └─────┘     └─────┘     └─────┘     └─────┘ │
│        Payment channels route payments          │
├─────────────────────────────────────────────────┤
│                 Bitcoin Blockchain               │
│           (Settlement & Channel Funding)         │
└─────────────────────────────────────────────────┘
```

### Key Properties

| Property | Bitcoin On-Chain | Lightning |
|----------|------------------|-----------|
| Speed | 10-60 minutes | Milliseconds |
| Fees | Variable ($0.50-$50+) | Near-zero ($0.001) |
| Throughput | ~7 TPS | 1,000,000+ TPS |
| Privacy | Public ledger | Route-based |
| Minimum | Dust limit (~$3) | 1 satoshi |

## How Lightning Works

### Payment Channels

1. **Opening**: Fund a channel with on-chain Bitcoin
2. **Transacting**: Unlimited off-chain payments
3. **Closing**: Settle final balance on-chain

```
Alice ←──── 1 BTC Channel ────► Bob

Alice can send up to 1 BTC to Bob
without touching the blockchain
```

### Routing

Payments route through multiple channels:

```
Alice → Node1 → Node2 → Node3 → Bob
        │        │        │
     0.001%   0.001%   0.001%  (routing fees)
```

## Lightning on Nostr

### Integration Points

1. **Zaps** - [NIP-57](/nips/nip-57) Lightning payments
2. **NWC** - [NIP-47](/nips/nip-47) Wallet connectivity
3. **LNURL** - Simplified payment flows
4. **Marketplace** - Product payments

### LNURL

LNURL simplifies Lightning interactions:

| LNURL Type | Purpose |
|------------|---------|
| lnurl-pay | Receive payments |
| lnurl-withdraw | Claim payments |
| lnurl-auth | Authentication |
| lnurl-channel | Open channels |

#### Lightning Address

Human-readable payment addresses:

```
user@domain.com → LNURL-pay endpoint
```

Behind the scenes:
```
GET https://domain.com/.well-known/lnurlp/user
Returns: Payment endpoint metadata
```

## Setting Up Lightning

### Option 1: Custodial Wallets

Easiest for beginners:

| Wallet | Features |
|--------|----------|
| Wallet of Satoshi | Simple, no setup |
| Alby | Browser extension |
| Strike | Easy fiat on-ramp |

### Option 2: Self-Custodial

More control, more responsibility:

| Wallet | Features |
|--------|----------|
| Phoenix | Mobile, auto channels |
| Mutiny | Web-based, private |
| Zeus | Full node control |
| Breez | POS features |

### Option 3: Full Node

Maximum sovereignty:

```bash
# Example: Running a node
- Bitcoin Core (base layer)
- LND / CLN / Eclair (Lightning implementation)
- RTL / ThunderHub (management UI)
```

## Lightning Invoices

### Invoice Structure

```
lnbc1000n1pj...
│    │     │
│    │     └── Data payload (payment hash, etc.)
│    └──────── Amount (1000 sats)
└───────────── Network (lnbc = mainnet)
```

### Invoice Fields

| Field | Description |
|-------|-------------|
| Amount | Payment amount in sats |
| Payment Hash | Unique payment identifier |
| Expiry | Time until invoice expires |
| Description | Payment memo |
| Route Hints | Help find recipient |

### Creating Invoices

Via NWC:
```json
{
  "method": "make_invoice",
  "params": {
    "amount": 1000,
    "description": "Thanks for the content!"
  }
}
```

## Lightning Limitations

### Channel Capacity

- Maximum payment = smallest channel in route
- Large payments may fail
- Solution: Multiple smaller payments or MPP

### Inbound Liquidity

To receive, you need inbound capacity:
```
Channel: Alice ←─ 1 BTC ─→ Bob
         │                   │
    Outbound: 1 BTC    Inbound: 0 BTC
```

Solutions:
- Buy inbound liquidity
- Spend first to create inbound
- Use services like Loop

### Online Requirement

- Must be online to receive
- Watchtowers can protect channels
- Custodial solutions avoid this

## Lightning + Nostr Flow

### Sending a Zap

```
1. User clicks ⚡ on post
2. Client creates Zap Request
3. Sends to recipient's LNURL
4. LNURL returns invoice
5. Client pays via NWC
6. Wallet pays Lightning invoice
7. LNURL publishes Zap Receipt
```

### Receiving Payments

```
1. Set lud16 in profile
2. Point to LNURL endpoint
3. Endpoint handles:
   - Invoice generation
   - Payment receipt
   - Zap receipt publishing
```

## Best Practices

### For Users

1. **Start custodial** - Learn before self-custody
2. **Fund appropriately** - Keep small amounts for zapping
3. **Multiple wallets** - Separate spending/savings
4. **Backup keys** - Protect wallet seeds

### For Developers

1. **Use NWC** - Standard wallet connection
2. **Handle failures** - Lightning can timeout
3. **Implement LNURL** - Better UX
4. **Test on testnet** - Before mainnet

## On-Chain

While Lightning is the primary payment method on Nostr, on-chain Bitcoin payments are still useful for:

- Large amounts where Lightning capacity is insufficient
- Long-term savings
- Channel funding
- Cold storage deposits

### On-Chain vs Lightning

| Use Case | Recommended |
|----------|-------------|
| Zaps and tips | Lightning |
| Small purchases | Lightning |
| Large payments (1000+ USD) | On-chain |
| Savings | On-chain |
| Channel deposits | On-chain |

### On-Chain in Nostr

On-chain payments aren't directly integrated into Nostr protocols yet, but you can:
- Share on-chain addresses in DMs
- Use NIP-15 marketplace with on-chain option
- Include Bitcoin addresses in profiles

## Resources

### Wallets

- [Alby](https://getalby.com) - Browser extension
- [Phoenix](https://phoenix.acinq.co) - Mobile
- [Mutiny](https://mutinywallet.com) - Web
- [Zeus](https://zeusln.app) - Mobile + node

### Learning

- [Lightning Network Whitepaper](https://lightning.network/lightning-network-paper.pdf)
- [BOLT Specifications](https://github.com/lightning/bolts)
- [LNURL Specifications](https://github.com/lnurl/luds)

---

:::tip Micropayments Unlocked
Lightning makes payments of 1 sat (~$0.001) economically viable. This enables entirely new business models impossible with traditional payment systems.
:::
