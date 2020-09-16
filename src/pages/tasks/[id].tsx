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
} from 'lbh-frontend-react';
import { Task, TenancyType, Resident } from '../../interfaces/task';
import ErrorPage from 'next/error';
import HardcodedTask from '../../tests/helpers/hardcodedTask';
import getTaskById from '../../usecases/ui/getTaskById';
import Dropdown from '../../components/dropdown';
import getAuthToken from '../../usecases/api/getAuthToken';
import updateOfficerForTask, {
  updateHousingOfficer,
} from '../../usecases/ui/updateHousingOfficerForTask';
import moment from 'moment';

interface TaskProps {
  task: Task;
}

const mockTask: Task = HardcodedTask();

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

const housingOfficers = ['Joe Bloggs', 'Mary Berry', 'Santa Claus'];

export default function TaskPage(props: TaskProps) {
  const [currentlySelected, setCurrentlySelected] = useState('Mary Berry');

  const updateCurrentlySelectedOfficer = (housingOfficer: string) => {
    setCurrentlySelected(housingOfficer);
  };

  const officerDetails: updateHousingOfficer = {
    taskId: props.task.id,
    housingOfficer: currentlySelected,
  };

  const updateOfficer = () => {
    // call use case that updates housing officer
    // ui usecase that hits api endpoint
    updateOfficerForTask(officerDetails);
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
      <div className="clickablesContainer">
        <Dropdown
          options={housingOfficers}
          selected={currentlySelected}
          onSelectedChange={updateCurrentlySelectedOfficer}
        />
        <span className="divider"></span>
        <Button
          onClick={updateOfficer}
          className="govuk-button  lbh-button govuk-button--secondary lbh-button--secondary submit"
        >
          Send action to officer
        </Button>
      </div>
      <style jsx>{`
        .tile-container {
          display: flex;
        }
        .clickablesContainer {
          display: flex;
        }
        .divider {
          width: 15%;
        }
        .submit {
          margin-top: 75px;
          font-size: 19px;
          width: 30%;
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
