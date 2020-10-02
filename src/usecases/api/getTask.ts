import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { Task } from '../../interfaces/task';

interface GetTaskResponse {
  body?: Task;
  error?: number;
}

export interface GetTaskInterface {
  execute(taskId: string): Promise<GetTaskResponse>;
}

class GetTask implements GetTaskInterface {
  crmGateway: CrmGatewayInterface;

  constructor(crmGateway: CrmGatewayInterface) {
    this.crmGateway = crmGateway;
  }

  public async execute(taskId: string): Promise<GetTaskResponse> {
    const response = await this.crmGateway.getTask(taskId);

    switch (response.error) {
      case undefined:
        return { body: response.body };
      case 'NotAuthorised':
        return { error: 401 };
      default:
        return { error: 500 };
    }
  }
}

export default GetTask;
