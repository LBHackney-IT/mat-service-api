import CrmGateway, { CrmGatewayInterface } from "../../gateways/crmGateway";
import { Task } from "../../interfaces/task";

interface GetTasksResponse {
  body: Task[] | undefined
  error: number | undefined
}

interface GetTasksInterface {
  execute(): Promise<GetTasksResponse>
}

class GetTasks implements GetTasksInterface {
  tasksGateway: CrmGatewayInterface;
  constructor() {
    this.tasksGateway = new CrmGateway();
  }
  public async execute() :Promise<GetTasksResponse> {
    const response = await this.tasksGateway.getTasks();

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

export default GetTasks
