import axios from 'axios';
import { Row } from '../../components/worktray';

const createTask = async (task) => {
  console.log(task);
  if (process.env.NEXT_PUBLIC_API_PATH === undefined) return null;

  return await axios
    .post(`${process.env.NEXT_PUBLIC_API_PATH}/tasks`, task)
    .then((response) => {
      return response;
    });
};

export default createTask;
