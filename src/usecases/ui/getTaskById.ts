import axios from 'axios';
import { Task } from '../../interfaces/task';

const getTaskById = async(taskId: string): Promise<Task> => {
  const task = await axios
    .get(`${process.env.NEXT_PUBLIC_API_PATH}/tasks/${taskId}`)
    .then((response => {
      return response;
    }))

  return task.data as Task;
}

export default getTaskById;
