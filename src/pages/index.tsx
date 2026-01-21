import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={styles.hero}>
      <div className={styles.heroBackground}>
        <div className={styles.heroGrid}></div>
        <div className={styles.heroGlow}></div>
        <div className={styles.heroGlow2}></div>
        <div className={styles.heroOrb}></div>
        <div className={styles.heroOrb2}></div>
      </div>
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.heroTagline}>
            <span className={styles.heroTagIcon}>&#x20BF;</span>
            <span>Taproot Native Protocol</span>
          </div>
          <Heading as="h1" className={styles.heroTitle}>
            Your Nostr Keys
            <span className={styles.heroTitleBreak}></span>
            <span className={styles.heroHighlight}>Are Bitcoin Keys</span>
          </Heading>
          <p className={styles.heroSubtitle}>
            One cryptographic identity for communication and value transfer.
            No bridges. No wrapping. Just native Bitcoin.
          </p>
          <div className={styles.heroButtons}>
            <Link className={styles.primaryButton} to="/getting-started/introduction">
              <span>Get Started</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link className={styles.secondaryButton} to="/wallets/taproot">
              <span>Explore Taproot</span>
            </Link>
          </div>

          <div className={styles.keyVisual}>
            <div className={styles.keyCard}>
              <div className={styles.keyCardGlow}></div>
              <div className={styles.keyRow}>
                <div className={styles.keyItem}>
                  <span className={styles.keyPrefix}>nsec</span>
                  <span className={styles.keyDots}>••••••••</span>
                </div>
                <div className={styles.keyLabel}>Private Key</div>
              </div>
              <div className={styles.keyDivider}>
                <div className={styles.keyDividerLine}></div>
                <span className={styles.keyDividerText}>secp256k1</span>
                <div className={styles.keyDividerLine}></div>
              </div>
              <div className={styles.keyOutputRow}>
                <div className={styles.keyOutput}>
                  <div className={styles.keyOutputIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <code className={styles.keyOutputCode}>npub1...</code>
                  <span className={styles.keyOutputLabel}>Nostr Identity</span>
                </div>
                <div className={styles.keyEquals}>=</div>
                <div className={styles.keyOutput}>
                  <div className={clsx(styles.keyOutputIcon, styles.keyOutputIconBtc)}>
                    <span>&#x20BF;</span>
                  </div>
                  <code className={clsx(styles.keyOutputCode, styles.keyOutputCodeBtc)}>bc1p...</code>
                  <span className={styles.keyOutputLabel}>Bitcoin Address</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.heroScroll}>
        <span>Scroll to explore</span>
        <div className={styles.heroScrollIcon}>
          <div className={styles.heroScrollDot}></div>
        </div>
      </div>
    </header>
  );
}

function StatsSection() {
  const stats = [
    { value: 'secp256k1', label: 'Shared Cryptography' },
    { value: '32 bytes', label: 'X-Only Public Keys' },
    { value: 'Schnorr', label: 'Signature Scheme' },
    { value: '∞', label: 'Possibilities' },
  ];

  return (
    <section className={styles.stats}>
      <div className="container">
        <div className={styles.statsGrid}>
          {stats.map((stat, idx) => (
            <div key={idx} className={styles.statItem}>
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({icon, title, description, link, accent}: {icon: ReactNode, title: string, description: string, link: string, accent?: string}) {
  return (
    <Link to={link} className={styles.featureCard} style={{'--accent': accent} as React.CSSProperties}>
      <div className={styles.featureCardInner}>
        <div className={styles.featureIcon}>{icon}</div>
        <h3 className={styles.featureTitle}>{title}</h3>
        <p className={styles.featureDesc}>{description}</p>
        <div className={styles.featureArrow}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </div>
    </Link>
  );
}

function FeaturesSection() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>Capabilities</span>
          <h2 className={styles.sectionTitle}>Finance Primitives</h2>
          <p className={styles.sectionSubtitle}>Everything you need for Bitcoin payments on Nostr</p>
        </div>
        <div className={styles.featuresGrid}>
          <FeatureCard
            icon={<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>}
            title="Lightning Zaps"
            description="Instant micropayments tied to content. One-click tipping with cryptographic proof and social signals."
            link="/payments/zaps"
            accent="#F7931A"
          />
          <FeatureCard
            icon={<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>}
            title="Wallet Connect"
            description="Connect any Lightning wallet via NWC protocol. Universal integration with spending limits."
            link="/wallets/nwc"
            accent="#8B5CF6"
          />
          <FeatureCard
            icon={<span style={{fontSize: '28px', fontWeight: 700}}>&#x20BF;</span>}
            title="On-Chain Payments"
            description="Native P2TR support. Your Nostr public key derives directly to a Taproot address."
            link="/payments/onchain"
            accent="#F7931A"
          />
          <FeatureCard
            icon={<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>}
            title="Taproot Native"
            description="secp256k1 everywhere. One key pair for identity and value. No bridges needed."
            link="/wallets/taproot"
            accent="#22C55E"
          />
          <FeatureCard
            icon={<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>}
            title="Marketplaces"
            description="Peer-to-peer commerce with Bitcoin. NIP-15 stalls and products with no intermediaries."
            link="/marketplaces/overview"
            accent="#EC4899"
          />
          <FeatureCard
            icon={<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>}
            title="Decentralized ID"
            description="DID:Nostr for W3C-compliant identity verification using cryptographic keys."
            link="/identity/did-nostr"
            accent="#06B6D4"
          />
        </div>
      </div>
    </section>
  );
}

function TaprootSection() {
  return (
    <section className={styles.taproot}>
      <div className="container">
        <div className={styles.taprootGrid}>
          <div className={styles.taprootContent}>
            <span className={styles.sectionTag}>Core Innovation</span>
            <h2 className={styles.taprootTitle}>
              Nostr is <span className={styles.taprootHighlight}>Taproot Native</span>
            </h2>
            <p className={styles.taprootDesc}>
              Both Nostr and Bitcoin Taproot use the same <strong>secp256k1</strong> elliptic curve
              with <strong>x-only public keys</strong>. This cryptographic alignment means your
              Nostr identity can directly control Bitcoin.
            </p>
            <div className={styles.taprootFeatures}>
              <div className={styles.taprootFeature}>
                <div className={styles.taprootFeatureIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <span>Your npub derives a P2TR Bitcoin address</span>
              </div>
              <div className={styles.taprootFeature}>
                <div className={styles.taprootFeatureIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <span>No bridges, wrapping, or intermediaries</span>
              </div>
              <div className={styles.taprootFeature}>
                <div className={styles.taprootFeatureIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <span>One key for communication and value</span>
              </div>
              <div className={styles.taprootFeature}>
                <div className={styles.taprootFeatureIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <span>Schnorr signatures on both protocols</span>
              </div>
            </div>
            <Link to="/wallets/taproot" className={styles.taprootButton}>
              <span>Learn Taproot Integration</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
          <div className={styles.taprootVisual}>
            <div className={styles.cryptoCard}>
              <div className={styles.cryptoCardHeader}>
                <span className={styles.cryptoCardDot}></span>
                <span className={styles.cryptoCardDot}></span>
                <span className={styles.cryptoCardDot}></span>
              </div>
              <div className={styles.cryptoCardContent}>
                <div className={styles.cryptoLine}>
                  <span className={styles.cryptoKeyword}>curve</span>
                  <span className={styles.cryptoOperator}>:</span>
                  <span className={styles.cryptoString}>"secp256k1"</span>
                </div>
                <div className={styles.cryptoLine}>
                  <span className={styles.cryptoKeyword}>pubkey</span>
                  <span className={styles.cryptoOperator}>:</span>
                  <span className={styles.cryptoString}>"x-only (32 bytes)"</span>
                </div>
                <div className={styles.cryptoLine}>
                  <span className={styles.cryptoKeyword}>signature</span>
                  <span className={styles.cryptoOperator}>:</span>
                  <span className={styles.cryptoString}>"Schnorr"</span>
                </div>
                <div className={styles.cryptoDivider}></div>
                <div className={styles.cryptoLine}>
                  <span className={styles.cryptoComment}>// Nostr + Bitcoin = Same keys</span>
                </div>
                <div className={styles.cryptoLine}>
                  <span className={styles.cryptoKeyword}>npub</span>
                  <span className={styles.cryptoOperator}>{" → "}</span>
                  <span className={styles.cryptoValue}>bc1p</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function NIPsSection() {
  const nips = [
    { number: '47', title: 'Nostr Wallet Connect', desc: 'Wallet ↔ App communication protocol', icon: '🔗' },
    { number: '57', title: 'Lightning Zaps', desc: 'Payments tied to events and users', icon: '⚡' },
    { number: '75', title: 'Zap Goals', desc: 'Crowdfunding targets with progress', icon: '🎯' },
  ];

  return (
    <section className={styles.nips}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>Specifications</span>
          <h2 className={styles.sectionTitle}>Finance NIPs</h2>
          <p className={styles.sectionSubtitle}>Protocol specifications powering Nostr payments</p>
        </div>
        <div className={styles.nipsGrid}>
          {nips.map((nip) => (
            <Link key={nip.number} to={`/nips/nip-${nip.number}`} className={styles.nipCard}>
              <div className={styles.nipIcon}>{nip.icon}</div>
              <div className={styles.nipContent}>
                <span className={styles.nipNumber}>NIP-{nip.number}</span>
                <h3 className={styles.nipTitle}>{nip.title}</h3>
                <p className={styles.nipDesc}>{nip.desc}</p>
              </div>
              <div className={styles.nipArrow}>→</div>
            </Link>
          ))}
        </div>
        <div className={styles.nipsMore}>
          <Link to="/nips/overview" className={styles.nipsMoreLink}>
            View all Finance NIPs
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

function StandardsSection() {
  return (
    <section className={styles.standards}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>Infrastructure</span>
          <h2 className={styles.sectionTitle}>Standards & Protocols</h2>
          <p className={styles.sectionSubtitle}>Building blocks for financial infrastructure</p>
        </div>
        <div className={styles.standardsGrid}>
          <Link to="/standards/webledgers" className={styles.standardCard}>
            <div className={styles.standardIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
            </div>
            <h3>Web Ledgers</h3>
            <p>Universal balance mapping specification for consistent representation across platforms.</p>
          </Link>
          <Link to="/standards/blocktrails" className={styles.standardCard}>
            <div className={styles.standardIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <line x1="3" y1="9" x2="21" y2="9"/>
                <line x1="9" y1="21" x2="9" y2="9"/>
              </svg>
            </div>
            <h3>Blocktrails</h3>
            <p>Anchoring evolving state to Bitcoin using key tweaking for provable timestamps.</p>
          </Link>
          <Link to="/identity/did-nostr" className={styles.standardCard}>
            <div className={styles.standardIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <h3>DID:Nostr</h3>
            <p>W3C-compliant decentralized identifiers using Nostr cryptographic keys.</p>
          </Link>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className={styles.cta}>
      <div className={styles.ctaBackground}>
        <div className={styles.ctaGlow}></div>
        <div className={styles.ctaGrid}></div>
      </div>
      <div className="container">
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Ready to Build?</h2>
          <p className={styles.ctaDesc}>
            Start integrating native Bitcoin payments into your Nostr application today.
          </p>
          <div className={styles.ctaButtons}>
            <Link to="/getting-started/quick-start" className={styles.primaryButton}>
              <span>Quick Start Guide</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link to="https://github.com/nostrfinance/nostrfinance.github.io" className={styles.ctaGhButton}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span>View on GitHub</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Bitcoin Payments, Taproot Native"
      description="The complete guide to Bitcoin, Lightning, and Taproot payments on Nostr. Your Nostr keys are Bitcoin keys.">
      <HomepageHeader />
      <main>
        <StatsSection />
        <FeaturesSection />
        <TaprootSection />
        <NIPsSection />
        <StandardsSection />
        <CTASection />
      </main>
    </Layout>
  );
}
