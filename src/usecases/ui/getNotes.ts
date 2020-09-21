import axios from 'axios';
import { ApiNote } from '../../interfaces/note';

const getNotesById = async (taskId: string): Promise<ApiNote[]> => {
  if (process.env.NEXT_PUBLIC_API_PATH === undefined) {
    return [];
  }

  const response = await axios
    .get(`${process.env.NEXT_PUBLIC_API_PATH}/notes/${taskId}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return [];
    });

  if (response !== undefined) {
    return response as ApiNote[];
  }
  return response;
};

export default getNotesById;
