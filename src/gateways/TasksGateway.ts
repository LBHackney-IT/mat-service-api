import axios, { AxiosResponse, AxiosError } from 'axios';

interface GetTasksResponse {
  body: string | undefined;
  error: string | undefined;
}

export interface TasksGatewayInterface {
  getTasks(): any;
}

class TasksGateway implements TasksGatewayInterface {
  public async getTasks() {
    const response = await axios
      .get('')
      .then((response) => {
        const data = response as AxiosResponse<GetTasksResponse>;
        return data;
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
