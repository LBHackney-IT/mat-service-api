import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { Task } from '../../interfaces/task';

interface GetTasksResponse {
  body?: Task[];
  error?: string;
}

export interface GetTasksForAPatchInterface {
  execute(
    isManager: boolean,
    areaManagerId: string,
    patchId?: string
  ): Promise<GetTasksResponse>;
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
  ): Promise<GetTasksResponse> {
    return await this.crmGateway.getTasksForAPatch(
      isManager,
      areaManagerId,
      patchId
    );
  }
}

export default GetTasksForAPatch;
