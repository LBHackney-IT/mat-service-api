import axios from 'axios';
import apiTaskToUiTask from '../../mappings/apiTaskToUiTask';
import { Row } from '../../components/worktray';
import getEmailAddress from './getEmailAddress';

const getTasksByOfficerEmail = async (): Promise<Row[]> => {
  const emailAddress = getEmailAddress();

  if (
    process.env.NEXT_PUBLIC_API_PATH === undefined ||
    emailAddress === undefined
  ) {
    return [];
  }

  const tasks: any = await axios
    .get(
      `${process.env.NEXT_PUBLIC_API_PATH}/tasks?emailAddress=${emailAddress}`
    )
    .then((response) => {
      return response;
    });

  return apiTaskToUiTask(tasks.data);
};

export default getTasksByOfficerEmail;
