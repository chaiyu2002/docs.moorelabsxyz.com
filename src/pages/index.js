import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

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
        <p className="hero__subtitle">
          Exploring Financial Products and Infrastructure on{' '}
          <a
            className={styles.heroLink}
            href="https://docs.lyquor.dev/"
            target="_blank"
            rel="noreferrer">
            Lyquor
          </a>
        </p>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="MooreLabsxyz documents project progress and research notes for financial products and infrastructure on Lyquor.">
      <HomepageHeader />
    </Layout>
  );
}
