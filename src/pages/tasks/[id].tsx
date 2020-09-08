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
import { Task, TenancyType, Resident } from '../../interfaces/task';
import ErrorPage from 'next/error';
import HardcodedTask from '../../tests/helpers/hardcodedTask';
import getTaskById from '../../usecases/ui/getTaskById';
import moment from 'moment';

interface TaskProps {
  task: Task;
}

const mockTask: Task = HardcodedTask();

const mapResidents = (residents: Resident[]) => {
  const tileArray: any[] = [];
  residents.forEach((resident) => {
    tileArray.push(
      <Tile link={resident.email} title={resident.presentationName} >
        <Paragraph>{resident.role}</Paragraph>
        <Paragraph>Date of birth: {moment(resident.dateOfBirth).format("DD/MM/YYYY")}</Paragraph>
        <Paragraph>Mobile: {resident.mobileNumber}</Paragraph>
        <Paragraph>Home: {resident.homePhoneNumber}</Paragraph>
        <Paragraph>Work: {resident.workPhoneNumber}</Paragraph>
        <Paragraph>Email: {resident.email}</Paragraph>
      </Tile>
    );
  });
  return tileArray;
};

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
          {moment(props.task.tenancy.startDate).format("DD/MM/YYYY")}
      </Paragraph>
      <Heading level={HeadingLevels.H3}>Residents</Heading>
      <div className="tile-container">
        {mapResidents(props.task.tenancy.residents)}
      </div>
      <Heading level={HeadingLevels.H3}>Action</Heading>
      <Paragraph>
          <Label>Due:</Label>
          {props.task.dueTime}
          <Label>Reference no.:</Label>
          {props.task.referenceNumber ? props.task.referenceNumber : 'Unknown'}
          <Label>Related item:</Label>
          {props.task.parent ? props.task.parent : 'None'}
      </Paragraph>
      <style jsx>{`
        .tile-container {
        display: flex;
        }
    `}</style>
    </Layout>
  );

}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const taskId = context.query ? context.query.id : undefined;

  if (taskId) {
    const trueResponse = await getTaskById(`${taskId}`);
    return { props: { task: trueResponse as Task } };
  }

  return { props: {} };
};
