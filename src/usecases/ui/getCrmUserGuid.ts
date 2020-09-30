import axios from 'axios';

interface GetCrmUserGuidResponse {
  users: string;
}

const getCrmUserGuid = async (emailAddress: string): Promise<string | null> => {
  return axios
    .get<GetCrmUserGuidResponse>(
      `${
        process.env.NEXT_PUBLIC_API_PATH || '/api'
      }/users?emailAddress=${emailAddress}`
    )
    .then((response) => {
      return response.data.users;
    })
    .catch(() => null);
};

export default getCrmUserGuid;
