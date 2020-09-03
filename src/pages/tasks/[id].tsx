import * as React from 'react';
import Layout from '../../components/layout';
import { GetServerSideProps } from 'next';
import {
  Heading,
  HeadingLevels,
  List,
  Paragraph,
  Label,
  Tile,
} from 'lbh-frontend-react';
import fetch from 'isomorphic-unfetch';
import absoluteUrl from 'next-absolute-url';
import { Task, TenancyType } from '../../interfaces/task';
import ErrorPage from 'next/error';

interface TaskProps {
  task: Task;
}

// Setting up Children to pass into the Tile as props
const TileOne = (
  <div>
    <Paragraph>Date of birth: 01/08/2000</Paragraph>
    <Paragraph>Mobile: 077070087654</Paragraph>
    <Paragraph>Home: 020888812334</Paragraph>
    <Paragraph>Work: 020777756789</Paragraph>
    <Paragraph>
      Email: <a href="mailto:someone@email.com">fake@dummy.com</a>
    </Paragraph>
  </div>
);
const TileTwo = (
  <div>
    <Paragraph>Date of birth: 10/06/2010</Paragraph>
    <Paragraph>Mobile: 073070087234</Paragraph>
    <Paragraph>Home: 020888812334</Paragraph>
    <Paragraph>Work: 020777756543</Paragraph>
    <Paragraph>
      Email: <a href="mailto:someone@email.com">fake@dummy.com</a>
    </Paragraph>
  </div>
);

const content = [
  {
    link: 'www.google.com',
    title: 'Mrs Sally Fisher',
    children: TileOne,
  },
  {
    link: 'www.facebook.com',
    title: 'Ms Joan Fisher',
    children: TileTwo,
  },
  {
    link: 'www.hotmail.com',
    title: 'Mr John Fisher',
    children: TileOne,
  },
];

export default function TaskPage(props: TaskProps) {
  if (props.task === undefined) {
    return <ErrorPage statusCode={404} />;
  }

  const startDate = props.task.tenancy
    ? new Date(props.task.tenancy.startDate).toLocaleDateString()
    : '';
  const dueDate = props.task.dueTime
    ? new Date(props.task.dueTime).toLocaleDateString()
    : '';

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
        {startDate}
      </Paragraph>
      <Heading level={HeadingLevels.H3}>Residents</Heading>
      <Tile targets={content}>
        <div></div>
      </Tile>
      <Heading level={HeadingLevels.H3}>Action</Heading>
      <Paragraph>
        <Label>Due:</Label>
        {dueDate}
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
    const { origin } = absoluteUrl(context.req, 'localhost:3000');
    const response = await fetch(`${origin}/api/tasks/` + taskId);

    if (response.status === 200) {
      const json = await response.json();

      return { props: { task: json as Task } };
    }
  }

  return { props: {} };
};
