import axios, { AxiosResponse, AxiosError } from 'axios';
import CrmTokenGateway from "./CrmTokenGateway";
import { Task } from '../interfaces/task';
import crmResponseToTask from '../mappings/crmToTask';
import { getTasksQuery } from './xmlQueryStrings/getTasks';

interface GetTasksResponse {
  body: Task[] | undefined;
  error: string | undefined;
}

export interface TasksGatewayInterface {
  getTasks(): any;
}

class TasksGateway implements TasksGatewayInterface {
  public async getTasks() {
    const crmTokenGateway = new CrmTokenGateway();
    const crmApiToken = await crmTokenGateway.getCloudToken();

    const response = await axios
      .get(`${process.env.CRM_API_URL}/api/data/v8.2/hackney_tenancymanagementinteractionses?fetchXml=${getTasksQuery}`, {
        headers: {
          "Authorization": `Bearer ${crmApiToken.token}`,
          "Prefer": "odata.include-annotations=\"OData.Community.Display.V1.FormattedValue\""
        }
      })
      .then((response) => {
        const data = response as AxiosResponse<GetTasksResponse>;
        const tasks = crmResponseToTask(data.data);
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

export default TasksGateway;
