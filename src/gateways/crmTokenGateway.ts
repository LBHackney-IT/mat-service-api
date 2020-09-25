import axios, { AxiosResponse, AxiosError } from 'axios';

interface GetTokenResponse {
  accessToken: string;
  expiresAt: string;
}
export interface CrmTokenGatewayResponse {
  body?: string;
  error?: string;
}

export interface CrmTokenGatewayInterface {
  getToken(): Promise<CrmTokenGatewayResponse>;
}

class CrmTokenGateway implements CrmTokenGatewayInterface {
  public async getToken(): Promise<CrmTokenGatewayResponse> {
    if (!process.env.CRM_TOKEN_API_URL || !process.env.CRM_TOKEN_API_KEY) {
      return {
        error: 'CRM token gateway configuration not set',
      };
    }
    const response = await axios
      .post<GetTokenResponse>(
        process.env.CRM_TOKEN_API_URL,
        {},
        {
          headers: {
            'x-api-key': process.env.CRM_TOKEN_API_KEY,
          },
        }
      )
      .then((response) => {
        return { body: response.data.accessToken };
      })
      .catch((error: AxiosError) => {
        return { error: error.message };
      });
    return response;
  }
}

export default CrmTokenGateway;
