import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { Task } from '../../interfaces/task';

interface GetTasksResponse {
  body?: Task[];
  error?: number;
}

interface GetTasksForAPatchOptions {
  crmGateway: CrmGatewayInterface;
  patchId?: string;
  officerId: string;
  isManager: boolean;
  areaManagerId: string;
}

interface GetTasksInterface {
  execute(): Promise<GetTasksResponse>;
}

class GetTasksForAPatch implements GetTasksInterface {
  crmGateway: CrmGatewayInterface;
  patchId?: string;
  officerId: string;
  isManager: boolean;
  areaManagerId: string;

  constructor(options: GetTasksForAPatchOptions) {
    this.crmGateway = options.crmGateway;
    this.patchId = options.patchId;
    this.officerId = options.officerId;
    this.isManager = options.isManager;
    this.areaManagerId = options.areaManagerId;
  }
  public async execute(): Promise<GetTasksResponse> {
    const response = await this.crmGateway.getTasksForAPatch(
      this.officerId,
      this.isManager,
      this.areaManagerId,
      this.patchId
    );
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

export default GetTasksForAPatch;
