import axios from 'axios';
import { Note } from '../../interfaces/note';

const getNotesById = async (taskId: string): Promise<Note[]> => {
  if (process.env.NEXT_PUBLIC_API_PATH === undefined) {
    return [];
  }

  const response = await axios
    .get(`${process.env.NEXT_PUBLIC_API_PATH}/tasks/${taskId}/notes`)
    .then((response) => {
      return response.data;
    })
    .catch(() => {
      return [];
    });

  if (response !== undefined) {
    return response as Note[];
  }
  return response;
};

export default getNotesById;
