import axios from 'axios';

interface GetCrmUserGuidResponse {
  users: string;
}

const getCrmUserGuid = async (
  emailAddress: string
): Promise<GetCrmUserGuidResponse | undefined> => {
  if (process.env.NEXT_PUBLIC_API_PATH === undefined) {
    return undefined;
  }

  const response: any = await axios
    .get(
      `${process.env.NEXT_PUBLIC_API_PATH}/users?emailAddress=${emailAddress}`
    )
    .then((response) => {
      return response;
    });

  return response.data;
};

export default getCrmUserGuid;
