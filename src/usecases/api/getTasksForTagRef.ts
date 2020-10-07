import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { Task } from '../../interfaces/task';
import { Result } from '../../lib/utils';

export interface GetTasksInterface {
  execute(tagRef: string): Promise<Result<Task[]>>;
}

class GetTasksForTagRef implements GetTasksInterface {
  crmGateway: CrmGatewayInterface;

  constructor(crmGateway: CrmGatewayInterface) {
    this.crmGateway = crmGateway;
  }
  public async execute(tagRef: string): Promise<Result<Task[]>> {
    const response = await this.crmGateway.getTasksForTagRef(tagRef);
    if (response.body && !response.error) return response.body;
    switch (response.error) {
      case 'NotAuthorised':
        return new Error('NotAuthorised');
      default:
        return new Error('Unknown error in getTasksFroTagRef');
    }
  }
}

export default GetTasksForTagRef;
