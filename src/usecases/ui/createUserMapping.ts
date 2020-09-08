import axios from "axios";

export interface UserMapping {
  name: string;
  emailAddress: string;
  usercrmid: string;
  googleId: string;
}

const createUserMapping = async (userMapping: UserMapping) => {
  if (process.env.NEXT_PUBLIC_API_PATH === undefined) {
    return false;
  }

  const requestBody = {
    name: userMapping.name,
    emailAddress: userMapping.emailAddress,
    usercrmid: userMapping.usercrmid,
    googleId: userMapping.googleId
  }

  const response = await axios
    .post(`${process.env.NEXT_PUBLIC_API_PATH}/userMappings`, requestBody)
    .then((response => { return true }))
    .catch((error => { return false }))

  return response;
}

export default createUserMapping;
