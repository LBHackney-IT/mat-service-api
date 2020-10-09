import axios, { AxiosError } from 'axios';
import V1ApiContact from '../interfaces/v1ApiContact';
import { TenancyManagementInteraction } from '../interfaces/tenancyManagementInteraction';
import { NewNote } from '../interfaces/note';
import { CheckResult } from '../pages/api/healthcheck';
import { Result } from '../lib/utils';

export interface V1MatAPIGatewayInterface {
  createTenancyManagementInteraction(
    tmi: TenancyManagementInteraction
  ): Promise<Result<TenancyManagementInteraction>>;
  patchTenancyManagementInteraction(
    tmi: TenancyManagementInteraction
  ): Promise<Result<TenancyManagementInteraction>>;
  getContactsByUprn(uprn: string): Promise<Result<V1ApiContact[]>>;
  transferCall(tmi: TenancyManagementInteraction): Promise<Result<void>>;
  createTaskNote(note: NewNote): Promise<Result<void>>;
  healthCheck(): Promise<CheckResult>;
}

interface GetContactsByUprnAPIResponse {
  results: V1ApiContact[];
}

type Headers = {
  headers: {
    Authorization: string;
  };
};

const errorHandler = (error: AxiosError): Error => {
  if (error.response) console.log(error.response.data);
  return error;
};

export default class V1MatAPIGateway implements V1MatAPIGatewayInterface {
  v1MatApiUrl: string;
  v1MatApiToken: string;

  constructor(v1MatApiUrl: string, v1MatApiToken: string) {
    this.v1MatApiUrl = v1MatApiUrl;
    this.v1MatApiToken = v1MatApiToken;
  }

  headers(): Headers {
    return {
      headers: {
        Authorization: `Bearer ${this.v1MatApiToken}`,
      },
    };
  }

  public async createTenancyManagementInteraction(
    tmi: TenancyManagementInteraction
  ): Promise<Result<TenancyManagementInteraction>> {
    return axios
      .post<TenancyManagementInteraction>(
        `${this.v1MatApiUrl}/v1/TenancyManagementInteractions/CreateTenancyManagementInteraction`,
        tmi,
        this.headers()
      )
      .then((response) => response.data)
      .catch(errorHandler);
  }

  public async patchTenancyManagementInteraction(
    tmi: TenancyManagementInteraction
  ): Promise<Result<TenancyManagementInteraction>> {
    return axios
      .patch<TenancyManagementInteraction>(
        `${this.v1MatApiUrl}/v1/TenancyManagementInteractions`,
        tmi,
        this.headers()
      )
      .then((response) => response.data)
      .catch(errorHandler);
  }

  public async getContactsByUprn(
    uprn: string
  ): Promise<Result<V1ApiContact[]>> {
    // Note: urpn is not a typo here - the v1 MaT API contains the typo and we have to use it
    return axios
      .get<GetContactsByUprnAPIResponse>(
        `${this.v1MatApiUrl}/v1/Contacts/GetContactsByUprn?urpn=${uprn}`,
        this.headers()
      )
      .then((response) => response.data.results)
      .catch(errorHandler);
  }

  public async transferCall(
    tmi: TenancyManagementInteraction
  ): Promise<Result<void>> {
    return axios
      .put(
        `${this.v1MatApiUrl}/v1/TenancyManagementInteractions/TransferCall`,
        tmi,
        this.headers()
      )
      .then(() => undefined)
      .catch(errorHandler);
  }

  public async createTaskNote(note: NewNote): Promise<Result<void>> {
    return axios
      .patch(
        `${this.v1MatApiUrl}/v1/TenancyManagementInteractions`,
        note,
        this.headers()
      )
      .then((response) => response.data)
      .catch(errorHandler);
  }

  public async healthCheck(): Promise<CheckResult> {
    const response = await axios
      .get(`${this.v1MatApiUrl}/Values`, this.headers())
      .then(() => {
        return { success: true };
      })
      .catch((error: AxiosError) => {
        if (error.response) console.log(error.response.data);
        return {
          message: 'Could not connect to v1 MaT API',
          success: false,
        };
      });

    return response;
  }
}
