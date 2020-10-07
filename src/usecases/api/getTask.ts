import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { Task } from '../../interfaces/task';
import { Result } from '../../lib/utils';

export interface GetTaskInterface {
  execute(taskId: string): Promise<Result<Task>>;
}

class GetTask implements GetTaskInterface {
  crmGateway: CrmGatewayInterface;

  constructor(crmGateway: CrmGatewayInterface) {
    this.crmGateway = crmGateway;
  }

  public async execute(taskId: string): Promise<Result<Task>> {
    const response = await this.crmGateway.getTask(taskId);

    if (response.body && !response.error) {
      return response.body;
    }
    switch (response.error) {
      case 'NotAuthorised':
        return new Error('Not Authorised');
      default:
        return new Error('Unknown error in getTask');
    }
  }
}

export default GetTask;
