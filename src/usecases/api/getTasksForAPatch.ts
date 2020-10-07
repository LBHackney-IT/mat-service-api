import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { Task } from '../../interfaces/task';
import { Result } from '../../lib/utils';

interface GetTasksResponse {
  body?: Task[];
  error?: string;
}

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
    const result = await this.crmGateway.getTasksForAPatch(
      isManager,
      areaManagerId,
      patchId
    );
    if (result.body) return result.body;
    return new Error(result.error);
  }
}

export default GetTasksForAPatch;
