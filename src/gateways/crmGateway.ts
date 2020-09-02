import axios, { AxiosError } from 'axios';
import CrmTokenGateway from "./crmTokenGateway";
import { Task } from '../interfaces/task';
import crmResponseToTask, { CrmResponseInterface } from '../mappings/crmToTask';
import getTasksByPatchIdQuery from './xmlQueryStrings/getTasksByPatchId';
import getUserByEmail from './xmlQueryStrings/getUserByEmail';

interface GetTasksResponse {
  body: Task[] | undefined;
  error: string | undefined;
}

export interface CrmGatewayInterface {
  getTasksByPatchId(patchId: string): any;
  getUser(emailAddress: string): any;
  createUser(emailAddress: string, fullName: string, firstName: string, familyName: string): any;
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
    const crmQuery = getUserByEmail(emailAddress);

    const response = await axios
      .get(`${process.env.CRM_API_URL}/api/data/v8.2/hackney_estateofficers?fetchXml=${crmQuery}`, {
        headers: {
          "Authorization": `Bearer ${crmApiToken.token}`,
          "Prefer": "odata.include-annotations=\"OData.Community.Display.V1.FormattedValue\""
        }
      })
      .then((response) => {
        const data = response.data;
        return {
          body: data.value,
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

  public async createUser(emailAddress: string, fullName: string, firstName: string, familyName: string) {
    const crmUser = {
      "hackney_name": fullName,
      "hackney_firstname": firstName,
      "hackney_lastname": familyName,
      "hackney_emailaddress": emailAddress
    }

    const crmTokenGateway = new CrmTokenGateway();
    const crmApiToken = await crmTokenGateway.getCloudToken();

    const response = await axios.
      post(`${process.env.CRM_API_URL}/api/data/v8.2/hackney_estateofficers`, crmUser, {
        headers: {
          "Authorization": `Bearer ${crmApiToken.token}`,
          "Prefer": "odata.include-annotations=\"OData.Community.Display.V1.FormattedValue\"",
          "OData-MaxVersion": "4.0",
          "OData-Version": "4.0"
        }
      })
      .then((response) => {
        const data = response.headers.location.match(/\((.*?)\)/)[1];
        return {
          body: data,
          error: undefined
        }
      })
      .catch(error => {
        console.log("ERROR", error);
        return {
          body: undefined,
          error: error.message
        };
      });
      return response;
  }
}

export default CrmGateway;
