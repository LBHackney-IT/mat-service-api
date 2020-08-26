import axios from 'axios';

const userMappingExists = async(emailAddress: string): Promise<boolean> => {
  if(process.env.NEXT_PUBLIC_API_PATH === undefined) {
    return false;
  }

  const response: any = await axios
    .get(`${process.env.NEXT_PUBLIC_API_PATH}/userMappings?emailAddress=${emailAddress}`)
    .then((response => {
      return response;
    }))

  return response.body;
}

export default userMappingExists;
