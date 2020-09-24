import axios, { AxiosError } from 'axios';
import CrmTokenGateway, { CrmTokenGatewayInterface } from './crmTokenGateway';
import { Task } from '../interfaces/task';
import { crmResponseToTask, crmResponseToTasks } from '../mappings/crmToTask';
import getTasksByPatchAndOfficerIdQuery from './xmlQueryStrings/getTasksByPatchAndOfficerId';
import getTasksByTagRef from './xmlQueryStrings/getTasksByTagRef';
import getUserByEmail from './xmlQueryStrings/getUserByEmail';
import getOfficerByAreaIdQuery from './xmlQueryStrings/getOfficerByAreaId';

import getPatchByOfficerId from './xmlQueryStrings/getPatchByOfficerId';
import getContactsByTagRef from './xmlQueryStrings/getContactsByTagRef';
import crmToPatchDetails, {
  PatchDetailsInterface,
} from '../mappings/crmToPatchDetails';
import getTaskById from './xmlQueryStrings/getTaskById';
import getOfficersByAreaId from './xmlQueryStrings/getOfficersByAreaId';
import { crmToOfficersDetails } from '../mappings/crmToOfficersDetails';
import { Officer } from '../mappings/crmToOfficersDetails';
import getNotesForTaskById from './xmlQueryStrings/getTaskNotes';
import { crmToNotes } from '../mappings/crmToNotes';
import getPropertyPatchByUprn from './xmlQueryStrings/getPropertyPatchByUprn';
import crmToPropertyPatch, {
  PropertyPatchDetailsInterface,
} from '../mappings/crmToPropertyPatch';
import { CrmResponseInterface } from '../mappings/crmToPropertyPatch';
import { Note, CrmNote } from '../interfaces/note';
import Contact from '../interfaces/contact';
import { crmResponseToContacts } from '../mappings/crmToContact';
import { CheckResult } from '../pages/api/healthcheck';

export interface CrmResponse {
  '@odata.context': string;
  value: object | object[];
}

interface GetPatchByOfficerIdResponse {
  body?: PatchDetailsInterface;
  error?: string;
}

export interface GetPropertyPatchResponse {
  body?: PropertyPatchDetailsInterface;
  error?: string;
}

export interface CrmGatewayGetUserResponse {
  body?: {
    '@odata.etag': string;
    hackney_estateofficerid: string;
  }[];
  error?: string;
}

export interface CrmGatewayInterface {
  getTasksForAPatch(
    officerId: string,
    isManager: boolean,
    areaManagerId: string,
    patchId?: string
  ): Promise<GetTasksResponse>;
  getTask(taskId: string): Promise<GetTaskResponse>;
  getUser(emailAddress: string): Promise<CrmGatewayGetUserResponse>;
  createUser(
    emailAddress: string,
    fullName: string,
    firstName: string,
    familyName: string
  ): any;
  getPatchByOfficerId(
    emailAddress: string
  ): Promise<GetPatchByOfficerIdResponse>;
  getOfficersByAreaId(areaId: number): any;
  getTasksForTagRef(tag_ref: string): Promise<GetTasksResponse>;
  getNotesForTask(taskId: string): Promise<GetNotesForTaskResponse>;
  getContactsByTagRef(tagRef: string): Promise<GetContactsByTagRefResponse>;
  healthCheck(): Promise<CheckResult>;
}

interface GetTasksResponse {
  body?: Task[];
  error?: string;
}

interface GetTaskResponse {
  body?: Task;
  error?: string;
}

interface GetNotesForTaskResponse {
  body?: Note[];
  error?: string;
}

export interface GetOfficersByAreaIdResponse {
  body?: Officer[];
  error?: string;
}

interface GetContactsByTagRefResponse {
  body?: Contact[];
  error?: string;
}

class CrmGateway implements CrmGatewayInterface {
  crmTokenGateway: CrmTokenGatewayInterface;
  crmApiToken: any;

  constructor() {
    this.crmTokenGateway = new CrmTokenGateway();
    this.crmApiToken = undefined;
  }

  public async getTasksForAPatch(
    officerId: string,
    isManager: boolean,
    areaManagerId: string,
    patchId?: string
  ): Promise<GetTasksResponse> {
    if (!this.crmApiToken) {
      this.crmApiToken = await this.crmTokenGateway.getToken();
    }

    if (this.crmApiToken.error) return this.crmApiToken;

    const crmQuery = getTasksByPatchAndOfficerIdQuery(
      officerId,
      isManager,
      areaManagerId,
      patchId
    );

    const response = await axios
      .get(
        `${process.env.CRM_API_URL}/api/data/v8.2/hackney_tenancymanagementinteractionses?fetchXml=${crmQuery}`,
        {
          headers: {
            Authorization: `Bearer ${this.crmApiToken.body}`,
            Prefer:
              'odata.include-annotations="OData.Community.Display.V1.FormattedValue"',
          },
        }
      )
      .then((response) => {
        const data = response.data as CrmResponse;
        return {
          body: crmResponseToTasks(data),
          error: undefined,
        };
      })
      .catch((error: AxiosError) => {
        return {
          body: undefined,
          error: error.message,
        };
      });

    return response;
  }

  public async getTasksForTagRef(tag_ref: string): Promise<GetTasksResponse> {
    if (!this.crmApiToken) {
      this.crmApiToken = await this.crmTokenGateway.getToken();
    }
    if (this.crmApiToken.error) return this.crmApiToken;

    const crmQuery = getTasksByTagRef(tag_ref);

    const response = await axios
      .get(
        `${process.env.CRM_API_URL}/api/data/v8.2/hackney_tenancymanagementinteractionses?fetchXml=${crmQuery}`,
        {
          headers: {
            Authorization: `Bearer ${this.crmApiToken.body}`,
            Prefer:
              'odata.include-annotations="OData.Community.Display.V1.FormattedValue"',
          },
        }
      )
      .then((response) => {
        const data = response.data as CrmResponse;
        return {
          body: crmResponseToTasks(data),
          error: undefined,
        };
      })
      .catch((error: AxiosError) => {
        console.log('error: ' + error);

        return {
          body: undefined,
          error: error.message,
        };
      });

    return response;
  }

  public async getTask(taskId: string): Promise<GetTaskResponse> {
    if (!this.crmApiToken) {
      this.crmApiToken = await this.crmTokenGateway.getToken();
    }

    if (this.crmApiToken.error) return this.crmApiToken;

    const crmQuery = getTaskById(taskId);

    const response = await axios
      .get(
        `${process.env.CRM_API_URL}/api/data/v8.2/hackney_tenancymanagementinteractionses?fetchXml=${crmQuery}`,
        {
          headers: {
            Authorization: `Bearer ${this.crmApiToken.body}`,
            Prefer:
              'odata.include-annotations="OData.Community.Display.V1.FormattedValue"',
          },
        }
      )
      .then((response) => {
        const data = response.data as CrmResponse;
        console.log(data);
        const task = crmResponseToTask(data);

        return {
          body: task,
          error: undefined,
        };
      })
      .catch((error: AxiosError) => {
        return {
          body: undefined,
          error: error.message,
        };
      });

    return response;
  }

  public async getNotesForTask(
    taskId: string
  ): Promise<GetNotesForTaskResponse> {
    if (!this.crmApiToken) {
      this.crmApiToken = await this.crmTokenGateway.getToken();
    }

    if (this.crmApiToken.error) return this.crmApiToken;

    const crmQuery = getNotesForTaskById(taskId);

    const response = await axios
      .get(
        `${process.env.CRM_API_URL}/api/data/v8.2/hackney_tenancymanagementinteractionses?fetchXml=${crmQuery}`,
        {
          headers: {
            Authorization: `Bearer ${this.crmApiToken.body}`,
            Prefer:
              'odata.include-annotations="OData.Community.Display.V1.FormattedValue"',
          },
        }
      )
      .then((response) => {
        const data = response.data as CrmResponse;
        const notes = crmToNotes(data);

        return {
          body: notes,
          error: undefined,
        };
      })
      .catch((error: AxiosError) => {
        return {
          body: undefined,
          error: error.message,
        };
      });

    return response;
  }

  public async getUser(
    emailAddress: string
  ): Promise<CrmGatewayGetUserResponse> {
    if (!this.crmApiToken) {
      this.crmApiToken = await this.crmTokenGateway.getToken();
    }

    if (this.crmApiToken.error) return this.crmApiToken;

    const crmQuery = getUserByEmail(emailAddress);

    const response = await axios
      .get(
        `${process.env.CRM_API_URL}/api/data/v8.2/hackney_estateofficers?fetchXml=${crmQuery}`,
        {
          headers: {
            Authorization: `Bearer ${this.crmApiToken.body}`,
            Prefer:
              'odata.include-annotations="OData.Community.Display.V1.FormattedValue"',
          },
        }
      )
      .then((response) => {
        const data = response.data;
        return {
          body: data.value,
          error: undefined,
        };
      })
      .catch((error) => {
        return {
          body: undefined,
          error: error.message,
        };
      });
    return response;
  }

  public async createUser(
    emailAddress: string,
    fullName: string,
    firstName: string,
    familyName: string
  ) {
    const crmUser = {
      hackney_name: fullName,
      hackney_firstname: firstName,
      hackney_lastname: familyName,
      hackney_emailaddress: emailAddress,
    };

    if (!this.crmApiToken) {
      this.crmApiToken = await this.crmTokenGateway.getToken();
    }

    if (this.crmApiToken.error) return this.crmApiToken;

    const response = await axios
      .post(
        `${process.env.CRM_API_URL}/api/data/v8.2/hackney_estateofficers`,
        crmUser,
        {
          headers: {
            Authorization: `Bearer ${this.crmApiToken.body}`,
            Prefer:
              'odata.include-annotations="OData.Community.Display.V1.FormattedValue"',
          },
        }
      )
      .then((response) => {
        const data = response.headers.location.match(/\((.*?)\)/)[1];
        return {
          body: data,
          error: undefined,
        };
      })
      .catch((error) => {
        return {
          body: undefined,
          error: error.message,
        };
      });
    return response;
  }

  public async getPatchByOfficerId(
    officerId: string
  ): Promise<GetPatchByOfficerIdResponse> {
    if (!this.crmApiToken) {
      this.crmApiToken = await this.crmTokenGateway.getToken();
    }

    if (this.crmApiToken.error) return this.crmApiToken;

    const crmQuery = getPatchByOfficerId(officerId);

    const response = await axios
      .get(
        `${process.env.CRM_API_URL}/api/data/v8.2/hackney_estateofficers?fetchXml=${crmQuery}`,
        {
          headers: {
            Authorization: `Bearer ${this.crmApiToken.body}`,
            Prefer:
              'odata.include-annotations="OData.Community.Display.V1.FormattedValue"',
          },
        }
      )
      .then((response) => {
        const data = response.data;
        const patchDetails: PatchDetailsInterface = crmToPatchDetails(data);

        return {
          body: patchDetails,
          error: undefined,
        };
      })
      .catch((error: AxiosError) => {
        return {
          body: undefined,
          error: error.message,
        };
      });

    return response;
  }

  public async getPropertyPatch(
    uprn: string
  ): Promise<GetPropertyPatchResponse> {
    if (!this.crmApiToken) {
      this.crmApiToken = await this.crmTokenGateway.getToken();
    }

    if (this.crmApiToken.error) return this.crmApiToken;

    const crmQuery = getPropertyPatchByUprn(uprn);

    const response = await axios
      .get(
        `${process.env.CRM_API_URL}/api/data/v8.2/hackney_propertyareapatchs?fetchXml=${crmQuery}`,
        {
          headers: {
            Authorization: `Bearer ${this.crmApiToken.body}`,
            Prefer:
              'odata.include-annotations="OData.Community.Display.V1.FormattedValue"',
          },
        }
      )
      .then((response) => {
        const data = response.data as CrmResponseInterface;
        const patchData: PropertyPatchDetailsInterface = crmToPropertyPatch(
          data
        );
        return {
          body: patchData,
          error: undefined,
        };
      })
      .catch((error: AxiosError) => {
        return {
          body: undefined,
          error: error.message,
        };
      });
    return response;
  }

  public async getOfficersByAreaId(
    areaId: number
  ): Promise<GetOfficersByAreaIdResponse> {
    if (!this.crmApiToken) {
      this.crmApiToken = await this.crmTokenGateway.getToken();
    }

    if (this.crmApiToken.error) return this.crmApiToken;
    const crmQuery = getOfficersByAreaId(areaId);

    const response = await axios
      .get(
        `${process.env.CRM_API_URL}/api/data/v8.2/hackney_propertyareapatchs?fetchXml=${crmQuery}`,
        {
          headers: {
            Authorization: `Bearer ${this.crmApiToken.body}`,
            Prefer:
              'odata.include-annotations="OData.Community.Display.V1.FormattedValue"',
          },
        }
      )
      .then((response) => {
        const data = response.data;
        const officers: Officer[] = crmToOfficersDetails(data);

        return {
          body: officers,
          error: undefined,
        };
      })
      .catch((error: AxiosError) => {
        return {
          body: undefined,
          error: error.message,
        };
      });

    return response;
  }

  public async getContactsByTagRef(
    tagRef: string
  ): Promise<GetContactsByTagRefResponse> {
    if (!this.crmApiToken) {
      this.crmApiToken = await this.crmTokenGateway.getToken();
    }

    if (this.crmApiToken.error) return this.crmApiToken;
    const crmQuery = getContactsByTagRef(tagRef);

    const response = await axios
      .get(
        `${process.env.CRM_API_URL}/api/data/v8.2/contacts?fetchXml=${crmQuery}`,
        {
          headers: {
            Authorization: `Bearer ${this.crmApiToken.body}`,
            Prefer:
              'odata.include-annotations="OData.Community.Display.V1.FormattedValue"',
          },
        }
      )
      .then((response) => {
        const data = response.data;
        const contacts = crmResponseToContacts(data);

        return {
          body: contacts,
          error: undefined,
        };
      })
      .catch((error: AxiosError) => {
        return {
          body: undefined,
          error: error.message,
        };
      });

    return response;
  }

  public async healthCheck(): Promise<CheckResult> {
    if (!this.crmApiToken) {
      this.crmApiToken = await this.crmTokenGateway.getToken();
    }

    if (this.crmApiToken.error) return this.crmApiToken;

    const errorMsg = {
      success: false,
      message: `Could not query dynamics`,
    };
    const result = await axios
      .get(
        `${process.env.CRM_API_URL}/api/data/v8.2/contacts?$select=createdon&$top=1`,
        {
          headers: {
            Authorization: `Bearer ${this.crmApiToken.body}`,
            Prefer:
              'odata.include-annotations="OData.Community.Display.V1.FormattedValue"',
          },
        }
      )
      .then((response: any) => {
        if (
          response.data &&
          response.data.value &&
          response.data.value.length
        ) {
          return { success: true };
        } else {
          return errorMsg;
        }
      })
      .catch((error: AxiosError) => {
        return errorMsg;
      });
    return result;
  }
}

export default CrmGateway;
