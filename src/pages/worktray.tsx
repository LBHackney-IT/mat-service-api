import * as React from 'react';
import Head from 'next/head';
import Worktray, {
  sampleWorkTrayColumns,
  sampleWorkTrayRows,
} from '../components/worktray';
import Layout from '../components/layout'

export default function WorkTray() {
  return (
    <Layout>
      <div>
        <div className="container">
          <Head>
            <title>Manage A Tenancy</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <main>
            <Worktray columns={sampleWorkTrayColumns} rows={sampleWorkTrayRows} />
          </main>
        </div>
      </div>
    </Layout>
  );
}
