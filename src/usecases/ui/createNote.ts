import axios from 'axios';

const createNote = async (
  interactionId: string,
  note: string
): Promise<boolean> => {
  return axios
    .post(
      `${
        process.env.NEXT_PUBLIC_API_PATH || '/api'
      }/tasks/${interactionId}/notes`,
      {
        text: note,
      }
    )
    .then(() => true)
    .catch(() => false);
};

export default createNote;
