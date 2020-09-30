import axios from 'axios';
import apiTaskToUiTask from '../../mappings/apiTaskToUiTask';
import { Row } from '../../components/worktray';
import getEmailAddress from './getEmailAddress';
import { TaskList } from '../../interfaces/apiResponses';

const getTasksForCurrentOfficer = async (): Promise<Row[]> => {
  const emailAddress = getEmailAddress();

  if (
    process.env.NEXT_PUBLIC_API_PATH === undefined ||
    emailAddress === undefined
  ) {
    return [];
  }

  return axios
    .get<TaskList>(`${process.env.NEXT_PUBLIC_API_PATH}/tasks`)
    .then((response) => {
      return apiTaskToUiTask(response.data.tasks);
    });
};

export default getTasksForCurrentOfficer;
