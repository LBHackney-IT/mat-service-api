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
    return this.crmGateway.getTask(taskId);
  }
}

export default GetTask;
