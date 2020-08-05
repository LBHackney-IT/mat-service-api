import TasksGateway, { TasksGatewayInterface } from "../../gateways/TasksGateway";

interface GetTasksResponse {
  body: string | undefined
  error: number | undefined
}

interface GetTasksInterface {
  execute(): Promise<GetTasksResponse>
}

class GetTasks implements GetTasksInterface {
  tasksGateway: TasksGatewayInterface;
  constructor() {
    this.tasksGateway = new TasksGateway();
  }
  public async execute() :Promise<GetTasksResponse> {
    const response = await this.tasksGateway.getTasks();

    switch(response.error) {
      case undefined:
        return  {
          body: "",
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
