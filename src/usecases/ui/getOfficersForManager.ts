import axios from 'axios';
import GetEmailAddress from './getEmailAddress';

const getOfficersForManager = async () => {
  if (process.env.NEXT_PUBLIC_API_PATH === undefined) return null;

  // extract the officer email from token
  const managerEmail = GetEmailAddress();

  return await axios
    .get(
      `${process.env.NEXT_PUBLIC_API_PATH}/users?managerEmail=${managerEmail}`
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
};

export default getOfficersForManager;
