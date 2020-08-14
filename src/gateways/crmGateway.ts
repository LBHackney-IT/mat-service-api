import axios, { AxiosError } from 'axios';
import CrmTokenGateway, { CrmTokenGatewayInterface } from "./crmTokenGateway";
import { Task } from '../interfaces/task';
import { crmResponseToTask, crmResponseToTasks } from '../mappings/crmToTask';
import getTasksByPatchIdQuery from './xmlQueryStrings/getTasksByPatchId';
import getTaskById from './xmlQueryStrings/getTaskById';

export interface CrmResponse {
  "@odata.context": string,
  value: object | object[]
}

export interface CrmGatewayInterface {
  getTasksByPatchId(patchId: string): any;
  getTask(taskId: string): any;
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

        return {
          body: crmResponseToTask(data),
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
