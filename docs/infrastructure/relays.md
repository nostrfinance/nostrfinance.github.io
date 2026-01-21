---
sidebar_position: 1
title: Nostr Relays
description: Understanding relay infrastructure for finance
---

# Nostr Relays

Relays are the servers that store and forward Nostr events. For financial applications, relay selection and reliability are critical considerations.

## What Are Relays?

Relays are:
- **Message brokers** that accept and serve events
- **Decentralized** - anyone can run one
- **Independent** - each has its own policies
- **The backbone** of Nostr's infrastructure

```
┌────────┐     ┌────────┐     ┌────────┐
│ Client │◄───►│ Relay  │◄───►│ Client │
└────────┘     └────────┘     └────────┘
     │              │              │
     └──────────────┼──────────────┘
                    │
               ┌────────┐
               │ Relay  │
               └────────┘
```

## Relay Types

### Free Relays

Open to everyone:
- No cost to write/read
- Often run by enthusiasts
- May have limited retention
- Higher spam potential

### Paid Relays

Require payment:
- One-time or subscription fee
- Better spam filtering
- Higher reliability
- Longer data retention

### Private Relays

Restricted access:
- Whitelist-based
- Often for communities
- Maximum control
- Custom policies

## Relay Selection for Finance

### Critical Factors

| Factor | Importance | Why |
|--------|------------|-----|
| **Uptime** | Critical | Payments need delivery |
| **Retention** | High | Historical data access |
| **Speed** | High | Real-time transactions |
| **Privacy** | Medium | Financial data sensitivity |

### Recommended Strategy

```
Financial Events:
├── Primary: 2-3 reliable paid relays
├── Backup: 1-2 free relays
└── Personal: Your own relay (optional)
```

## Finance-Specific Considerations

### NWC Relays

For Nostr Wallet Connect:
- **Reliability** essential for payment flow
- Fast message delivery
- Good uptime record

Commonly used:
- `wss://relay.getalby.com/v1`
- `wss://nostr.mutinywallet.com`

### Zap Receipts

For zap receipt delivery:
- Include multiple relays in requests
- Use relays recipient is connected to
- Check relay list in profiles

### NutZaps

For Cashu payments:
- Publish to recipient's preferred relays
- Check kind 10019 for relay hints
- Ensure token delivery

## Running Your Own Relay

### Benefits

- **Full control** over your data
- **Guaranteed access** to your events
- **Privacy** from third parties
- **Custom policies**

### Options

| Software | Language | Features |
|----------|----------|----------|
| strfry | C++ | High performance |
| nostream | TypeScript | Feature-rich |
| nostr-rs-relay | Rust | Configurable |
| relay | Go | Simple setup |

### Basic Setup (strfry)

```bash
# Clone and build
git clone https://github.com/hoytech/strfry
cd strfry
make setup-golpe
make -j4

# Configure
cp strfry.conf myrelay.conf
# Edit configuration

# Run
./strfry relay
```

## Relay Policies

### Event Filtering

Relays can restrict:
- Event kinds accepted
- Pubkeys allowed
- Content types
- Event size

### Rate Limiting

Common limits:
- Events per minute
- Connections per IP
- Bandwidth per user

### Data Retention

Policies vary:
- Forever (rare)
- Time-based (e.g., 90 days)
- Size-based (newest kept)
- Kind-based (some permanent)

## Monitoring Relays

### Health Checks

```javascript
async function checkRelay(url) {
  try {
    const start = Date.now();
    const ws = new WebSocket(url);

    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
      setTimeout(reject, 5000);
    });

    const latency = Date.now() - start;
    ws.close();

    return { status: 'up', latency };
  } catch {
    return { status: 'down', latency: null };
  }
}
```

### Tools

- [nostr.watch](https://nostr.watch) - Relay monitoring
- [relay.tools](https://relay.tools) - Relay info
- Custom monitoring dashboards

## Best Practices

### For Users

1. **Use multiple relays** - Redundancy is key
2. **Include paid relays** - Better reliability
3. **Test regularly** - Ensure connectivity
4. **Backup data** - Don't rely solely on relays

### For Financial Apps

1. **Retry logic** - Handle failures gracefully
2. **Multiple paths** - Write to several relays
3. **Confirmation** - Verify event publication
4. **Timeouts** - Don't wait forever

### Example: Robust Publishing

```javascript
async function publishWithRetry(event, relays, maxRetries = 3) {
  const results = [];

  for (const relay of relays) {
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        await publishToRelay(event, relay);
        results.push({ relay, success: true });
        break;
      } catch (error) {
        attempt++;
        if (attempt === maxRetries) {
          results.push({ relay, success: false, error });
        }
        await sleep(1000 * attempt); // Exponential backoff
      }
    }
  }

  const successCount = results.filter(r => r.success).length;
  if (successCount === 0) {
    throw new Error('Failed to publish to any relay');
  }

  return results;
}
```

## Resources

- [Nostr.watch](https://nostr.watch)
- [Relay Implementations](https://github.com/aljazceru/awesome-nostr#relays)
- [Relay Economics](/infrastructure/economics)

---

:::tip Financial Reliability
For financial applications, relay reliability directly impacts user experience. Invest in good relay connections - a few dollars per month for paid relays is worthwhile insurance.
:::
