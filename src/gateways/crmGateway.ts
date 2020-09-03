import axios, { AxiosError } from 'axios';
import CrmTokenGateway, { CrmTokenGatewayInterface } from "./crmTokenGateway";
import { Task } from '../interfaces/task';
import { crmResponseToTask, crmResponseToTasks } from '../mappings/crmToTask';
import getTasksByPatchIdQuery from './xmlQueryStrings/getTasksByPatchId';
<<<<<<< HEAD
import getPatchIdByOfficerId from './xmlQueryStrings/getPatchIdByOfficerId';
import crmToPatchDetails, { PatchDetails } from '../mappings/crmToPatchDetails';
=======
import getTaskById from './xmlQueryStrings/getTaskById';
>>>>>>> master

export interface CrmResponse {
  "@odata.context": string,
  value: object | object[]
}

interface GetPatchByOfficerIdResponse{
  body: PatchDetails | undefined,
  error: string | undefined
}

export interface CrmGatewayInterface {
  getTasksByPatchId(patchId: string): Promise<GetTasksResponse>;
  getTask(taskId: string): Promise<GetTaskResponse>;
  getUser(emailAddress: string): any;
  createUser(emailAddress: string): any;
  getPatchByOfficerId(emailAddress: string): any;
}

interface GetTasksResponse {
  body: Task[] | undefined;
  error: string | undefined;
}

interface GetTaskResponse {
  body: Task | undefined;
  error: string | undefined;
}

class CrmGateway implements CrmGatewayInterface {

  crmTokenGateway: CrmTokenGatewayInterface;
  crmApiToken: any;

  constructor() {
    this.crmTokenGateway = new CrmTokenGateway();
    this.crmApiToken = undefined
  }

  public async getTasksByPatchId(patchId: string): Promise<GetTasksResponse> {

    if (!this.crmApiToken) {
      this.crmApiToken = await this.crmTokenGateway.getCloudToken();
    }

    const crmQuery = getTasksByPatchIdQuery(patchId);

    const response = await axios
      .get(`${process.env.CRM_API_URL}/api/data/v8.2/hackney_tenancymanagementinteractionses?fetchXml=${crmQuery}`, {
        headers: {
          "Authorization": `Bearer ${this.crmApiToken.token}`,
          "Prefer": "odata.include-annotations=\"OData.Community.Display.V1.FormattedValue\""
        }
      })
      .then((response) => {
        const data = response.data as CrmResponse;
        return {
          body: crmResponseToTasks(data),
          error: undefined
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

  public async getTask(taskId: string): Promise<GetTaskResponse> {

    if (!this.crmApiToken) {
      this.crmApiToken = await this.crmTokenGateway.getCloudToken();
    }

    const crmQuery = getTaskById(taskId);

    const response = await axios
      .get(`${process.env.CRM_API_URL}/api/data/v8.2/hackney_tenancymanagementinteractionses?fetchXml=${crmQuery}`, {
        headers: {
          "Authorization": `Bearer ${this.crmApiToken.token}`,
          "Prefer": "odata.include-annotations=\"OData.Community.Display.V1.FormattedValue\""
        }
      })
      .then((response) => {
        const data = response.data as CrmResponse;

        const task =  crmResponseToTask(data);

        return {
          body: task,
          error: undefined
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

  public async getUser(emailAddress: string) {

    if (!this.crmApiToken) {
      this.crmApiToken = await this.crmTokenGateway.getCloudToken();
    }

    const response = await axios
      .get(``, {
        headers: {
          "Authorization": `Bearer ${this.crmApiToken.token}`,
          "Prefer": "odata.include-annotations=\"OData.Community.Display.V1.FormattedValue\""
        }
      })
      .then((response) => {
        const data = response.data;
        return {
          body: data,
          error: undefined
        }
      })
      .catch((error) => {
        return {
          body: undefined,
          error: error.message
        };
      });
    return response;
  }

  public async createUser(emailAddress: string) {
    
    if (!this.crmApiToken) {
      this.crmApiToken = await this.crmTokenGateway.getCloudToken();
    }

    const response = await axios.
      put(``, {
        headers: {
          "Authorization": `Bearer ${this.crmApiToken.token}`,
          "Prefer": "odata.include-annotations=\"OData.Community.Display.V1.FormattedValue\""
        }
      })
      .then((response) => {
        const data = response.data;
        return {
          body: data,
          error: undefined
        }
      })
      .catch(error => {
        return {
          body: undefined,
          error: error.message
        };
      });
      return response;
  }

  public async getPatchByOfficerId(officerId: string): Promise<GetPatchByOfficerIdResponse>{
    const crmTokenGateway = new CrmTokenGateway();
    const crmApiToken = await crmTokenGateway.getCloudToken();
    const crmQuery = getPatchIdByOfficerId(officerId);

    const response = await axios
    .get(`${process.env.CRM_API_URL}/api/data/v8.2/hackney_estateofficerpatchs?fetchXml=${crmQuery}`, {
      headers: {
        "Authorization": `Bearer ${crmApiToken.token}`,
        "Prefer": "odata.include-annotations=\"OData.Community.Display.V1.FormattedValue\""
      }
    })
    .then((response) => {
      const data = response.data;
      const patchDetails: PatchDetails = crmToPatchDetails(data);
      return {
        body: patchDetails,
        error: undefined
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
}

export default CrmGateway;
