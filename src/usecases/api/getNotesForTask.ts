import CrmGateway, { CrmGatewayInterface } from '../../gateways/crmGateway';
import { Note } from '../../interfaces/note';

interface GetNotesForTaskResponse {
  body?: Note[];
  error?: number;
}

interface GetNotesForTaskInterface {
  execute(): Promise<GetNotesForTaskResponse>;
}

class GetNotesForTask implements GetNotesForTaskInterface {
  crmGateway: CrmGatewayInterface;
  taskId: string;

  constructor(taskId: string) {
    this.crmGateway = new CrmGateway();
    this.taskId = taskId;
  }

  public async execute(): Promise<GetNotesForTaskResponse> {
    const response = await this.crmGateway.getNotesForTask(this.taskId);

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

export default GetNotesForTask;
