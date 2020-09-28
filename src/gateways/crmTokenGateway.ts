import axios, { AxiosError } from 'axios';
import { Result } from '../lib/utils';

interface GetTokenResponse {
  accessToken: string;
  expiresAt: string;
}

export interface CrmTokenGatewayInterface {
  getToken(): Promise<Result<string>>;
}

export default class CrmTokenGateway implements CrmTokenGatewayInterface {
  public async getToken(): Promise<Result<string>> {
    if (!process.env.CRM_TOKEN_API_URL || !process.env.CRM_TOKEN_API_KEY) {
      return new Error('CRM token gateway configuration not set');
    }
    return axios
      .post<GetTokenResponse>(
        process.env.CRM_TOKEN_API_URL,
        {},
        {
          headers: {
            'x-api-key': process.env.CRM_TOKEN_API_KEY,
          },
        }
      )
      .then((response) => response.data.accessToken)
      .catch((error: AxiosError) => new Error(error.message));
  }
}
