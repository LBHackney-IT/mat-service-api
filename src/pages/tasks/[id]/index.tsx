import React, { useState, useEffect, SetStateAction } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/layout';
import LoadingPage from '../../../components/loadingPage';
import {
  Heading,
  HeadingLevels,
  Paragraph,
  Label,
  Tile,
  Button,
  ErrorMessage,
} from 'lbh-frontend-react';
import { Task, TenancyType, Resident } from '../../../interfaces/task';
import getTaskById from '../../../usecases/ui/getTaskById';
import sendTaskToManager from '../../../usecases/ui/sendTaskToManager';
import moment from 'moment';
import { Note } from '../../../interfaces/note';
import getNotesById from '../../../usecases/ui/getNotes';
import closeTask from '../../../usecases/ui/closeTask';
import { FaExclamation } from 'react-icons/fa';

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
  const [notes, setNotes] = useState<Note[]>([]);

  const router = useRouter();
  useEffect(() => {
    getTaskById(`${router.query.id}`)
      .then((task) => {
        if (task) setTask(task);
      })
      .catch((e) => {
        setError('loadingError');
      });

    getNotesById(`${router.query.id}`)
      .then((notes) => {
        if (notes) setNotes(notes);
      })
      .catch((e) => {
        setError('notesError');
      });
  }, []);

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

  const closeTaskHandler = () => {
    closeTask(task.id)
      .then(() => {
        router.push('/');
      })
      .catch(() => {
        setError('closeTaskError');
      });
  };

  const renderNotes = () => {
    const notesJsx: JSX.Element[] = [];
    notes.map((note) => {
      notesJsx.push(
        <Paragraph>
          <span className="strong">
            {moment(note.createdOn).format('DD/MM/YYYY')}
          </span>{' '}
          Created by {note.createdBy}
          <br />
          {note.text}
        </Paragraph>
      );
    });
    return notesJsx;
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

  const renderLaunchProcess = () => {
    if (task.processType) {
      return (
        <form method="get" action={`/api/tasks/${router.query.id}/launch`}>
          <Button className="govuk-button lbh-button launchProcess">
            Launch process
          </Button>
        </form>
      );
    }
    return null;
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
          {renderTagRef()}
        </Paragraph>
      </div>
    );
  };

  const renderCloseTask = () => {
    return (
      <div className="closeTaskButton">
        <Button
          onClick={closeTaskHandler}
          className="govuk-button  lbh-button govuk-button--secondary lbh-button--secondary"
        >
          Close action
        </Button>
        <Paragraph className="warningText">
          <FaExclamation />
          Once an action has been closed it cannot be reopened
        </Paragraph>
        {error === 'closeTaskError' && (
          <ErrorMessage className="closeTaskError">
            Error closing task
          </ErrorMessage>
        )}
      </div>
    );
  };
  const renderSendToManager = () => {
    if (task && task.assignedToManager) return null;
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
      {renderLaunchProcess()}
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
      <Heading level={HeadingLevels.H4}>Notes</Heading>
      {renderNotes()}
      {renderNotesUpdate()}
      {renderSendToManager()}
      {renderCloseTask()}
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
        .strong {
          font-weight: 600;
        }
        .launchProcess {
          float: right;
        }
      `}</style>
    </Layout>
  );
}
