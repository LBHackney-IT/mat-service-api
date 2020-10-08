import axios, { AxiosError } from 'axios';
import { CrmTokenGatewayInterface } from './crmTokenGateway';
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
import { crmResponseToTenancies, CrmTenancy } from '../mappings/crmToTenancy';
import { Officer } from '../mappings/crmToOfficersDetails';
import getNotesForTaskById from './xmlQueryStrings/getTaskNotes';
import { crmToNotes } from '../mappings/crmToNotes';
import getPropertyPatchByUprn from './xmlQueryStrings/getPropertyPatchByUprn';
import crmToPropertyPatch from '../mappings/crmToPropertyPatch';
import { CrmResponseInterface } from '../mappings/crmToPropertyPatch';
import Note from '../interfaces/note';
import Contact from '../interfaces/contact';
import { crmResponseToContacts } from '../mappings/crmToContact';
import { CheckResult } from '../pages/api/healthcheck';
import { Result, isSuccess } from '../lib/utils';
import getIntroductoryTenanciesByDateQuery from './xmlQueryStrings/getIntroductoryTenanciesByDate';
import { Tenancy } from '../interfaces/tenancy';
import { PropertyPatchDetails } from '../interfaces/propertyPatchDetails';

export interface CrmResponse {
  '@odata.context': string;
  value: Record<string, unknown> | Record<string, unknown>[];
}

export interface GenericCrmResponse<T> {
  '@odata.context': string;
  value: T;
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
  ): Promise<Result<Task[]>>;
  getTasksForTagRef(tag_ref: string): Promise<Result<Task[]>>;
  getTask(taskId: string): Promise<Result<Task>>;
  getUserId(emailAddress: string): Promise<GatewayResponse<string>>;
  createUser(
    emailAddress: string,
    fullName: string,
    firstName: string,
    familyName: string
  ): Promise<GatewayResponse<string>>;
  getPatchByOfficerId(
    emailAddress: string
  ): Promise<GatewayResponse<PatchDetailsInterface>>;
  getPropertyPatch(
    uprn: string
  ): Promise<GatewayResponse<PropertyPatchDetails>>;
  getOfficersByAreaId(areaId: number): Promise<GatewayResponse<Officer[]>>;
  getNotesForTask(taskId: string): Promise<GatewayResponse<Note[]>>;
  getContactsByTagRef(tagRef: string): Promise<GatewayResponse<Contact[]>>;
  getIntroductoryTenanciesByDate(date: Date): Promise<Result<Tenancy[]>>;
  healthCheck(): Promise<CheckResult>;
}

type Headers = {
  headers: {
    Authorization: string;
    Prefer: string;
  };
};

const errorHandler = (error: AxiosError): Error => {
  if (error.response) console.log(error.response.data);
  return error;
};

class CrmGateway implements CrmGatewayInterface {
  baseUrl: string;
  crmTokenGateway: CrmTokenGatewayInterface;
  crmApiToken: string | undefined;

  constructor(baseUrl: string, crmTokenGateway: CrmTokenGatewayInterface) {
    this.baseUrl = baseUrl;
    this.crmTokenGateway = crmTokenGateway;
    this.crmApiToken = undefined;
  }

  headers(): Headers {
    return {
      headers: {
        Authorization: `Bearer ${this.crmApiToken}`,
        Prefer:
          'odata.include-annotations="OData.Community.Display.V1.FormattedValue"',
      },
    };
  }

  async updateToken(): Promise<void> {
    if (!this.crmApiToken) {
      const result = await this.crmTokenGateway.getToken();
      if (isSuccess(result)) this.crmApiToken = result;
    }
  }

  public async getTasksForAPatch(
    isManager: boolean,
    areaManagerId: string,
    patchId?: string
  ): Promise<Result<Task[]>> {
    await this.updateToken();
    if (!this.crmApiToken) return new Error('CRM token missing');

    const crmQuery = getTasksByPatchAndOfficerIdQuery(
      isManager,
      areaManagerId,
      patchId
    );

    return axios
      .get<CrmResponse>(
        `${this.baseUrl}/api/data/v8.2/hackney_tenancymanagementinteractionses?fetchXml=${crmQuery}`,
        this.headers()
      )
      .then((response) => crmResponseToTasks(response.data))
      .catch(errorHandler);
  }

  public async getTasksForTagRef(tag_ref: string): Promise<Result<Task[]>> {
    await this.updateToken();
    if (!this.crmApiToken) return new Error('CRM token missing');

    const crmQuery = getTasksByTagRef(tag_ref);

    return await axios
      .get<CrmResponse>(
        `${this.baseUrl}/api/data/v8.2/hackney_tenancymanagementinteractionses?fetchXml=${crmQuery}`,
        this.headers()
      )
      .then((response) => crmResponseToTasks(response.data))
      .catch(errorHandler);
  }

  public async getTask(taskId: string): Promise<Result<Task>> {
    await this.updateToken();
    if (!this.crmApiToken) return new Error('CRM token missing');

    const crmQuery = getTaskById(taskId);

    return await axios
      .get<CrmResponse>(
        `${this.baseUrl}/api/data/v8.2/hackney_tenancymanagementinteractionses?fetchXml=${crmQuery}`,
        this.headers()
      )
      .then((response) => {
        if (response.data.value.length === 0) return new Error('No task found');
        return crmResponseToTask(response.data);
      })
      .catch(errorHandler);
  }

  public async getNotesForTask(
    taskId: string
  ): Promise<GatewayResponse<Note[]>> {
    await this.updateToken();
    if (!this.crmApiToken) return { error: 'CRM token missing' };

    const crmQuery = getNotesForTaskById(taskId);

    return await axios
      .get(
        `${this.baseUrl}/api/data/v8.2/hackney_tenancymanagementinteractionses?fetchXml=${crmQuery}`,
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
    if (!this.crmApiToken) return { error: 'CRM token missing' };

    const crmQuery = getUserByEmail(emailAddress);

    return await axios
      .get(
        `${this.baseUrl}/api/data/v8.2/hackney_estateofficers?fetchXml=${crmQuery}`,
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
  ): Promise<GatewayResponse<string>> {
    await this.updateToken();
    if (!this.crmApiToken) return { error: 'CRM token missing' };

    const crmUser = {
      hackney_name: fullName,
      hackney_firstname: firstName,
      hackney_lastname: familyName,
      hackney_emailaddress: emailAddress,
    };

    return await axios
      .post(
        `${this.baseUrl}/api/data/v8.2/hackney_estateofficers`,
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
    if (!this.crmApiToken) return { error: 'CRM token missing' };

    const crmQuery = getPatchByOfficerId(officerId);

    return await axios
      .get(
        `${this.baseUrl}/api/data/v8.2/hackney_estateofficers?fetchXml=${crmQuery}`,
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
  ): Promise<GatewayResponse<PropertyPatchDetails>> {
    await this.updateToken();
    if (!this.crmApiToken) return { error: 'CRM token missing' };

    const crmQuery = getPropertyPatchByUprn(uprn);

    return await axios
      .get<CrmResponseInterface>(
        `${this.baseUrl}/api/data/v8.2/hackney_propertyareapatchs?fetchXml=${crmQuery}`,
        this.headers()
      )
      .then((response) => {
        return {
          body: crmToPropertyPatch(response.data),
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
    if (!this.crmApiToken) return { error: 'CRM token missing' };

    const crmQuery = getOfficersByAreaId(areaId);

    return await axios
      .get(
        `${this.baseUrl}/api/data/v8.2/hackney_propertyareapatchs?fetchXml=${crmQuery}`,
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
    if (!this.crmApiToken) return { error: 'CRM token missing' };

    const crmQuery = getContactsByTagRef(tagRef);

    return await axios
      .get(
        `${this.baseUrl}/api/data/v8.2/contacts?fetchXml=${crmQuery}`,
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

  public async getIntroductoryTenanciesByDate(
    date: Date
  ): Promise<Result<Tenancy[]>> {
    await this.updateToken();
    if (!this.crmApiToken) return new Error('CRM token missing');

    const crmQuery = getIntroductoryTenanciesByDateQuery(date);

    return await axios
      .get<GenericCrmResponse<CrmTenancy[]>>(
        `${this.baseUrl}/api/data/v8.2/accounts?fetchXml=${crmQuery}`,
        this.headers()
      )
      .then((response) => {
        const tenancies = crmResponseToTenancies(response.data);
        // If we've retrieved the max number of rows then the last record might not be complete
        if (response.data.value.length === 5000) tenancies.pop();
        return tenancies;
      })
      .catch(() => {
        return new Error('Error fetching latest tenancies from crm');
      });
  }

  public async healthCheck(): Promise<CheckResult> {
    const errorMsg = {
      success: false,
      message: `Could not query dynamics`,
    };
    await this.updateToken();
    if (!this.crmApiToken) return errorMsg;

    return await axios
      .get<CrmResponse>(
        `${this.baseUrl}/api/data/v8.2/contacts?$select=createdon&$top=1`,
        this.headers()
      )
      .then((response) => {
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
        if (error.response) console.log(error.response.data);
        return errorMsg;
      });
  }
}

export default CrmGateway;
