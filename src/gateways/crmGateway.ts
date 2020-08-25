import axios, { AxiosError } from 'axios';
import CrmTokenGateway from "./crmTokenGateway";
import { Task } from '../interfaces/task';
import crmResponseToTask, { CrmResponseInterface } from '../mappings/crmToTask';
import getTasksByPatchIdQuery from './xmlQueryStrings/getTasksByPatchId';

interface GetTasksResponse {
  body: Task[] | undefined;
  error: string | undefined;
}

export interface CrmGatewayInterface {
  getTasksByPatchId(patchId: string): any;
  getUser(emailAddress: string): any;
  createUser(emailAddress: string): any;
}

class CrmGateway implements CrmGatewayInterface {
  public async getTasksByPatchId(patchId: string): Promise<GetTasksResponse> {
    const crmTokenGateway = new CrmTokenGateway();
    const crmApiToken = await crmTokenGateway.getCloudToken();
    const crmQuery = getTasksByPatchIdQuery(patchId);

    const response = await axios
      .get(`${process.env.CRM_API_URL}/api/data/v8.2/hackney_tenancymanagementinteractionses?fetchXml=${crmQuery}`, {
        headers: {
          "Authorization": `Bearer ${crmApiToken.token}`,
          "Prefer": "odata.include-annotations=\"OData.Community.Display.V1.FormattedValue\""
        }
      })
      .then((response) => {
        const data = response.data as CrmResponseInterface;
        const tasks = crmResponseToTask(data);
        return {
          body: tasks,
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
    const crmTokenGateway = new CrmTokenGateway();
    const crmApiToken = await crmTokenGateway.getCloudToken();

    const response = await axios
      .get(``, {
        headers: {
          "Authorization": `Bearer ${crmApiToken.token}`,
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
    const crmTokenGateway = new CrmTokenGateway();
    const crmApiToken = await crmTokenGateway.getCloudToken();

    const response = await axios.
      put(``, {
        headers: {
          "Authorization": `Bearer ${crmApiToken.token}`,
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
}

export default CrmGateway;
