import axios, { AxiosError } from 'axios';
import CrmTokenGateway from "./crmTokenGateway";
import { Task } from '../interfaces/task';
import crmResponseToTask, { CrmResponseInterface } from '../mappings/crmToTask';
import { getTasksByPatchId } from './xmlQueryStrings/getTasksByPatchId';

interface GetTasksResponse {
  body: Task[] | undefined;
  error: string | undefined;
}

export interface CrmGatewayInterface {
  getTasksByPatchId(patchId: string): any;
}

class CrmGateway implements CrmGatewayInterface {
  public async getTasksByPatchId(patchId: string): Promise<GetTasksResponse> {
    const crmTokenGateway = new CrmTokenGateway();
    const crmApiToken = await crmTokenGateway.getCloudToken();
    const response = await axios
      .get(`${process.env.CRM_API_URL}/api/data/v8.2/hackney_tenancymanagementinteractionses?fetchXml=${getTasksByPatchId}`, {
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
}

export default CrmGateway;
