import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Worktray, { workTrayColumns, Row } from '../components/worktray';
import { ErrorMessage } from 'lbh-frontend-react';
import Layout from '../components/layout';
import LoadingPage from '../components/loadingPage';
import getTasksByOfficerEmail from '../usecases/ui/getTasksByOfficerEmail';

type FetchState = 'fetching' | 'error' | 'done';

export default function Home() {
  const [tasks, setTasks] = useState<Row[]>([]);
  const [fetchState, setFetchState]: [FetchState, any] = useState<FetchState>(
    'fetching'
  );

  useEffect(() => {
    getTasksByOfficerEmail()
      .then((tasks) => {
        console.log(tasks);

        setTasks(tasks);
        setFetchState('done');
      })
      .catch((e) => {
        console.log(e);

        setFetchState('error');
      });
  }, []);

  if (fetchState === 'done') {
    return (
      <Layout>
        <div>
          <div className="container">
            <Head>
              <title>Manage A Tenancy</title>
              <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
              <Worktray columns={workTrayColumns} rows={tasks} />
            </main>
          </div>
        </div>

        <style jsx>{`
          .message {
            font-weight: 700;
            font-size: 1.1875rem;
          }
        `}</style>
      </Layout>
    );
  } else {
    return <LoadingPage error={fetchState === 'error'} />;
  }
}
