---
sidebar_position: 6
title: NIP-75 (Zap Goals)
description: Crowdfunding specification
---

# NIP-75: Zap Goals

[NIP-75](https://github.com/nostr-protocol/nips/blob/master/75.md) defines Zap Goals - fundraising targets that can be funded via zaps, enabling decentralized crowdfunding on Nostr.

## Summary

| Aspect | Detail |
|--------|--------|
| **Kind** | 9041 |
| **Purpose** | Crowdfunding targets |
| **Status** | Merged |
| **Depends on** | NIP-01, NIP-57 |

## Overview

Zap Goals enable:
- Public fundraising campaigns
- Progress tracking via zaps
- Transparent funding status
- No platform intermediary

## Goal Event (kind 9041)

```json
{
  "kind": 9041,
  "pubkey": "creator_pubkey",
  "created_at": 1234567890,
  "content": "Help me buy new podcast equipment! I need to upgrade my microphone and audio interface for better content quality.",
  "tags": [
    ["amount", "1000000000"],
    ["relays", "wss://relay.damus.io", "wss://nos.lol"],
    ["summary", "Podcast Equipment Upgrade"],
    ["image", "https://example.com/goal.jpg"],
    ["r", "https://example.com/details"],
    ["closed_at", "1735689600"]
  ]
}
```

## Tags Reference

### Required Tags

| Tag | Description |
|-----|-------------|
| `amount` | Target in millisatoshis |
| `relays` | Where zap receipts should go |

### Optional Tags

| Tag | Description |
|-----|-------------|
| `summary` | Short title |
| `image` | Goal image URL |
| `r` | Link to more information |
| `a` | Related addressable event |
| `closed_at` | Deadline (Unix timestamp) |
| `zapraiser` | For zapraiser events |

## Content

The `content` field contains a human-readable description:
- Explain what the funds are for
- Provide context and motivation
- Can use markdown formatting

## Calculating Progress

### Zap to Goal

When zapping a goal, include the goal event:

```json
{
  "kind": 9734,
  "tags": [
    ["e", "goal_event_id"],
    ["p", "creator_pubkey"],
    ["amount", "10000000"]
  ]
}
```

### Counting Zaps

```javascript
async function getGoalProgress(goalId) {
  // Fetch all zap receipts for this goal
  const zapReceipts = await fetchEvents({
    kinds: [9735],
    '#e': [goalId]
  });

  let total = 0;
  for (const receipt of zapReceipts) {
    // Verify receipt is valid
    if (validateZapReceipt(receipt)) {
      // Extract amount from bolt11 or description
      const amount = extractAmount(receipt);
      total += amount;
    }
  }

  return total;
}

function extractAmount(receipt) {
  // From description tag (contains original request)
  const description = receipt.tags.find(t => t[0] === 'description');
  if (description) {
    const request = JSON.parse(description[1]);
    const amountTag = request.tags.find(t => t[0] === 'amount');
    if (amountTag) {
      return parseInt(amountTag[1]);
    }
  }

  // Fallback: parse bolt11
  const bolt11 = receipt.tags.find(t => t[0] === 'bolt11');
  if (bolt11) {
    return decodeBolt11Amount(bolt11[1]);
  }

  return 0;
}
```

### Display Progress

```javascript
async function displayGoalProgress(goal) {
  const targetMsats = parseInt(goal.tags.find(t => t[0] === 'amount')[1]);
  const targetSats = targetMsats / 1000;

  const raisedMsats = await getGoalProgress(goal.id);
  const raisedSats = raisedMsats / 1000;

  const percentage = Math.min(100, (raisedMsats / targetMsats) * 100);

  return {
    target: targetSats,
    raised: raisedSats,
    percentage: percentage.toFixed(1),
    remaining: Math.max(0, targetSats - raisedSats)
  };
}
```

## Implementation

### Creating a Goal

```javascript
async function createGoal(options) {
  const { amount, summary, description, image, deadline, relays } = options;

  const tags = [
    ['amount', String(amount * 1000)], // Convert to millisats
    ['relays', ...relays]
  ];

  if (summary) tags.push(['summary', summary]);
  if (image) tags.push(['image', image]);
  if (deadline) tags.push(['closed_at', String(deadline)]);

  const goal = {
    kind: 9041,
    pubkey: myPubkey,
    created_at: Math.floor(Date.now() / 1000),
    content: description,
    tags
  };

  goal.id = getEventHash(goal);
  goal.sig = signEvent(goal, myPrivkey);

  await publishToRelays(goal, relays);
  return goal;
}
```

### Contributing to a Goal

```javascript
async function contributeToGoal(goalId, goalPubkey, amount, message) {
  // Create zap request targeting the goal
  const zapRequest = {
    kind: 9734,
    pubkey: myPubkey,
    created_at: Math.floor(Date.now() / 1000),
    content: message || '',
    tags: [
      ['e', goalId],
      ['p', goalPubkey],
      ['amount', String(amount * 1000)],
      ['relays', 'wss://relay.damus.io']
    ]
  };

  // Get invoice and pay via standard zap flow
  const invoice = await getZapInvoice(zapRequest, goalPubkey);
  await wallet.payInvoice(invoice);
}
```

### Monitoring Goal Progress

```javascript
class GoalMonitor {
  constructor(goalId) {
    this.goalId = goalId;
    this.raised = 0;
    this.contributors = new Set();
  }

  async start(relays) {
    // Initial fetch
    await this.refresh();

    // Subscribe to new zaps
    const filter = {
      kinds: [9735],
      '#e': [this.goalId],
      since: Math.floor(Date.now() / 1000)
    };

    for (const relay of relays) {
      relay.subscribe(filter, (receipt) => {
        this.processReceipt(receipt);
      });
    }
  }

  async refresh() {
    const receipts = await fetchEvents({
      kinds: [9735],
      '#e': [this.goalId]
    });

    this.raised = 0;
    this.contributors.clear();

    for (const receipt of receipts) {
      this.processReceipt(receipt);
    }
  }

  processReceipt(receipt) {
    if (validateZapReceipt(receipt)) {
      const amount = extractAmount(receipt);
      const sender = receipt.tags.find(t => t[0] === 'P')?.[1];

      this.raised += amount;
      if (sender) this.contributors.add(sender);

      this.onUpdate?.(this.getStatus());
    }
  }

  getStatus() {
    return {
      raised: this.raised / 1000, // sats
      contributorCount: this.contributors.size
    };
  }
}
```

## UI Example

```
┌─────────────────────────────────────────────┐
│  🎯 Podcast Equipment Upgrade               │
│                                             │
│  Help me buy new recording equipment!       │
│                                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 75%      │
│  750,000 / 1,000,000 sats                   │
│                                             │
│  👥 42 contributors                         │
│  ⏰ 5 days remaining                        │
│                                             │
│            [⚡ Contribute]                   │
└─────────────────────────────────────────────┘
```

## Best Practices

### For Creators

1. **Clear description** - Explain use of funds
2. **Realistic target** - Set achievable amount
3. **Visual appeal** - Include image
4. **Updates** - Post progress updates
5. **Accountability** - Report how funds are used

### For Contributors

1. **Verify creator** - Check reputation
2. **Understand goal** - Read description
3. **Track progress** - Watch for updates

## Resources

- [NIP-75 Specification](https://github.com/nostr-protocol/nips/blob/master/75.md)
- [NIP-57: Zaps](/nips/nip-57)
- [Crowdfunding Guide](/payments/crowdfunding)

---

:::tip Transparent Funding
Unlike traditional crowdfunding, Zap Goal progress is publicly verifiable. Anyone can sum the zap receipts and confirm the actual funding status.
:::
