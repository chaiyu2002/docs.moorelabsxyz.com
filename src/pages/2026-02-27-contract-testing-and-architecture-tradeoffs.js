import {useEffect} from 'react';
import Layout from '@theme/Layout';

const TARGET_PATH =
  '/blog/2026-02-27-contract-testing-and-architecture-tradeoffs';

export default function LegacyFebruary27PostRedirect() {
  useEffect(() => {
    window.location.replace(TARGET_PATH);
  }, []);

  return (
    <Layout title="Redirecting...">
      <main style={{padding: '4rem 1.5rem', textAlign: 'center'}}>
        <p>
          Redirecting to the correct post URL. If the redirect does not happen,
          {' '}
          <a href={TARGET_PATH}>open the article here</a>.
        </p>
      </main>
    </Layout>
  );
}
