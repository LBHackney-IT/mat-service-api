import axios from 'axios';
import { NewNote } from '../../interfaces/note';
import getCrmUserGuid from './getCrmUserGuid';

const createNote = async (
  note: any,
  emailAddress: string
): Promise<boolean> => {
  if (process.env.NEXT_PUBLIC_API_PATH === undefined) {
    return false;
  }

  const estateOfficerId = await getCrmUserGuid(emailAddress);

  if (note.ServiceRequest.description === undefined || !estateOfficerId) {
    return false;
  }

  const newNote: NewNote = {
    interactionId: note.interactionId,
    estateOfficerName: note.estateOfficerName,
    ServiceRequest: {
      description: note.ServiceRequest.description,
      requestCallback: false,
      Id: note.ServiceRequest.Id,
    },
    status: 1,
    estateOfficerId: estateOfficerId,
  };

  const response = await axios
    .post(
      `${process.env.NEXT_PUBLIC_API_PATH}/tasks/${note.interactionId}/notes`,
      newNote
    )
    .then(() => true)
    .catch(() => false);

  return response;
};

export default createNote;
