import axios from 'axios';
import { Officer } from '../../mappings/crmToOfficersDetails';

interface GetUsersResponse {
  users: Officer[];
}

const getOfficersForManager = async (email: string): Promise<Officer[]> => {
  return await axios
    .get<GetUsersResponse>(
      `${
        process.env.NEXT_PUBLIC_API_PATH || '/api'
      }/users?managerEmail=${email}`
    )
    .then((response) => {
      return response.data.users;
    });
};

export default getOfficersForManager;
