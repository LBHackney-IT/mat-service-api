import axios from 'axios';
import { Task } from '../../interfaces/task';

const getTaskById = (taskId: string, token?: string): Promise<Task> => {
  if (process.env.NEXT_PUBLIC_API_PATH === undefined) {
    return new Promise(() => {
      throw new Error('Api path config not set');
    });
  }

  const headers = token ? { Cookie: `hackneyToken=${token};` } : undefined;

  return axios
    .get(`${process.env.NEXT_PUBLIC_API_PATH}/tasks/${taskId}`, {
      headers,
    })
    .then((response) => {
      return response.data;
    });
};

export default getTaskById;
