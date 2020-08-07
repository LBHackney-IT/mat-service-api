import * as React from 'react';
import Layout from '../../components/layout';
import { GetServerSideProps } from 'next'
import { Heading, HeadingLevels, Link } from 'lbh-frontend-react';
import fetch from "isomorphic-unfetch";

interface Props {
  id?: string;
}

export default function Task(props: Props) {

  return (
    <Layout>
      <div className="lbh-container">
        <div className="loginPage">
          <Heading level={HeadingLevels.H1}>Please log {props.id} in</Heading>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {

  const taskId = context.query ? context.query.id : undefined;

  if (taskId) {
    const queryPath = process.env.API_PATH + "/tasks/" + taskId;

    const response = await fetch(queryPath, {
      method: "GET"
    });

    const data = await response.json();

    return { props: data };
  }

  return { props: {} };
}
