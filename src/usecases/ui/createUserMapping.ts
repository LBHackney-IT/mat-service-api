import axios from 'axios';
import UserMapping from '../../interfaces/userMapping';

const createUserMapping = async (userMapping: UserMapping) => {
  if (process.env.NEXT_PUBLIC_API_PATH === undefined) {
    return false;
  }

  return await axios
    .post(`${process.env.NEXT_PUBLIC_API_PATH}/userMappings`, userMapping)
    .then(() => true)
    .catch(() => false);
};

export default createUserMapping;
