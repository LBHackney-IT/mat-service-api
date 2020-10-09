import React, { useState, useEffect } from 'react';
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
import { Task, TenancyType } from '../../../interfaces/task';
import getTaskById from '../../../usecases/ui/getTaskById';
import sendTaskToManager from '../../../usecases/ui/sendTaskToManager';
import moment from 'moment';
import Note from '../../../interfaces/note';
import getNotesById from '../../../usecases/ui/getNotes';
import Dropdown from '../../../components/dropdown';
import getEmailAddress from '../../../usecases/ui/getEmailAddress';
import getOfficersForManager from '../../../usecases/ui/getOfficersForManager';
import sendTaskToOfficer from '../../../usecases/ui/sendTaskToOfficer';
import closeTask from '../../../usecases/ui/closeTask';
import { FaExclamation } from 'react-icons/fa';
import createNote from '../../../usecases/ui/createNote';

/*
const mapResidents = (residents: Resident[]): React.ReactElement => {
  return residents.map((resident) => {
    return (
      <Tile link={`mailto:${resident.email}`} title={resident.presentationName}>
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
*/

export default function TaskPage(): React.ReactNode {
  const [error, setError] = useState<string>('none');
  const [task, setTask] = useState<Task | null>(null);
  const [notes, setNotes] = useState<Note[] | null>(null);
  const [officers, setOfficers] = useState<string[][] | null>(null);
  const [selectedOfficerId, setSelectedOfficerId] = useState<
    string | undefined
  >(undefined);
  const [noteText, setNoteText] = useState<string | undefined>(undefined);
  const [submitNoteSuccess, setSubmitNoteSuccess] = useState<
    boolean | undefined
  >(undefined);

  const router = useRouter();

  const getNotes = () => {
    getNotesById(`${router.query.id}`)
      .then((notes) => {
        if (notes) setNotes(notes);
      })
      .catch(() => setError('notesError'));
  };
  useEffect(() => {
    getTaskById(`${router.query.id}`)
      .then((task) => {
        if (task) setTask(task);
      })
      .catch(() => setError('loadingError'));

    getNotes();

    // extract the officer email from token
    const managerEmailAddress = getEmailAddress();
    if (managerEmailAddress) {
      getOfficersForManager(managerEmailAddress)
        .then((officers) => {
          const officerSelect = officers.map((officer) => [
            officer.id,
            officer.name,
          ]);
          setOfficers(officerSelect);
          setSelectedOfficerId(officerSelect[0][0]);
        })
        .catch((e) => console.log(e));
    }
  }, []);

  if (!task) {
    return <LoadingPage error={error === 'loadingError'} />;
  }

  const updateOfficer = () => {
    if (task && selectedOfficerId) {
      sendTaskToOfficer({
        taskId: task.id,
        housingOfficerId: selectedOfficerId,
      })
        .then(() => {
          router.push('/');
        })
        .catch(() => {
          setError('sendToOfficerError');
        });
    }
  };

  const updateSelectedOfficerId = (officerId: string) => {
    setSelectedOfficerId(officerId);
  };

  const sendToManager = () => {
    sendTaskToManager(task.id)
      .then(() => {
        router.push('/');
      })
      .catch(() => {
        setError('sendToManagerError');
      });
  };

  const closeTaskHandler = () => {
    closeTask(task.id)
      .then(() => router.push('/'))
      .catch(() => setError('closeTaskError'));
  };

  const handleNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNoteText(event.target.value);
  };

  const submitNote = async () => {
    if (noteText === undefined || noteText === '' || !router.query.id) {
      setSubmitNoteSuccess(false);
    } else {
      const response = await createNote(`${router.query.id}`, noteText);
      if (response) getNotes();
    }
  };

  const renderNotes = () => {
    if (!notes) return null;
    const notesJsx: JSX.Element[] = [];
    notes.map((note) => {
      notesJsx.push(
        <Paragraph>
          <span className="strong">
            {moment(note.createdOn).format('DD/MM/YYYY')}
          </span>
          <br />
          {note.text}
        </Paragraph>
      );
    });
    return notesJsx;
  };

  const renderNoteSuccess = () => {
    if (submitNoteSuccess) {
      return <Paragraph>Note was submitted successfully</Paragraph>;
    }
    if (submitNoteSuccess === false) {
      return (
        <ErrorMessage>An error has occurred, please try again</ErrorMessage>
      );
    }
    return null;
  };

  const renderNotesUpdate = () => {
    return (
      <div>
        <Heading level={HeadingLevels.H4}>Update Notes</Heading>
        <label htmlFor={'notes-text-area'}></label>
        <textarea
          className={'govuk-input lbh-input text-area'}
          value={noteText}
          id={'notes-text-area'}
          onChange={handleNoteChange}
        />
        <Button onClick={() => submitNote()}>Save Note</Button>
        {renderNoteSuccess()}
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
      <Tile title={'Tenancy'}>
        <Paragraph>
          <Label>Address:</Label>
          {task.address.presentationShort}
          <Label>Tenancy type:</Label>
          {TenancyType[task.tenancy.type ? task.tenancy.type : 0]}
          <Label>Tenancy start date:</Label>
          {task.tenancy.startDate
            ? moment(task.tenancy.startDate).format('DD/MM/YYYY')
            : 'n/a'}
          <Label>Tenancy reference:</Label>
          {renderTagRef()}
        </Paragraph>
      </Tile>
    );
  };

  const renderCloseTask = () => {
    return (
      <div>
        <Button
          onClick={closeTaskHandler}
          className="govuk-button  lbh-button govuk-button--secondary lbh-button--secondary closeTask"
        >
          Close action
        </Button>
        <Paragraph className="warningText">
          <FaExclamation />
          Once an action has been closed it cannot be reopened
        </Paragraph>
        {error === 'closeTaskError' && (
          <ErrorMessage className="closeTaskError">
            Error closing action
          </ErrorMessage>
        )}
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
          <ErrorMessage>Error sending action to manager</ErrorMessage>
        )}
      </div>
    );
  };

  const renderSelectAndSendToOfficer = () => {
    if (!officers) return null;
    return (
      <div className="selectAndSendToOfficerContainer">
        <Dropdown
          options={officers}
          selected={selectedOfficerId}
          onChange={updateSelectedOfficerId}
        />
        <span className="divider"></span>
        <Button
          onClick={updateOfficer}
          className="govuk-button  lbh-button govuk-button--secondary lbh-button--secondary sendToOfficer"
        >
          Send action to officer
        </Button>
        {error === 'sendToOfficerError' && (
          <ErrorMessage>Error sending action to officer</ErrorMessage>
        )}
      </div>
    );
  };

  const renderNotesTile = () => {
    if (!task.processType) {
      return (
        <Tile title={'Notes and Actions'}>
          {renderNotes()}
          {renderNotesUpdate()}
          {task.assignedToManager
            ? renderSelectAndSendToOfficer()
            : renderSendToManager()}
          {renderCloseTask()}
        </Tile>
      );
    }
    return null;
  };

  return (
    <Layout>
      {renderLaunchProcess()}
      <Heading className="heading-padding" level={HeadingLevels.H1}>
        {task.type}
      </Heading>
      {renderTenancyInfo()}
      {/*<Tile title={'Residents'}>
        <div className="tile-container">
          {mapResidents(task.tenancy.residents)}
        </div>
      </Tile>*/}
      <Tile title={'Actions'}>
        <Paragraph>
          <Label>Due:</Label>
          {task.dueTime ? task.dueTime : 'n/a'}
          <Label>Reference number:</Label>
          {task.referenceNumber ? task.referenceNumber : 'n/a'}
          <Label>Related item:</Label>
          {task.parent ? task.parent : 'n/a'}
        </Paragraph>
      </Tile>
      {renderNotesTile()}
      <style jsx>{`
        .tile {
          margin-top: 10px;
          padding: 20px;
        }
        .tile-container {
          display: flex;
        }
        #reference {
          font-size: 1rem;
        }
        .tile a {
          font-size: 2.25rem;
        }
        .heading-padding {
          padding-top: 150px;
        }
        .tile a.tenancy {
          font-size: 1.25rem;
        }
        .sendToManager,
        sendToManagerError {
          display: inline;
        }
        .selectAndSendToOfficerContainer {
          display: flex;
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
