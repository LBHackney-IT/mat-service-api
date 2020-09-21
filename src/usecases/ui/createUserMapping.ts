import axios from 'axios';
import UserMapping from '../../interfaces/userMapping';

const createUserMapping = async (userMapping: UserMapping) => {
  if (process.env.NEXT_PUBLIC_API_PATH === undefined) {
    return false;
  }

  const response = await axios
    .post(`${process.env.NEXT_PUBLIC_API_PATH}/userMappings`, userMapping)
    .then((response) => {
      return true;
    })
    .catch((error) => {
      return false;
    });

  return response;
};

export default createUserMapping;
