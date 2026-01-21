import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/getting-started/introduction">
            Get Started
          </Link>
          <Link
            className="button button--outline button--lg"
            to="/payments/overview"
            style={{marginLeft: '1rem', color: 'white', borderColor: 'white'}}>
            Explore Payments
          </Link>
        </div>
      </div>
    </header>
  );
}

function QuickLinks() {
  return (
    <section className={styles.quickLinks}>
      <div className="container">
        <div className="row">
          <div className="col col--3">
            <Link to="/payments/zaps" className={styles.quickLink}>
              <div className={styles.quickLinkIcon}>&#9889;</div>
              <h3>Zaps</h3>
              <p>Lightning payments on Nostr</p>
            </Link>
          </div>
          <div className="col col--3">
            <Link to="/wallets/nwc" className={styles.quickLink}>
              <div className={styles.quickLinkIcon}>&#128279;</div>
              <h3>NWC</h3>
              <p>Nostr Wallet Connect</p>
            </Link>
          </div>
          <div className="col col--3">
            <Link to="/wallets/cashu" className={styles.quickLink}>
              <div className={styles.quickLinkIcon}>&#127856;</div>
              <h3>Cashu</h3>
              <p>Private eCash payments</p>
            </Link>
          </div>
          <div className="col col--3">
            <Link to="/marketplaces/overview" className={styles.quickLink}>
              <div className={styles.quickLinkIcon}>&#128722;</div>
              <h3>Marketplaces</h3>
              <p>Buy and sell on Nostr</p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function NIPsSection() {
  const nips = [
    { number: '47', title: 'Nostr Wallet Connect', link: '/nips/nip-47' },
    { number: '57', title: 'Lightning Zaps', link: '/nips/nip-57' },
    { number: '60', title: 'Cashu Wallet', link: '/nips/nip-60' },
    { number: '61', title: 'NutZaps', link: '/nips/nip-61' },
    { number: '75', title: 'Zap Goals', link: '/nips/nip-75' },
  ];

  return (
    <section className={styles.nipsSection}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Finance NIPs
        </Heading>
        <p className={styles.sectionSubtitle}>
          Key protocol specifications enabling finance on Nostr
        </p>
        <div className={styles.nipsGrid}>
          {nips.map((nip) => (
            <Link key={nip.number} to={nip.link} className={styles.nipCard}>
              <span className={styles.nipNumber}>NIP-{nip.number}</span>
              <span className={styles.nipTitle}>{nip.title}</span>
            </Link>
          ))}
        </div>
        <div style={{textAlign: 'center', marginTop: '2rem'}}>
          <Link to="/nips/overview" className="button button--primary">
            View All NIPs
          </Link>
        </div>
      </div>
    </section>
  );
}

function StandardsSection() {
  return (
    <section className={styles.standardsSection}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Standards & Specifications
        </Heading>
        <div className="row">
          <div className="col col--4">
            <div className={styles.standardCard}>
              <h3>Web Ledgers</h3>
              <p>Universal balance mapping specification for consistent balance representation across platforms.</p>
              <Link to="/standards/webledgers">Learn More</Link>
            </div>
          </div>
          <div className="col col--4">
            <div className={styles.standardCard}>
              <h3>Blocktrails</h3>
              <p>Anchoring evolving state to Bitcoin using key tweaking for provable timestamps.</p>
              <Link to="/standards/blocktrails">Learn More</Link>
            </div>
          </div>
          <div className="col col--4">
            <div className={styles.standardCard}>
              <h3>DID:Nostr</h3>
              <p>W3C-compliant decentralized identifiers using Nostr keys.</p>
              <Link to="/identity/did-nostr">Learn More</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="The Complete Guide to Finance on Nostr"
      description="Comprehensive documentation for Bitcoin, Lightning, eCash payments, wallets, marketplaces, and financial protocols on Nostr.">
      <HomepageHeader />
      <main>
        <QuickLinks />
        <HomepageFeatures />
        <NIPsSection />
        <StandardsSection />
      </main>
    </Layout>
  );
}
