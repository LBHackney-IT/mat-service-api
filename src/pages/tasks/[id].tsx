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
const mapResidents = (residents: Resident[]) => {
  const tileArray: any[] = [];
  residents.forEach((resident) => {
    tileArray.push(
      <Tile link={resident.email} title={resident.presentationName}>
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
  if (props.task === undefined) {
    return <ErrorPage statusCode={404} />;
  }

  const renderTenancy = () => {
    return (
      <div>
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
      </div>
    );
  };

  const renderAction = () => {
    return (
      <div>
        <Heading level={HeadingLevels.H3}>Action</Heading>
        <Paragraph>
          <Label>Due:</Label>
          {props.task.dueTime ? props.task.dueTime : 'n/a'}
          <Label>Reference number:</Label>
          {props.task.referenceNumber ? props.task.referenceNumber : 'n/a'}
          <Label>Related item:</Label>
          {props.task.parent ? props.task.parent : 'n/a'}
        </Paragraph>
      </div>
    );
  };

  const renderNotes = () => {
    return (
      <div>
        <Heading level={HeadingLevels.H4}>Notes</Heading>
        <Paragraph>
          <span className="strong">14/09/2029:</span> Created by [Housing
          Officer's Name]
          <br />
          Notes about the action. Writtern when the related process was being
          carried out.
        </Paragraph>
        <Paragraph>
          <span className="strong">15/09/2029:</span> Created by [Housing
          Officer's Name]
          <br />
          Additional notes about the action. Writtern when the related process
          was being carried out.
        </Paragraph>
      </div>
    );
  };

  return (
    <Layout>
      <Heading level={HeadingLevels.H2}>{props.task.type}</Heading>
      {renderTenancy()}
      <Heading level={HeadingLevels.H3}>Residents</Heading>
      <div className="tile-container">
        {mapResidents(props.task.tenancy.residents)}
      </div>
      {renderAction()}
      {renderNotes()}

      <style jsx>{`
        .strong {
          font-weight: 600;
        }
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
    const response = await getTaskById(`${taskId}`);
    if (response !== undefined) {
      return { props: { task: response as Task } };
    }
  }

  return { props: {} };
};
