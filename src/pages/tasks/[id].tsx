import * as React from 'react';
import Layout from '../../components/layout';
import { GetServerSideProps } from 'next'
import { Heading, HeadingLevels, List, Paragraph, Label } from 'lbh-frontend-react';
import fetch from "isomorphic-unfetch";
import absoluteUrl from "next-absolute-url";
import { Task, TenancyType } from '../../interfaces/task'

interface TaskProps {
  task: Task;
}

export default function TaskPage(props: TaskProps) {

  
  const residents = props.task.tenancy?.residents || [];
  const startDate = props.task.tenancy ? new Date(props.task.tenancy?.startDate).toLocaleDateString() : "";
  const dueDate = props.task.dueTime ? new Date(props.task.dueTime).toLocaleDateString() : "";

  return (
    <Layout>
      <Heading level={HeadingLevels.H2}>{props.task.type}</Heading>
      <Heading level={HeadingLevels.H3}>Tenancy</Heading>
      <Paragraph>
        <Label>Address</Label>
        {props.task.address.presentationShort}
        <Label>Tenancy type:</Label>
        {TenancyType[props.task.tenancy?.type || 0]}
        <Label>Tenancy start date:</Label>
        {startDate}
      </Paragraph>
      <Heading level={HeadingLevels.H3}>Residents</Heading>
      <List items={residents.map(x => x.presentationName)}>
        <div></div>
      </List>
      <Heading level={HeadingLevels.H3}>Action</Heading>
      <Paragraph>
        <Label>Due</Label>
        {dueDate}
        <Label>Reference no.:</Label>
        {props.task.referenceNumber ? props.task.referenceNumber : "Unknown"}
        <Label>Related item:</Label>
        {props.task.parent ? props.task.parent : "None"}
      </Paragraph>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {

  const taskId = context.query ? context.query.id : undefined;

  if (taskId) {

    const { origin } = absoluteUrl(context.req, "localhost:3000");
    const response = await fetch(`${origin}/api/tasks/` + taskId);
    const task: Task = await response.json();

    if (task) {
      return { props: { task: task } };
    }
  }

  // TODO: return error page instead
  return { props: { task: undefined } };
}
