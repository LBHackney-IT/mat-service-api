import axios from 'axios';
import { NewNote } from '../../interfaces/note';

const createNote = async (note: NewNote): Promise<boolean> => {
  if (process.env.NEXT_PUBLIC_API_PATH === undefined) {
    return false;
  }

  const response = await axios
    .post(`${process.env.NEXT_PUBLIC_API_PATH}/notes`, note)
    .then((response) => {
      return true;
    })
    .catch((error) => {
      return false;
    });

  return response;
};

export default createNote;
