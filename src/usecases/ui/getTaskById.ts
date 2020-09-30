import axios from 'axios';
import { Task } from '../../interfaces/task';

const getTaskById = (taskId: string, token?: string): Promise<Task> => {
  const headers = token ? { Cookie: `hackneyToken=${token};` } : undefined;

  return axios
    .get<Task>(
      `${process.env.NEXT_PUBLIC_API_PATH || '/api'}/tasks/${taskId}`,
      {
        headers,
      }
    )
    .then((response) => {
      return response.data;
    });
};

export default getTaskById;
