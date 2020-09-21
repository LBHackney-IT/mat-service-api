import React, { useState, useEffect, SetStateAction } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout';
import LoadingPage from '../../components/loadingPage';
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
import getTaskById from '../../usecases/ui/getTaskById';
import Dropdown from '../../components/dropdown';
import getAuthToken from '../../usecases/api/getAuthToken';
import sendTaskToOfficer from '../../usecases/ui/sendTaskToOfficer';
import sendTaskToManager from '../../usecases/ui/sendTaskToManager';
import getOfficersByArea from '../../usecases/ui/getOfficersByArea';
import moment from 'moment';

const mapResidents = (residents: Resident[]) => {
  return residents.map((resident) => {
    return (
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
};

const hardcodedHousingOfficers = [
  ['1', 'Joe Bloggs'],
  ['2', 'Mary Berry'],
  ['3', 'Santa Claus'],
];
// Should return '2, Mary Berry'
const defaultSelection = hardcodedHousingOfficers[1];
let defaultOfficerDisplayed: any;

export default function TaskPage() {
  const [error, setError] = useState<string>('none');
  const [task, setTask] = useState<Task | null>(null);
  const [currentlySelected, setCurrentlySelected] = useState(
    defaultSelection[0]
  );
  //  const [currentlySelected, setCurrentlySelected] = useState('');

  const updateOfficer = () => {
    if (task) {
      sendTaskToOfficer({
        taskId: task.id,
        housingOfficerId: currentlySelected,
      });
    }
  };

  const updateCurrentlySelectedOfficer = (housingOfficer: string) => {
    setCurrentlySelected(housingOfficer);
    updateOfficer();
  };

  const router = useRouter();

  useEffect(() => {
    if (!task) {
      getTaskById(`${router.query.id}`)
        .then((task) => {
          if (task) setTask(task);
        })
        .catch((e) => {
          console.log(e.message);
          setError('loadingError');
        });
    }
  });

  useEffect(() => {
    if (!currentlySelected) {
      getOfficersByArea(`${router.query.areaId}`)
        .then((housingOfficers) => {
          if (housingOfficers) {
            setCurrentlySelected(housingOfficers);
            defaultOfficerDisplayed = housingOfficers[0];
          }
        })
        .catch((e) => {
          console.log(e.message);
          setError('loadingError');
        });
    }
  });

  console.log('HousingOfficerResponse:', defaultOfficerDisplayed);

  const sendToManager = () => {
    if (task) {
      sendTaskToManager(task.id)
        .then(() => {})
        .catch(() => {
          setError('sendToManagerError');
        });
    }
  };

  if (task) {
    const renderTagRef = () => {
      if (task.tenancy.tagRef) {
        return (
          <a
            className="tenancy"
            href={`${
              process.env.NEXT_PUBLIC_SINGLEVIEW_URL
            }/tenancies/${task.tenancy.tagRef.replace('/', '-')}`}
          >
            {task.tenancy.tagRef}
          </a>
        );
      }
      return null;
    };

    return (
      <Layout>
        <Heading level={HeadingLevels.H2}>{task.type}</Heading>
        <Heading level={HeadingLevels.H3}>Tenancy</Heading>
        <Paragraph>
          <Label>Address:</Label>
          {task.address.presentationShort}
          <Label>Tenancy type:</Label>
          {TenancyType[task.tenancy.type ? task.tenancy.type : 0]}
          <Label>Tenancy start date:</Label>
          {task.tenancy.startDate
            ? moment(task.tenancy.startDate).format('DD/MM/YYYY')
            : 'n/a'}
          <Label>Tenancy Reference (Tag Ref):</Label>
          {renderTagRef()}
        </Paragraph>
        <Heading level={HeadingLevels.H3}>Residents</Heading>
        <div className="tile-container">
          {mapResidents(task.tenancy.residents)}
        </div>
        <Heading level={HeadingLevels.H3}>Action</Heading>
        <Paragraph>
          <Label>Due:</Label>
          {task.dueTime ? task.dueTime : 'n/a'}
          <Label>Reference number:</Label>
          {task.referenceNumber ? task.referenceNumber : 'n/a'}
          <Label>Related item:</Label>
          {task.parent ? task.parent : 'n/a'}
        </Paragraph>
        <div className="clickablesContainer">
          <Dropdown
            options={hardcodedHousingOfficers}
            selected={currentlySelected}
            onChange={updateCurrentlySelectedOfficer}
          />
          <span className="divider"></span>
          <Button
            onClick={updateOfficer}
            className="govuk-button  lbh-button govuk-button--secondary lbh-button--secondary submit"
          >
            Send action to officer
          </Button>
        </div>
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
          .clickablesContainer {
            display: flex;
          }
          .divider {
            width: 15%;
          }
          .submit {
            font-size: 19px;
            width: 30%;
          }
        `}</style>
      </Layout>
    );
  } else {
    return <LoadingPage error={error === 'loadingError'} />;
  }
}
