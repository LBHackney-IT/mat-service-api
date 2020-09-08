import axios, { AxiosError } from 'axios';
import { Tenancy } from '../interfaces/tenancy';
import { Contact } from '../interfaces/contact';
import { TenancyManagementInteraction } from '../interfaces/tenancyManagementInteraction';

export interface v1MatAPIGatewayInterface {
  getNewTenancies(): Promise<GetNewTenanciesResponse>;
  createTenancyManagementInteraction(
    tmi: TenancyManagementInteraction
  ): Promise<createTenancyManagementInteractionResponse>;
  getContactsByUprn(uprn: string): Promise<GetContactsByUprnResponse>;
}

export interface GetNewTenanciesResponse {
  result: Tenancy[] | undefined;
  error: string | undefined;
}

export interface createTenancyManagementInteractionResponse {
  error: string | undefined;
}

export interface v1MatAPIGatewayOptions {
  v1MatApiUrl: string;
  v1MatApiToken: string;
}

interface GetContactsByUprnAPIResponse {
  results?: Contact[];
  error?: string;
}

export interface GetContactsByUprnResponse {
  body?: Contact[];
  error?: string;
}

export default class v1MatAPIGateway implements v1MatAPIGatewayInterface {
  v1MatApiUrl: string;
  v1MatApiToken: string;

  constructor(options: v1MatAPIGatewayOptions) {
    this.v1MatApiUrl = options.v1MatApiUrl;
    this.v1MatApiToken = options.v1MatApiToken;
  }

  public async getNewTenancies(): Promise<GetNewTenanciesResponse> {
    const response = await axios
      .get(`${this.v1MatApiUrl}/v1/tenancy/new`, {
        headers: {
          Authorization: `Bearer ${this.v1MatApiToken}`,
        },
      })
      .then((response) => {
        return <GetNewTenanciesResponse>(<unknown>response);
      })
      .catch((error: AxiosError) => {
        return {
          error: error.message,
          result: undefined,
        };
      });

    return response;
  }

  public async createTenancyManagementInteraction(
    tmi: TenancyManagementInteraction
  ): Promise<createTenancyManagementInteractionResponse> {
    const response = await axios
      .post(
        `${this.v1MatApiUrl}/v1/TenancyManagementInteractions/CreateTenancyManagementInteraction`,
        tmi,
        {
          headers: {
            Authorization: `Bearer ${this.v1MatApiToken}`,
          },
        }
      )
      .then((_) => {
        return {
          error: undefined,
        };
      })
      .catch((error: AxiosError) => {
        return {
          error: error.message,
        };
      });

    return response;
  }

  public async getContactsByUprn(
    uprn: string
  ): Promise<GetContactsByUprnResponse> {
    const response = await axios
      .get(`${this.v1MatApiUrl}/v1/Contacts/GetContactsByUprn?urpn=${uprn}`, {
        headers: {
          Authorization: `Bearer ${this.v1MatApiToken}`,
        },
      })
      .then((response) => {
        const data = response as GetContactsByUprnAPIResponse;
        return {
          body: data.results,
          error: undefined,
        };
      })
      .catch((error: AxiosError) => {
        return {
          error: error.message,
        };
      });

    return response;
  }
}
