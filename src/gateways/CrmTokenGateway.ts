import axios, { AxiosResponse, AxiosError } from 'axios';

interface GetTokenResponse {
  token: string | undefined
}

export interface CrmTokenGatewayInterface {
  getCloudToken(): any;
}

class CrmTokenGateway implements CrmTokenGatewayInterface {
  public async getCloudToken() {
    const apiUrl = process.env.CRM_CLOUD_URL ? process.env.CRM_CLOUD_URL : ""
    const authorizationHeader = process.env.CRM_CLOUD_AUTHORIZATION
    const response = await axios
      .get(apiUrl, {
        headers: {
          'Authorization': authorizationHeader
        }
      })
      .then((response) => {
        const data = response as AxiosResponse<GetTokenResponse>;
        return data;
      })
      .catch((error: AxiosError) => {
        return { token: undefined };
      });
    return response;
  }
}

export default CrmTokenGateway;
