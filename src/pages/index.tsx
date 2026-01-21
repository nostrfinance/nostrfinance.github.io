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
        <div className={styles.heroGradient}></div>
      </div>
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.heroTag}>Taproot Native</div>
          <Heading as="h1" className={styles.heroTitle}>
            Your Nostr Keys<br />
            <span className={styles.heroHighlight}>Are Bitcoin Keys</span>
          </Heading>
          <p className={styles.heroSubtitle}>
            The complete guide to Bitcoin, Lightning, and on-chain payments on Nostr.
            Same cryptography. Unified identity. Native value transfer.
          </p>
          <div className={styles.heroButtons}>
            <Link
              className={styles.primaryButton}
              to="/getting-started/introduction">
              Get Started
            </Link>
            <Link
              className={styles.secondaryButton}
              to="/wallets/taproot">
              Explore Taproot
            </Link>
          </div>
          <div className={styles.heroCode}>
            <code>npub... → bc1p...</code>
            <span className={styles.heroCodeLabel}>Same key, different encoding</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function FeatureCard({icon, title, description, link}: {icon: string, title: string, description: string, link: string}) {
  return (
    <Link to={link} className={styles.featureCard}>
      <div className={styles.featureIcon}>{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      <span className={styles.featureArrow}>→</span>
    </Link>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: '⚡',
      title: 'Lightning Zaps',
      description: 'Instant micropayments tied to content. One-click tipping with social proof.',
      link: '/payments/zaps',
    },
    {
      icon: '🔗',
      title: 'Wallet Connect',
      description: 'Connect any Lightning wallet via NWC. Universal wallet integration.',
      link: '/wallets/nwc',
    },
    {
      icon: '₿',
      title: 'On-Chain Payments',
      description: 'Native P2TR support. Your npub is your Bitcoin address.',
      link: '/payments/onchain',
    },
    {
      icon: '🔐',
      title: 'Taproot Native',
      description: 'secp256k1 everywhere. One key for identity and value.',
      link: '/wallets/taproot',
    },
    {
      icon: '🏪',
      title: 'Marketplaces',
      description: 'Peer-to-peer commerce with Bitcoin. No intermediaries.',
      link: '/marketplaces/overview',
    },
    {
      icon: '🌐',
      title: 'Decentralized ID',
      description: 'DID:Nostr for W3C-compliant identity verification.',
      link: '/identity/did-nostr',
    },
  ];

  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2>Finance Primitives</h2>
          <p>Everything you need for Bitcoin payments on Nostr</p>
        </div>
        <div className={styles.featuresGrid}>
          {features.map((feature, idx) => (
            <FeatureCard key={idx} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TaprootSection() {
  return (
    <section className={styles.taproot}>
      <div className="container">
        <div className={styles.taprootContent}>
          <div className={styles.taprootText}>
            <div className={styles.taprootTag}>Why This Matters</div>
            <h2>Nostr is Taproot Native</h2>
            <p>
              Both Nostr and Bitcoin Taproot use <strong>secp256k1</strong> cryptography
              with <strong>x-only public keys</strong>. This isn't a coincidence—it's by design.
            </p>
            <ul className={styles.taprootList}>
              <li>
                <span className={styles.taprootCheck}>✓</span>
                Your Nostr identity can directly hold Bitcoin
              </li>
              <li>
                <span className={styles.taprootCheck}>✓</span>
                No bridges, wrapping, or intermediaries
              </li>
              <li>
                <span className={styles.taprootCheck}>✓</span>
                One key pair for communication and value
              </li>
              <li>
                <span className={styles.taprootCheck}>✓</span>
                P2TR addresses derived from your npub
              </li>
            </ul>
            <Link to="/wallets/taproot" className={styles.taprootLink}>
              Learn about Taproot integration →
            </Link>
          </div>
          <div className={styles.taprootVisual}>
            <div className={styles.keyDiagram}>
              <div className={styles.keyBox}>
                <span className={styles.keyLabel}>Private Key</span>
                <code>nsec1...</code>
              </div>
              <div className={styles.keyArrow}>↓</div>
              <div className={styles.keyBox}>
                <span className={styles.keyLabel}>Public Key (x-only)</span>
                <code>32 bytes</code>
              </div>
              <div className={styles.keyBranch}>
                <div className={styles.keyArrowLeft}>↙</div>
                <div className={styles.keyArrowRight}>↘</div>
              </div>
              <div className={styles.keyOutputs}>
                <div className={styles.keyOutput}>
                  <span className={styles.keyLabel}>Nostr</span>
                  <code>npub1...</code>
                </div>
                <div className={styles.keyOutput}>
                  <span className={styles.keyLabel}>Bitcoin</span>
                  <code>bc1p...</code>
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
    { number: '47', title: 'Nostr Wallet Connect', description: 'Wallet ↔ App communication' },
    { number: '57', title: 'Lightning Zaps', description: 'Payments tied to events' },
    { number: '75', title: 'Zap Goals', description: 'Crowdfunding targets' },
  ];

  return (
    <section className={styles.nips}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2>Finance NIPs</h2>
          <p>Protocol specifications for payments</p>
        </div>
        <div className={styles.nipsGrid}>
          {nips.map((nip) => (
            <Link key={nip.number} to={`/nips/nip-${nip.number}`} className={styles.nipCard}>
              <span className={styles.nipNumber}>NIP-{nip.number}</span>
              <span className={styles.nipTitle}>{nip.title}</span>
              <span className={styles.nipDesc}>{nip.description}</span>
            </Link>
          ))}
        </div>
        <div className={styles.nipsLink}>
          <Link to="/nips/overview">View all Finance NIPs →</Link>
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
          <h2>Standards & Specifications</h2>
          <p>Building blocks for financial infrastructure</p>
        </div>
        <div className={styles.standardsGrid}>
          <Link to="/standards/webledgers" className={styles.standardCard}>
            <h3>Web Ledgers</h3>
            <p>Universal balance mapping specification for consistent representation across platforms.</p>
          </Link>
          <Link to="/standards/blocktrails" className={styles.standardCard}>
            <h3>Blocktrails</h3>
            <p>Anchoring evolving state to Bitcoin using key tweaking for provable timestamps.</p>
          </Link>
          <Link to="/identity/did-nostr" className={styles.standardCard}>
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
      <div className="container">
        <div className={styles.ctaContent}>
          <h2>Ready to Build?</h2>
          <p>Start integrating Bitcoin payments into your Nostr application today.</p>
          <div className={styles.ctaButtons}>
            <Link to="/getting-started/quick-start" className={styles.primaryButton}>
              Quick Start Guide
            </Link>
            <Link to="https://github.com/nostrfinance/nostrfinance.github.io" className={styles.secondaryButton}>
              View on GitHub
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
        <FeaturesSection />
        <TaprootSection />
        <NIPsSection />
        <StandardsSection />
        <CTASection />
      </main>
    </Layout>
  );
}
