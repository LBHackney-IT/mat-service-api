import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Worktray, { sampleWorkTrayColumns, Row } from '../components/worktray';
import { ErrorMessage } from 'lbh-frontend-react';
import Layout from '../components/layout';
import getTasksByOfficerEmail from '../usecases/ui/getTasksByOfficerEmail';

type FetchState = 'fetching' | 'error' | 'done';

export default function Home() {
  const [tasks, setTasks] = useState<Row[]>([]);
  const [fetchState, setFetchState]: [FetchState, any] = useState('fetching');

  useEffect(() => {
    getTasksByOfficerEmail()
      .then((tasks) => {
        setTasks(tasks);
        setFetchState('done');
      })
      .catch((e) => {
        setFetchState('error');
      });
  }, []);

  return (
    <Layout>
      <div>
        <div className="container">
          <Head>
            <title>Manage A Tenancy</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <main>
            {
              {
                fetching: <p className="message">Fetching worktray items</p>,
                error: (
                  <ErrorMessage>Error fetching worktray items</ErrorMessage>
                ),
                done: <Worktray columns={sampleWorkTrayColumns} rows={tasks} />,
              }[fetchState]
            }
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
}
