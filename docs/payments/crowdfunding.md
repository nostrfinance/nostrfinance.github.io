---
sidebar_position: 6
title: Crowdfunding (NIP-75)
description: Fundraising with Zap Goals on Nostr
---

# Crowdfunding with Zap Goals

[NIP-75](https://github.com/nostr-protocol/nips/blob/master/75.md) defines Zap Goals - a way to create public fundraising campaigns on Nostr where supporters contribute via zaps.

## What Are Zap Goals?

Zap Goals are:
- **Public fundraising targets** visible on Nostr
- **Funded via zaps** from supporters
- **Transparent progress** anyone can verify
- **Trustless** - funds go directly to creator

```
┌─────────────────────────────────────────────┐
│            🎯 Zap Goal                       │
│                                             │
│  New Podcast Equipment                      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 75%       │
│  750,000 / 1,000,000 sats                   │
│                                             │
│  23 supporters                              │
│                                 [⚡ Zap]     │
└─────────────────────────────────────────────┘
```

## Creating a Zap Goal

### Goal Event (kind 9041)

```json
{
  "kind": 9041,
  "pubkey": "creator_pubkey",
  "content": "Help me buy new podcast equipment! I want to upgrade my microphone and audio interface to bring you better quality content.",
  "tags": [
    ["amount", "1000000"],
    ["relays", "wss://relay.damus.io", "wss://nos.lol"],
    ["image", "https://example.com/goal-image.png"],
    ["summary", "New Podcast Equipment"],
    ["r", "https://example.com/more-info"],
    ["a", "30023:pubkey:d-tag"]
  ],
  "created_at": 1234567890
}
```

### Tag Reference

| Tag | Required | Purpose |
|-----|----------|---------|
| `amount` | Yes | Target in millisatoshis |
| `relays` | Yes | Where zap receipts go |
| `image` | No | Visual for the goal |
| `summary` | No | Short title |
| `r` | No | Link to more info |
| `a` | No | Related content event |
| `closed_at` | No | Deadline timestamp |

## Supporting a Goal

### How to Contribute

1. Find the Zap Goal event
2. Click zap/contribute button
3. Choose amount
4. Confirm payment
5. Your zap appears on the goal

### Zaps to Goals

When zapping a goal, the zap request references the goal event:

```json
{
  "kind": 9734,
  "tags": [
    ["e", "goal_event_id"],
    ["p", "creator_pubkey"],
    ["amount", "10000"]
  ]
}
```

## Progress Tracking

### Calculating Progress

Clients calculate progress by:
1. Fetching all zap receipts (kind 9735) for the goal
2. Summing the amounts
3. Comparing to target

```javascript
async function getGoalProgress(goalEventId) {
  const zapReceipts = await fetchEvents({
    kinds: [9735],
    "#e": [goalEventId]
  });

  const total = zapReceipts.reduce((sum, receipt) => {
    const amount = extractAmount(receipt);
    return sum + amount;
  }, 0);

  return total;
}
```

### Display Example

```
Goal: 1,000,000 sats
Raised: 750,000 sats
Progress: 75%
Contributors: 23
```

## Use Cases

### Personal Projects

- Equipment upgrades
- Travel for conferences
- Education/learning
- Emergency funds

### Open Source Development

- Feature bounties
- Maintenance funding
- Security audits
- Documentation

### Community Initiatives

- Event hosting
- Charity drives
- Public goods
- Infrastructure

### Creative Projects

- Album production
- Art commissions
- Video content
- Writing projects

## Funding Platforms

### Geyser Fund

[Geyser](https://geyser.fund) is a dedicated Nostr-native crowdfunding platform:

- Project pages with descriptions
- Milestone tracking
- Community engagement
- Lightning + on-chain payments

### Direct Zap Goals

Create goals directly in Nostr clients:
- Damus
- Amethyst
- Primal
- Nostrudel

## Best Practices

### For Campaign Creators

1. **Clear description** - Explain what funds are for
2. **Realistic target** - Set achievable goals
3. **Regular updates** - Keep supporters informed
4. **Accountability** - Deliver on promises
5. **Gratitude** - Thank contributors

### Campaign Structure

```markdown
## Goal Title
Brief, compelling summary

## What This Funds
- Item 1: X sats
- Item 2: Y sats
- Item 3: Z sats

## Why It Matters
Explain the impact

## Timeline
When you'll deliver

## Updates
Regular progress reports
```

### For Supporters

1. **Research** - Understand what you're funding
2. **Start small** - Test with small amounts
3. **Track progress** - Follow updates
4. **Spread the word** - Help amplify

## Comparison with Traditional Crowdfunding

| Aspect | Traditional | Zap Goals |
|--------|-------------|-----------|
| Platform Fee | 5-10% | 0% |
| Payment Methods | Credit card | Lightning |
| Geographic Access | Limited | Global |
| Identity Required | Yes | No |
| Censorship | Platform controlled | Decentralized |
| Speed | Days to receive | Instant |

## Example Campaigns

### Equipment Fundraiser

```json
{
  "kind": 9041,
  "content": "Upgrading my streaming setup to bring you better content!",
  "tags": [
    ["amount", "500000000"],
    ["summary", "Stream Equipment Upgrade"],
    ["image", "https://example.com/stream-setup.png"]
  ]
}
```

### Open Source Bounty

```json
{
  "kind": 9041,
  "content": "Bounty for implementing dark mode in the Nostr client. First to submit accepted PR gets the funds!",
  "tags": [
    ["amount", "100000000"],
    ["summary", "Dark Mode Bounty"],
    ["r", "https://github.com/example/repo/issues/42"]
  ]
}
```

## Related Standards

- [NIP-57: Lightning Zaps](/nips/nip-57)
- [NIP-47: Nostr Wallet Connect](/nips/nip-47)
- [NIP-88: Recurring Subscriptions](/payments/subscriptions)

## Notable Funding

### OpenSats Nostr Fund

The [OpenSats Nostr Fund](https://opensats.org/funds/nostr) provides grants for Nostr development:
- Client improvements
- Protocol upgrades
- Community growth
- Education initiatives

### Jack Dorsey's Support

Jack Dorsey has donated significant amounts to Nostr development:
- $250,000 in Bitcoin (2023)
- $10 million cash donation (2025)

---

:::tip Transparency Advantage
Unlike traditional crowdfunding where only the platform knows the true funding status, Zap Goals are publicly verifiable. Anyone can sum up the zap receipts and confirm the progress.
:::
