import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { Task } from '../../interfaces/task';
import { crmGateway } from '../../gateways';

interface GetTaskResponse {
  body: Task | undefined;
  error: number | undefined;
}

interface GetTaskInterface {
  execute(): Promise<GetTaskResponse>;
}

class GetTask implements GetTaskInterface {
  crmGateway: CrmGatewayInterface;
  taskId: string;

  constructor(taskId: string) {
    this.crmGateway = crmGateway;
    this.taskId = taskId;
  }

  public async execute(): Promise<GetTaskResponse> {
    const response = await this.crmGateway.getTask(this.taskId);

    switch (response.error) {
      case undefined:
        return {
          body: response.body,
          error: undefined,
        };
      case 'NotAuthorised':
        return {
          body: undefined,
          error: 401,
        };
      default:
        return {
          body: undefined,
          error: 500,
        };
    }
  }
}

export default GetTask;
