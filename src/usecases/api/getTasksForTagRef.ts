import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { Task } from '../../interfaces/task';

interface GetTasksResponse {
  body?: Task[];
  error?: number;
}

interface GetTasksForTagRefOptions {
  crmGateway: CrmGatewayInterface;
}

interface GetTasksInterface {
  execute(tagRef: string): Promise<GetTasksResponse>;
}

class GetTasksForTagRef implements GetTasksInterface {
  crmGateway: CrmGatewayInterface;

  constructor(options: GetTasksForTagRefOptions) {
    this.crmGateway = options.crmGateway;
  }
  public async execute(tagRef: string): Promise<GetTasksResponse> {
    const response = await this.crmGateway.getTasksForTagRef(tagRef);
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

export default GetTasksForTagRef;
