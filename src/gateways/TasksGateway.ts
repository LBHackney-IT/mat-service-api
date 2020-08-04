interface GetTasksResponse {
  body: string | undefined
  error: string | undefined
}

export interface TasksGatewayInterface {
  getTasks(): GetTasksResponse;
}

class TasksGateway implements TasksGatewayInterface {
  public getTasks() :GetTasksResponse {
    return {
      body: "",
      error: undefined
    }
  }
}

export default TasksGateway
