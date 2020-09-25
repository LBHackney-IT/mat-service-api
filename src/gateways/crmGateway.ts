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

type mappingFn<inputType, outputType> = (arg: inputType) => outputType;

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

  async doAxiosGet<inputType, responseType>(
    url: string,
    mappingFunction: mappingFn<inputType, responseType>,
    errorMessage: string
  ): Promise<GatewayResponse<responseType>> {
    await this.updateToken();
    if (this.crmApiToken.error) return this.crmApiToken;

    return axios
      .get(`${process.env.CRM_API_URL}${url}`, this.headers())
      .then((response) => {
        return { body: mappingFunction(response.data as inputType) };
      })
      .catch((error: AxiosError) => {
        if (error.response) console.log(error.response.data);
        return { error: errorMessage };
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
    return await this.doAxiosGet<CrmResponse, Task[]>(
      `/api/data/v8.2/hackney_tenancymanagementinteractionses?fetchXml=${crmQuery}`,
      crmResponseToTasks,
      'Error getting tasks by patch and officer'
    );
  }

  public async getTasksForTagRef(
    tag_ref: string
  ): Promise<GatewayResponse<Task[]>> {
    const crmQuery = getTasksByTagRef(tag_ref);
    return await this.doAxiosGet<CrmResponse, Task[]>(
      `/api/data/v8.2/hackney_tenancymanagementinteractionses?fetchXml=${crmQuery}`,
      crmResponseToTasks,
      'Error getting tasks for tag ref'
    );
  }

  public async getTask(taskId: string): Promise<GatewayResponse<Task>> {
    const crmQuery = getTaskById(taskId);
    return await this.doAxiosGet<CrmResponse, Task>(
      `/api/data/v8.2/hackney_tenancymanagementinteractionses?fetchXml=${crmQuery}`,
      crmResponseToTask,
      'Error getting task'
    );
  }

  public async getNotesForTask(
    taskId: string
  ): Promise<GatewayResponse<Note[]>> {
    const crmQuery = getNotesForTaskById(taskId);

    return await this.doAxiosGet<CrmResponse, Note[]>(
      `/api/data/v8.2/hackney_tenancymanagementinteractionses?fetchXml=${crmQuery}`,
      crmToNotes,
      'Error getting notes for task'
    );
  }

  public async getUserId(
    emailAddress: string
  ): Promise<GatewayResponse<string>> {
    const crmQuery = getUserByEmail(emailAddress);
    const error = 'Could not find user in crm';
    const mapper = (data: any): string | null => {
      if (
        data &&
        data.value &&
        Array.isArray(data.value) &&
        data.value.length > 0 &&
        data.value[0].hackney_estateofficerid
      ) {
        return data.value[0].hackney_estateofficerid;
      }
      return null;
    };

    const result = await this.doAxiosGet<any, string | null>(
      `/api/data/v8.2/hackney_estateofficers?fetchXml=${crmQuery}`,
      mapper,
      error
    );
    if (!result.body) return { error };
    return { body: result.body };
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
    return await this.doAxiosGet<
      CrmPatchDetailsInterface,
      PatchDetailsInterface
    >(
      `/api/data/v8.2/hackney_estateofficers?fetchXml=${crmQuery}`,
      crmToPatchDetails,
      'Error getting patch by officer id'
    );
  }

  public async getPropertyPatch(
    uprn: string
  ): Promise<GatewayResponse<PropertyPatchDetailsInterface>> {
    const crmQuery = getPropertyPatchByUprn(uprn);
    return await this.doAxiosGet<
      CrmPropertyPatchInterface,
      PropertyPatchDetailsInterface
    >(
      `/api/data/v8.2/hackney_propertyareapatchs?fetchXml=${crmQuery}`,
      crmToPropertyPatch,
      'Error getting property patch'
    );
  }

  public async getOfficersByAreaId(
    areaId: number
  ): Promise<GatewayResponse<Officer[]>> {
    const crmQuery = getOfficersByAreaId(areaId);
    return await this.doAxiosGet<CrmResponse, Officer[]>(
      `/api/data/v8.2/hackney_propertyareapatchs?fetchXml=${crmQuery}`,
      crmToOfficersDetails,
      'Error getting officers by area id'
    );
  }

  public async getContactsByTagRef(
    tagRef: string
  ): Promise<GatewayResponse<Contact[]>> {
    const crmQuery = getContactsByTagRef(tagRef);
    return await this.doAxiosGet<CrmContacts, Contact[]>(
      `/api/data/v8.2/contacts?fetchXml=${crmQuery}`,
      crmResponseToContacts,
      'Error getting contacts by tag ref'
    );
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
