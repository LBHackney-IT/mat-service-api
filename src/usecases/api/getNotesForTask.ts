import { CrmGatewayInterface } from '../../gateways/crmGateway';
import Note from '../../interfaces/note';

interface GetNotesForTaskResponse {
  body?: Note[];
  error?: number;
}

export interface GetNotesForTaskInterface {
  execute(taskId: string): Promise<GetNotesForTaskResponse>;
}

export default class GetNotesForTask implements GetNotesForTaskInterface {
  crmGateway: CrmGatewayInterface;

  constructor(crmGateway: CrmGatewayInterface) {
    this.crmGateway = crmGateway;
  }
  async execute(taskId: string): Promise<GetNotesForTaskResponse> {
    const response = await this.crmGateway.getNotesForTask(taskId);

    switch (response.error) {
      case undefined:
        return { body: response.body };
      case 'NotAuthorised':
        return { error: 401 };
      default:
        return { error: 500 };
    }
  }
}
