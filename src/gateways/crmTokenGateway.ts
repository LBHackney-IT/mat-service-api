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
  crmTokenApiUrl: string;
  crmTokenApiKey: string;

  constructor(crmTokenApiUrl: string, crmTokenApiKey: string) {
    this.crmTokenApiKey = crmTokenApiKey;
    this.crmTokenApiUrl = crmTokenApiUrl;
  }

  public async getToken(): Promise<Result<string>> {
    return axios
      .post<GetTokenResponse>(
        this.crmTokenApiUrl,
        {},
        {
          headers: {
            'x-api-key': this.crmTokenApiKey,
          },
        }
      )
      .then((response) => response.data.accessToken)
      .catch((error: AxiosError) => new Error(error.message));
  }
}
