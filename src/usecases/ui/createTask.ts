import axios from 'axios';
import { Task } from '../../interfaces/task';

export interface CreateTaskRequest {
  tagRef: string;
  processType: string;
  subProcess?: number;
}

const createTask = async (task: CreateTaskRequest): Promise<Task> => {
  return axios
    .post<Task>(`${process.env.NEXT_PUBLIC_API_PATH || '/api'}/tasks`, task)
    .then((response) => response.data);
};

export default createTask;
