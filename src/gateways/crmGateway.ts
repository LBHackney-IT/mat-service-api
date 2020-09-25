import axios, { AxiosError } from 'axios';
import CrmTokenGateway, { CrmTokenGatewayInterface } from './crmTokenGateway';
import { Task } from '../interfaces/task';
import { crmResponseToTask, crmResponseToTasks } from '../mappings/crmToTask';
import getTasksByPatchAndOfficerIdQuery from './xmlQueryStrings/getTasksByPatchAndOfficerId';
import getTasksByTagRef from './xmlQueryStrings/getTasksByTagRef';
import getUserByEmail from './xmlQueryStrings/getUserByEmail';
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

export interface GatewayResponse<T> {
  body?: T;
  error?: string;
}

export interface CrmGatewayInterface {
  getTasksForAPatch(
    officerId: string,
    isManager: boolean,
    areaManagerId: string,
    patchId?: string
  ): Promise<GatewayResponse<Task[]>>;
  getTask(taskId: string): Promise<GatewayResponse<Task>>;
  getUserId(emailAddress: string): Promise<GatewayResponse<string>>;
  createUser(
    emailAddress: string,
    fullName: string,
    firstName: string,
    familyName: string
  ): Promise<GatewayResponse<object>>;
  getPatchByOfficerId(
    emailAddress: string
  ): Promise<GatewayResponse<PatchDetailsInterface>>;
  getPropertyPatch(
    uprn: string
  ): Promise<GatewayResponse<PropertyPatchDetailsInterface>>;
  getOfficersByAreaId(areaId: number): Promise<GatewayResponse<Officer[]>>;
  getTasksForTagRef(tag_ref: string): Promise<GatewayResponse<Task[]>>;
  getNotesForTask(taskId: string): Promise<GatewayResponse<Note[]>>;
  getContactsByTagRef(tagRef: string): Promise<GatewayResponse<Contact[]>>;
  healthCheck(): Promise<CheckResult>;
}

class CrmGateway implements CrmGatewayInterface {
  crmTokenGateway: CrmTokenGatewayInterface;
  crmApiToken: any;

  constructor() {
    this.crmTokenGateway = new CrmTokenGateway();
    this.crmApiToken = undefined;
  }

  headers() {
    return {
      headers: {
        Authorization: `Bearer ${this.crmApiToken.body}`,
        Prefer:
          'odata.include-annotations="OData.Community.Display.V1.FormattedValue"',
      },
    };
  }

  async updateToken() {
    if (!this.crmApiToken) {
      this.crmApiToken = await this.crmTokenGateway.getToken();
    }
  }

  public async getTasksForAPatch(
    officerId: string,
    isManager: boolean,
    areaManagerId: string,
    patchId?: string
  ): Promise<GatewayResponse<Task[]>> {
    await this.updateToken();
    if (this.crmApiToken.error) return this.crmApiToken;

    const crmQuery = getTasksByPatchAndOfficerIdQuery(
      officerId,
      isManager,
      areaManagerId,
      patchId
    );

    return await axios
      .get(
        `${process.env.CRM_API_URL}/api/data/v8.2/hackney_tenancymanagementinteractionses?fetchXml=${crmQuery}`,
        this.headers()
      )
      .then((response) => {
        const data = response.data as CrmResponse;
        return {
          body: crmResponseToTasks(data),
        };
      })
      .catch((error: AxiosError) => {
        return {
          error: error.message,
        };
      });
  }

  public async getTasksForTagRef(
    tag_ref: string
  ): Promise<GatewayResponse<Task[]>> {
    await this.updateToken();
    if (this.crmApiToken.error) return this.crmApiToken;

    const crmQuery = getTasksByTagRef(tag_ref);

    return await axios
      .get(
        `${process.env.CRM_API_URL}/api/data/v8.2/hackney_tenancymanagementinteractionses?fetchXml=${crmQuery}`,
        this.headers()
      )
      .then((response) => {
        const data = response.data as CrmResponse;
        return {
          body: crmResponseToTasks(data),
        };
      })
      .catch((error: AxiosError) => {
        console.log('error: ' + error);

        return {
          error: error.message,
        };
      });
  }

  public async getTask(taskId: string): Promise<GatewayResponse<Task>> {
    await this.updateToken();
    if (this.crmApiToken.error) return this.crmApiToken;

    const crmQuery = getTaskById(taskId);

    return await axios
      .get(
        `${process.env.CRM_API_URL}/api/data/v8.2/hackney_tenancymanagementinteractionses?fetchXml=${crmQuery}`,
        this.headers()
      )
      .then((response) => {
        const data = response.data as CrmResponse;
        const task = crmResponseToTask(data);

        return {
          body: task,
        };
      })
      .catch((error: AxiosError) => {
        return {
          error: error.message,
        };
      });
  }

  public async getNotesForTask(
    taskId: string
  ): Promise<GatewayResponse<Note[]>> {
    await this.updateToken();
    if (this.crmApiToken.error) return this.crmApiToken;

    const crmQuery = getNotesForTaskById(taskId);

    return await axios
      .get(
        `${process.env.CRM_API_URL}/api/data/v8.2/hackney_tenancymanagementinteractionses?fetchXml=${crmQuery}`,
        this.headers()
      )
      .then((response) => {
        const data = response.data as CrmResponse;
        const notes = crmToNotes(data);

        return {
          body: notes,
        };
      })
      .catch((error: AxiosError) => {
        return {
          error: error.message,
        };
      });
  }

  public async getUserId(
    emailAddress: string
  ): Promise<GatewayResponse<string>> {
    await this.updateToken();
    if (this.crmApiToken.error) return this.crmApiToken;

    const crmQuery = getUserByEmail(emailAddress);

    return await axios
      .get(
        `${process.env.CRM_API_URL}/api/data/v8.2/hackney_estateofficers?fetchXml=${crmQuery}`,
        this.headers()
      )
      .then((response) => {
        if (
          response.data &&
          response.data.value &&
          response.data.value.length > 0 &&
          response.data.value[0].hackney_estateofficerid
        ) {
          return { body: response.data.value[0].hackney_estateofficerid };
        } else {
          return { error: 'Could not find user in crm' };
        }
      })
      .catch((error) => {
        return {
          error: error.message,
        };
      });
  }

  public async createUser(
    emailAddress: string,
    fullName: string,
    firstName: string,
    familyName: string
  ): Promise<GatewayResponse<object>> {
    await this.updateToken();
    if (this.crmApiToken.error) return this.crmApiToken;

    const crmUser = {
      hackney_name: fullName,
      hackney_firstname: firstName,
      hackney_lastname: familyName,
      hackney_emailaddress: emailAddress,
    };

    return await axios
      .post(
        `${process.env.CRM_API_URL}/api/data/v8.2/hackney_estateofficers`,
        crmUser,
        this.headers()
      )
      .then((response) => {
        const data = response.headers.location.match(/\((.*?)\)/)[1];
        return {
          body: data,
        };
      })
      .catch((error) => {
        return {
          error: error.message,
        };
      });
  }

  public async getPatchByOfficerId(
    officerId: string
  ): Promise<GatewayResponse<PatchDetailsInterface>> {
    await this.updateToken();
    if (this.crmApiToken.error) return this.crmApiToken;

    const crmQuery = getPatchByOfficerId(officerId);

    return await axios
      .get(
        `${process.env.CRM_API_URL}/api/data/v8.2/hackney_estateofficers?fetchXml=${crmQuery}`,
        this.headers()
      )
      .then((response) => {
        const data = response.data;
        const patchDetails: PatchDetailsInterface = crmToPatchDetails(data);

        return {
          body: patchDetails,
        };
      })
      .catch((error: AxiosError) => {
        return {
          error: error.message,
        };
      });
  }

  public async getPropertyPatch(
    uprn: string
  ): Promise<GatewayResponse<PropertyPatchDetailsInterface>> {
    await this.updateToken();
    if (this.crmApiToken.error) return this.crmApiToken;

    const crmQuery = getPropertyPatchByUprn(uprn);

    return await axios
      .get(
        `${process.env.CRM_API_URL}/api/data/v8.2/hackney_propertyareapatchs?fetchXml=${crmQuery}`,
        this.headers()
      )
      .then((response) => {
        const data = response.data as CrmResponseInterface;
        const patchData: PropertyPatchDetailsInterface = crmToPropertyPatch(
          data
        );
        return {
          body: patchData,
        };
      })
      .catch((error: AxiosError) => {
        return {
          error: error.message,
        };
      });
  }

  public async getOfficersByAreaId(
    areaId: number
  ): Promise<GatewayResponse<Officer[]>> {
    await this.updateToken();
    if (this.crmApiToken.error) return this.crmApiToken;

    const crmQuery = getOfficersByAreaId(areaId);

    return await axios
      .get(
        `${process.env.CRM_API_URL}/api/data/v8.2/hackney_propertyareapatchs?fetchXml=${crmQuery}`,
        this.headers()
      )
      .then((response) => {
        const data = response.data;
        const officers: Officer[] = crmToOfficersDetails(data);

        return {
          body: officers,
        };
      })
      .catch((error: AxiosError) => {
        return {
          error: error.message,
        };
      });
  }

  public async getContactsByTagRef(
    tagRef: string
  ): Promise<GatewayResponse<Contact[]>> {
    await this.updateToken();
    if (this.crmApiToken.error) return this.crmApiToken;

    const crmQuery = getContactsByTagRef(tagRef);

    return await axios
      .get(
        `${process.env.CRM_API_URL}/api/data/v8.2/contacts?fetchXml=${crmQuery}`,
        this.headers()
      )
      .then((response) => {
        const data = response.data;
        const contacts = crmResponseToContacts(data);

        return {
          body: contacts,
        };
      })
      .catch((error: AxiosError) => {
        return {
          error: error.message,
        };
      });
  }

  public async healthCheck(): Promise<CheckResult> {
    await this.updateToken();
    if (this.crmApiToken.error) return this.crmApiToken;

    const errorMsg = {
      success: false,
      message: `Could not query dynamics`,
    };
    return await axios
      .get(
        `${process.env.CRM_API_URL}/api/data/v8.2/contacts?$select=createdon&$top=1`,
        this.headers()
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
  }
}

export default CrmGateway;
