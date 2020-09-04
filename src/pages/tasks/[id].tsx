import * as React from 'react';
import Layout from '../../components/layout';
import { GetServerSideProps } from 'next';
import {
  Heading,
  HeadingLevels,
  Paragraph,
  Label,
  Tile,
} from 'lbh-frontend-react';
// import fetch from 'isomorphic-unfetch';
// import absoluteUrl from 'next-absolute-url';
import { Task, TenancyType } from '../../interfaces/task';
import ErrorPage from 'next/error';
import HardcodedTask from '../../tests/helpers/hardcodedTask';

interface TaskProps {
  task: Task;
}

const mockTask: Task = HardcodedTask();

export default function TaskPage(props: TaskProps) {
  if (props.task === undefined) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <Layout>
      <Heading level={HeadingLevels.H2}>{props.task.type}</Heading>
      <Heading level={HeadingLevels.H3}>Tenancy</Heading>
      <Paragraph>
        <Label>Address:</Label>
        {props.task.address.presentationShort}
        <Label>Tenancy type:</Label>
        {TenancyType[props.task.tenancy.type ? props.task.tenancy.type : 0]}
        <Label>Tenancy start date:</Label>
        {props.task.tenancy.startDate}
      </Paragraph>
      <Heading level={HeadingLevels.H3}>Residents</Heading>
      <Tile>
        <div>{props.task.tenancy.residents[0].presentationName}</div>
      </Tile>
      <Heading level={HeadingLevels.H3}>Action</Heading>
      <Paragraph>
        <Label>Due:</Label>
        {props.task.dueTime}
        <Label>Reference no.:</Label>
        {props.task.referenceNumber ? props.task.referenceNumber : 'Unknown'}
        <Label>Related item:</Label>
        {props.task.parent ? props.task.parent : 'None'}
      </Paragraph>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const taskId = context.query ? context.query.id : undefined;

  if (taskId) {
    // const { origin } = absoluteUrl(context.req, 'localhost:3000');
    // const response = await fetch(`${origin}/api/tasks/` + taskId);
    const response = mockTask;
    // if (response.status === 200) {
    //   const json = await response.json();
    const json = JSON.parse(JSON.stringify(response));

    return { props: { task: json as Task } };
  }
  // }

  return { props: {} };
};
