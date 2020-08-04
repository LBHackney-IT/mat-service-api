import axios, { AxiosResponse } from 'axios';

interface GetTasksResponse {
  body: string | undefined;
  error: string | undefined;
}

interface Error {
  message: string;
}

export interface TasksGatewayInterface {
  getTasks(): Promise<AxiosResponse<GetTasksResponse>>;
}

class TasksGateway implements TasksGatewayInterface {
  public async getTasks(): Promise<AxiosResponse<GetTasksResponse>> {
    const response = await axios
      .get('')
      .then((response) => {
        const data = response as AxiosResponse<GetTasksResponse>;
        return data;
      })
      .catch((error: Error) => {
        console.log(error);
        return {
          body: undefined,
          error: error.message,
        };
      });
    return response;
  }
}

export default TasksGateway;
