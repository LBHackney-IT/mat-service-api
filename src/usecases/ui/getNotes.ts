import axios from 'axios';
import { NoteList } from '../../interfaces/apiResponses';
import Note from '../../interfaces/note';

const getNotesById = async (taskId: string): Promise<Note[]> => {
  if (process.env.NEXT_PUBLIC_API_PATH === undefined) {
    return [];
  }

  return axios
    .get<NoteList>(`${process.env.NEXT_PUBLIC_API_PATH}/tasks/${taskId}/notes`)
    .then((response) => {
      return response.data.notes;
    })
    .catch(() => {
      return [];
    });
};

export default getNotesById;
