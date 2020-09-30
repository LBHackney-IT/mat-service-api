import axios from 'axios';
import apiTaskToUiTask from '../../mappings/apiTaskToUiTask';
import { Row } from '../../components/worktray';
import getEmailAddress from './getEmailAddress';
import { Task } from '../../interfaces/task';

const getTasksForCurrentOfficer = async (): Promise<Row[]> => {
  const emailAddress = getEmailAddress();

  if (
    process.env.NEXT_PUBLIC_API_PATH === undefined ||
    emailAddress === undefined
  ) {
    return [];
  }

  return axios
    .get<Task[]>(`${process.env.NEXT_PUBLIC_API_PATH}/tasks`)
    .then((response) => {
      return apiTaskToUiTask(response.data);
    });
};

export default getTasksForCurrentOfficer;