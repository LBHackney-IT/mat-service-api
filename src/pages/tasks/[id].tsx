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
import sendTaskToManager from '../../usecases/ui/sendTaskToManager';
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

export default function TaskPage() {
  const [error, setError] = useState<string>('none');
  const [task, setTask] = useState<Task | null>(null);

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

  if (!task) {
    return <LoadingPage error={error === 'loadingError'} />;
  }

  const sendToManager = () => {
    sendTaskToManager(task.id)
      .then(() => {})
      .catch(() => {
        setError('sendToManagerError');
      });
  };

  const renderNotes = () => {
    return (
      <div>
        <Heading level={HeadingLevels.H4}>Notes</Heading>
        <Paragraph>
          <span className="strong">14/09/2029:</span> Created by [Housing
          Officer's Name]
          <br />
          Notes about the action. Written when the related process was being
          carried out.
        </Paragraph>
        <Paragraph>
          <span className="strong">15/09/2029:</span> Created by [Housing
          Officer's Name]
          <br />
          Additional notes about the action. Written when the related process
          was being carried out.
        </Paragraph>
      </div>
    );
  };

  const renderNotesUpdate = () => {
    return (
      <div>
        <Heading level={HeadingLevels.H4}>Update Notes</Heading>
        <textarea className={'govuk-input lbh-input text-area'} />
        <Button>Save Update</Button>
      </div>
    );
  };

  const renderTenancyInfo = () => {
    return (
      <div>
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
          <a
            className="tenancy"
            href={`${
              process.env.NEXT_PUBLIC_SINGLEVIEW_URL
            }/tenancies/${task.tenancy.tagRef.replace('/', '-')}`}
          >
            {task.tenancy.tagRef}
          </a>
        </Paragraph>
      </div>
    );
  };

  const renderSendToManager = () => {
    return (
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
    );
  };

  return (
    <Layout>
      <Heading level={HeadingLevels.H2}>{task.type}</Heading>
      {renderTenancyInfo()}
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
      {renderNotes()}
      {renderNotesUpdate()}
      {renderSendToManager()}
      <style jsx>{`
        .tile-container {
          display: flex;
        }
        .sendToManager,
        sendToManagerError {
          display: inline;
        }
        .text-area {
          height: 5em;
        }
      `}</style>
    </Layout>
  );
}
