import CrmGateway, { CrmGatewayInterface } from "../../gateways/crmGateway";
import { Task } from "../../interfaces/task";

interface GetTasksResponse {
  body: Task[] | undefined
  error: number | undefined
}

interface GetTasksInterface {
  execute(): Promise<GetTasksResponse>
}

class GetTasksByPatchId implements GetTasksInterface {
  crmGateway: CrmGatewayInterface;
  patchId: string;

  constructor(patchId: string) {
    this.crmGateway = new CrmGateway();
    this.patchId = patchId;
  }
  public async execute(): Promise<GetTasksResponse> {

    const response = await this.crmGateway.getTasksByPatchId(this.patchId);

    switch(response.error) {
      case undefined:
        return  {
          body: response.body,
          error: undefined
        }
      case "NotAuthorised":
        return {
          body: undefined,
          error: 401
        }
      default:
        return {
          body: undefined,
          error: 500
        }
    }
  }
}

export default GetTasksByPatchId;
