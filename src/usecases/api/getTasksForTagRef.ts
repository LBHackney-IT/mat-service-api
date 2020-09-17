import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { Task } from '../../interfaces/task';

interface GetTasksResponse {
  body?: Task[];
  error?: number;
}

interface GetTasksForTagRefOptions {
  crmGateway: CrmGatewayInterface;
  tag_ref: string;
}

interface GetTasksInterface {
  execute(): Promise<GetTasksResponse>;
}

class GetTasksForTagRef implements GetTasksInterface {
  crmGateway: CrmGatewayInterface;
  tag_ref: string;

  constructor(options: GetTasksForTagRefOptions) {
    this.crmGateway = options.crmGateway;
    this.tag_ref = options.tag_ref;
  }
  public async execute(): Promise<GetTasksResponse> {
    const response = await this.crmGateway.getTasksForTagRef(this.tag_ref);
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
