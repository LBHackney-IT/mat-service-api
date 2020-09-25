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
  CrmPatchDetailsInterface,
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
import { CrmPropertyPatchInterface } from '../mappings/crmToPropertyPatch';
import { Note, CrmNote } from '../interfaces/note';
import Contact from '../interfaces/contact';
import { CrmContacts, crmResponseToContacts } from '../mappings/crmToContact';
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

interface AxiosResponse {
  data?: CrmResponse;
  error?: AxiosError;
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

  async doAxiosGet(url: string): Promise<AxiosResponse> {
    await this.updateToken();
    if (this.crmApiToken.error) return this.crmApiToken;

    return axios
      .get(`${process.env.CRM_API_URL}${url}`, this.headers())
      .then((response) => {
        return { data: response.data as CrmResponse };
      })
      .catch((error: AxiosError) => {
        return { error };
      });
  }

  public async getTasksForAPatch(
    isManager: boolean,
    areaManagerId: string,
    patchId?: string
  ): Promise<GatewayResponse<Task[]>> {
    const crmQuery = getTasksByPatchAndOfficerIdQuery(
      isManager,
      areaManagerId,
      patchId
    );
    const result = await this.doAxiosGet(
      `/api/data/v8.2/hackney_tenancymanagementinteractionses?fetchXml=${crmQuery}`
    );

    if (result.error || !result.data) {
      return { error: 'Error getting tasks by patch and officer' };
    }
    return { body: crmResponseToTasks(result.data) };
  }

  public async getTasksForTagRef(
    tag_ref: string
  ): Promise<GatewayResponse<Task[]>> {
    const crmQuery = getTasksByTagRef(tag_ref);
    const result = await this.doAxiosGet(
      `/api/data/v8.2/hackney_tenancymanagementinteractionses?fetchXml=${crmQuery}`
    );

    if (result.error || !result.data) {
      return { error: 'Error getting tasks for tag ref' };
    }
    return { body: crmResponseToTasks(result.data) };
  }

  public async getTask(taskId: string): Promise<GatewayResponse<Task>> {
    const crmQuery = getTaskById(taskId);
    const result = await this.doAxiosGet(
      `/api/data/v8.2/hackney_tenancymanagementinteractionses?fetchXml=${crmQuery}`
    );

    if (result.error || !result.data) {
      return { error: 'Error getting task' };
    }
    return { body: crmResponseToTask(result.data) };
  }

  public async getNotesForTask(
    taskId: string
  ): Promise<GatewayResponse<Note[]>> {
    await this.updateToken();
    if (this.crmApiToken.error) return this.crmApiToken;
    const crmQuery = getNotesForTaskById(taskId);

    const result = await this.doAxiosGet(
      `/api/data/v8.2/hackney_tenancymanagementinteractionses?fetchXml=${crmQuery}`
    );

    if (result.error || !result.data) {
      return { error: 'Error getting notes for task' };
    }
    return { body: crmToNotes(result.data) };
  }

  public async getUserId(
    emailAddress: string
  ): Promise<GatewayResponse<string>> {
    const crmQuery = getUserByEmail(emailAddress);
    const result = await this.doAxiosGet(
      `/api/data/v8.2/hackney_estateofficers?fetchXml=${crmQuery}`
    );

    if (result.error) return { error: result.error.message };
    const data = result.data as any;
    if (
      data &&
      data.value &&
      data.value.length > 0 &&
      data.value[0].hackney_estateofficerid
    ) {
      return { body: data.value[0].hackney_estateofficerid };
    } else {
      return { error: 'Could not find user in crm' };
    }
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
    const crmQuery = getPatchByOfficerId(officerId);
    const result = await this.doAxiosGet(
      `/api/data/v8.2/hackney_estateofficers?fetchXml=${crmQuery}`
    );

    if (result.error || !result.data) {
      return { error: 'Error getting patch by officer id' };
    }
    return {
      body: crmToPatchDetails(result.data as CrmPatchDetailsInterface),
    };
  }

  public async getPropertyPatch(
    uprn: string
  ): Promise<GatewayResponse<PropertyPatchDetailsInterface>> {
    const crmQuery = getPropertyPatchByUprn(uprn);
    const result = await this.doAxiosGet(
      `/api/data/v8.2/hackney_propertyareapatchs?fetchXml=${crmQuery}`
    );

    if (result.error || !result.data) {
      return { error: 'Error getting property patch' };
    }
    return {
      body: crmToPropertyPatch(result.data as CrmPropertyPatchInterface),
    };
  }

  public async getOfficersByAreaId(
    areaId: number
  ): Promise<GatewayResponse<Officer[]>> {
    const crmQuery = getOfficersByAreaId(areaId);
    const result = await this.doAxiosGet(
      `/api/data/v8.2/hackney_propertyareapatchs?fetchXml=${crmQuery}`
    );

    if (result.error || !result.data) {
      return { error: 'Error getting officers by area id' };
    }
    return {
      body: crmToOfficersDetails(result.data),
    };
  }

  public async getContactsByTagRef(
    tagRef: string
  ): Promise<GatewayResponse<Contact[]>> {
    const crmQuery = getContactsByTagRef(tagRef);
    const result = await this.doAxiosGet(
      `/api/data/v8.2/contacts?fetchXml=${crmQuery}`
    );

    if (result.error || !result.data) {
      return { error: 'Error getting contacts by tag ref' };
    }
    return {
      body: crmResponseToContacts(result.data as CrmContacts),
    };
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
