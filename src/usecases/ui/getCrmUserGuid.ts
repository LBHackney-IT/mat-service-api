import axios from 'axios';

const getCrmUserGuid = async(emailAddress: string): Promise<string | undefined> => {
  if(process.env.NEXT_PUBLIC_API_PATH === undefined) {
    return undefined;
  }

  const response: any = await axios
    .get(`${process.env.NEXT_PUBLIC_API_PATH}/users?emailAddress=${emailAddress}`)
    .then((response => {
      return response;
    }))

  return response;
}

export default getCrmUserGuid;
