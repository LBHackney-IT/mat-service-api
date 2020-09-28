import axios from 'axios';

const getOfficersForManager = async (email: string) => {
  if (process.env.NEXT_PUBLIC_API_PATH === undefined) return null;

  return await axios
    .get(`${process.env.NEXT_PUBLIC_API_PATH}/users?managerEmail=${email}`)
    .then((response) => {
      return response.data;
    });
};

export default getOfficersForManager;
