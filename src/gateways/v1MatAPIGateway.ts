import axios, { AxiosError } from 'axios';
import { Tenancy } from '../interfaces/tenancy';
import V1ApiContact from '../interfaces/v1ApiContact';
import { TenancyManagementInteraction } from '../interfaces/tenancyManagementInteraction';
import { NewNote } from '../interfaces/note';
import { CheckResult } from '../pages/api/healthcheck';

export interface v1MatAPIGatewayInterface {
  createTenancyManagementInteraction(
    tmi: TenancyManagementInteraction
  ): Promise<createTenancyManagementInteractionResponse>;
  patchTenancyManagementInteraction(
    tmi: TenancyManagementInteraction
  ): Promise<patchTenancyManagementInteractionResponse>;
  getContactsByUprn(uprn: string): Promise<GetContactsByUprnResponse>;
  transferCall(
    tmi: TenancyManagementInteraction
  ): Promise<TransferCallResponse>;
  createTaskNote(note: NewNote): Promise<CreateTaskNoteResponse>;
  healthCheck(): Promise<CheckResult>;
}

export interface GetNewTenanciesResponse {
  result: Tenancy[] | undefined;
  error: string | undefined;
}

export interface patchTenancyManagementInteractionResponse {
  body?: TenancyManagementInteraction;
  error?: string;
}

export interface createTenancyManagementInteractionResponse {
  body?: TenancyManagementInteraction;
  error?: string;
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

export interface TransferCallResponse {
  body?: boolean;
  error?: string;
}

export interface CreateTaskNoteResponse {
  body?: boolean;
  error?: string;
}

export default class v1MatAPIGateway implements v1MatAPIGatewayInterface {
  v1MatApiUrl: string;
  v1MatApiToken: string;

  constructor(options: v1MatAPIGatewayOptions) {
    this.v1MatApiUrl = options.v1MatApiUrl;
    this.v1MatApiToken = options.v1MatApiToken;
  }

  public async createTaskNote(note: NewNote): Promise<CreateTaskNoteResponse> {
    const response = await axios
      .patch(`${this.v1MatApiUrl}/v1/TenancyManagementInteractions`, note, {
        headers: {
          Authorization: `Bearer ${this.v1MatApiToken}`,
        },
      })
      .then((response) => {
        return {
          body: response.data,
        };
      })
      .catch((error: AxiosError) => {
        return {
          error: `V1 API: ${error.message}`,
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
      .then((response) => {
        return {
          body: response.data as TenancyManagementInteraction,
        };
      })
      .catch((error: AxiosError) => {
        return {
          error: `V1 API: ${error.message}`,
        };
      });

    return response;
  }

  public async patchTenancyManagementInteraction(
    tmi: TenancyManagementInteraction
  ): Promise<patchTenancyManagementInteractionResponse> {
    const response = await axios
      .patch(`${this.v1MatApiUrl}/v1/TenancyManagementInteractions`, tmi, {
        headers: {
          Authorization: `Bearer ${this.v1MatApiToken}`,
        },
      })
      .then((response) => {
        return {
          body: response.data as TenancyManagementInteraction,
        };
      })
      .catch((error: AxiosError) => {
        return {
          error: `V1 API: ${error.message}`,
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
  public async transferCall(
    tmi: TenancyManagementInteraction
  ): Promise<TransferCallResponse> {
    const response = await axios
      .put(
        `${this.v1MatApiUrl}/v1/TenancyManagementInteractions/TransferCall`,
        tmi,
        {
          headers: {
            Authorization: `Bearer ${this.v1MatApiToken}`,
          },
        }
      )
      .then(() => {
        return {
          body: true,
        };
      })
      .catch((error: AxiosError) => {
        return {
          error: error.message,
        };
      });

    return response;
  }

  public async healthCheck(): Promise<CheckResult> {
    const response = await axios
      .get(`${this.v1MatApiUrl}/Values`, {
        headers: {
          Authorization: `Bearer ${this.v1MatApiToken}`,
        },
      })
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
