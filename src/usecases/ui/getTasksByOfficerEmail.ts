import axios from 'axios';
import apiTaskToUiTask from '../../mappings/apiTaskToUiTask';
import { Row } from '../../components/worktray';
import getEmailAddress from './getEmailAddress';

const getTasksByOfficerEmail = async (): Promise<Row[]> => {
  const emailAddress = getEmailAddress();
  // const emailAddress = "tuomo.karki@hackney.gov.uk";

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
      return response.data;
    })
    .catch((error) => {
      return [];
    });

  return apiTaskToUiTask(tasks);
};

export default getTasksByOfficerEmail;
