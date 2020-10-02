import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { Task } from '../../interfaces/task';

interface GetTasksResponse {
  body?: Task[];
  error?: number;
}

export interface GetTasksInterface {
  execute(tagRef: string): Promise<GetTasksResponse>;
}

class GetTasksForTagRef implements GetTasksInterface {
  crmGateway: CrmGatewayInterface;

  //TODO: use args not options
  constructor(crmGateway: CrmGatewayInterface) {
    this.crmGateway = crmGateway;
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
