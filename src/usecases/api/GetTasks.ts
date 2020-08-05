import TasksGateway, { TasksGatewayInterface } from "../../gateways/TasksGateway";
import { Task } from "../../interfaces/task";

interface GetTasksResponse {
  body: Task[] | undefined
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
