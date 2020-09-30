import axios from 'axios';

interface Task {
  tagRef: string;
  uprn: string;
  process: string;
  subProcess?: string;
}

const createTask = async (task: Task) => {
  if (process.env.NEXT_PUBLIC_API_PATH === undefined) return null;

  return axios.post(`${process.env.NEXT_PUBLIC_API_PATH}/tasks`, task);
};

export default createTask;
