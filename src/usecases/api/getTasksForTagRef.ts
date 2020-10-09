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
    return this.crmGateway.getTasksForTagRef(tagRef);
  }
}

export default GetTasksForTagRef;
