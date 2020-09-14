import React, { useState } from 'react';
import Layout from '../../components/layout';
import { GetServerSideProps } from 'next';
import {
  Heading,
  HeadingLevels,
  Paragraph,
  Label,
  Tile,
  Button,
  ErrorMessage,
} from 'lbh-frontend-react';
import { Task, TenancyType, Resident } from '../../interfaces/task';
import ErrorPage from 'next/error';
import HardcodedTask from '../../tests/helpers/hardcodedTask';
import getTaskById from '../../usecases/ui/getTaskById';
import getAuthToken from '../../usecases/api/getAuthToken';
import sendTaskToManager from '../../usecases/ui/sendTaskToManager';
import moment from 'moment';

interface TaskProps {
  task: Task;
}

const mockTask: Task = HardcodedTask();

const mapResidents = (residents: Resident[]) => {
  const tileArray: any[] = [];
  residents.forEach((resident) => {
    tileArray.push(
      <Tile link={`mailto:${resident.email}`} title={resident.presentationName}>
        <Paragraph>{resident.role}</Paragraph>
        <Label>Date of birth:</Label>
        {moment(resident.dateOfBirth).format('DD/MM/YYYY')}
        <Label>Mobile:</Label>
        {resident.mobileNumber ? resident.mobileNumber : 'n/a'}
        <Label>Home:</Label>
        {resident.homePhoneNumber ? resident.homePhoneNumber : 'n/a'}
        <Label>Work:</Label>
        {resident.workPhoneNumber ? resident.workPhoneNumber : 'n/a'}
        <Label>Email:</Label>
        {resident.email ? resident.email : 'n/a'}
      </Tile>
    );
  });
  return tileArray;
};

export default function TaskPage(props: TaskProps) {
  const [error, setError] = useState('none');

  const sendToManager = () => {
    sendTaskToManager(props.task.id)
      .then(() => {})
      .catch(() => {
        setError('sendToManagerError');
      });
  };

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
        {props.task.tenancy.startDate
          ? moment(props.task.tenancy.startDate).format('DD/MM/YYYY')
          : 'n/a'}
      </Paragraph>
      <Heading level={HeadingLevels.H3}>Residents</Heading>
      <div className="tile-container">
        {mapResidents(props.task.tenancy.residents)}
      </div>
      <Heading level={HeadingLevels.H3}>Action</Heading>
      <Paragraph>
        <Label>Due:</Label>
        {props.task.dueTime ? props.task.dueTime : 'n/a'}
        <Label>Reference number:</Label>
        {props.task.referenceNumber ? props.task.referenceNumber : 'n/a'}
        <Label>Related item:</Label>
        {props.task.parent ? props.task.parent : 'n/a'}
      </Paragraph>
      <div>
        <Button
          onClick={sendToManager}
          className="govuk-button--secondary lbh-button--secondary sendToManager"
        >
          Send action to manager (optional)
        </Button>
        {error === 'sendToManagerError' && (
          <ErrorMessage className="sendToManagerError">
            Error sending action to manager
          </ErrorMessage>
        )}
      </div>
      <style jsx>{`
        .tile-container {
          display: flex;
        }
        .sendToManager,
        sendToManagerError {
          display: inline;
        }
      `}</style>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const taskId = context.query ? context.query.id : undefined;
  const token = getAuthToken(context.req.headers);

  if (taskId && token) {
    const response = await getTaskById(`${taskId}`, token);
    if (response !== undefined) {
      return { props: { task: response as Task } };
    }
  }

  return { props: {} };
};
