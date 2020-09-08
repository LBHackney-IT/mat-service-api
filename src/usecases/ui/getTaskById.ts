import axios from 'axios';
import { Task } from '../../interfaces/task';

const getTaskById = async(taskId: string): Promise<Task | undefined> => {
  if(process.env.NEXT_PUBLIC_API_PATH === undefined) {
    return undefined;
  }

  const response = await axios
    .get(`${process.env.NEXT_PUBLIC_API_PATH}/tasks/${taskId}`)
    .then((response => {
      return response;
    }))
    .catch((error => {
      return undefined;
    }))

  if(response !== undefined) {
    return response.data as Task;
  }
  return response;
}

export default getTaskById;
