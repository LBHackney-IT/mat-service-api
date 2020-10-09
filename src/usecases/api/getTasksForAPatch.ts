import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { Task } from '../../interfaces/task';
import { Result } from '../../lib/utils';

export interface GetTasksForAPatchInterface {
  execute(
    isManager: boolean,
    areaManagerId: string,
    patchId?: string
  ): Promise<Result<Task[]>>;
}

class GetTasksForAPatch implements GetTasksForAPatchInterface {
  crmGateway: CrmGatewayInterface;

  constructor(crmGateway: CrmGatewayInterface) {
    this.crmGateway = crmGateway;
  }

  public async execute(
    isManager: boolean,
    areaManagerId: string,
    patchId?: string
  ): Promise<Result<Task[]>> {
    return this.crmGateway.getTasksForAPatch(isManager, areaManagerId, patchId);
  }
}

export default GetTasksForAPatch;
