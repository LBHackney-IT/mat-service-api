import axios from 'axios';

export interface User {
  fullName: string;
  emailAddress: string;
  firstName: string;
  familyName: string;
}

const createCrmUser = async (user: User) => {
  if (process.env.NEXT_PUBLIC_API_PATH === undefined) {
    return false;
  }

  const requestBody = {
    fullName: user.fullName,
    emailAddress: user.emailAddress,
    firstName: user.firstName,
    familyName: user.familyName,
  };

  const response = await axios
    .post(`${process.env.NEXT_PUBLIC_API_PATH}/user`, requestBody)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return false;
    });

  return response;
};

export default createCrmUser;
