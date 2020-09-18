import axios, { AxiosError } from 'axios';
import { Tenancy } from '../interfaces/tenancy';
import V1ApiContact from '../interfaces/v1ApiContact';
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
  results?: V1ApiContact[];
  error?: string;
}

export interface GetContactsByUprnResponse {
  body?: V1ApiContact[];
  error?: string;
}

export interface GetAreaPatchResponse {
  body?: any;
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
    // Note: urpn is not a typo here - the v1 MaT API contains the typo and we have to use it
    const response = await axios
      .get(`${this.v1MatApiUrl}/v1/Contacts/GetContactsByUprn?urpn=${uprn}`, {
        headers: {
          Authorization: `Bearer ${this.v1MatApiToken}`,
        },
      })
      .then((response) => {
        const data = response.data as GetContactsByUprnAPIResponse;
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

  public async getAreaPatch(
    uprn: string,
    postcode: string
  ): Promise<GetAreaPatchResponse> {
    const response = await axios
      .get(
        `${this.v1MatApiUrl}/v1/AreaPatch/GetAreaPatch?postcode=${postcode}&uprn=${uprn}`,
        {
          headers: {
            Authorization: `Bearer ${this.v1MatApiToken}`,
          },
        }
      )
      .then((response) => {
        const data = response.data;
        return {
          body: data.result,
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
