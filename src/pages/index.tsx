import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Worktray, { sampleWorkTrayColumns, Row } from '../components/worktray';
import Layout from '../components/layout';
import getTasksByOfficerEmail from '../usecases/ui/getTasksByOfficerEmail';

export default function Home() {
  const [tasks, setTasks] = useState<Row[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const fetchedTasks = await getTasksByOfficerEmail();
      setTasks(fetchedTasks);
    };
    fetchTasks();
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
            <Worktray columns={sampleWorkTrayColumns} rows={tasks} />
          </main>
        </div>
      </div>
    </Layout>
  );
}
