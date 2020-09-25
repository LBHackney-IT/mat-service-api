import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { Task } from '../../interfaces/task';

interface GetTasksResponse {
  body?: Task[];
  error?: string;
}

interface GetTasksForAPatchOptions {
  crmGateway: CrmGatewayInterface;
}

interface GetTasksInterface {
  execute(
    isManager: boolean,
    areaManagerId: string,
    patchId?: string
  ): Promise<GetTasksResponse>;
}

class GetTasksForAPatch implements GetTasksInterface {
  crmGateway: CrmGatewayInterface;

  constructor(options: GetTasksForAPatchOptions) {
    this.crmGateway = options.crmGateway;
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
