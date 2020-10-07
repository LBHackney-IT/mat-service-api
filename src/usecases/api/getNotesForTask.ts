import { CrmGatewayInterface } from '../../gateways/crmGateway';
import Note from '../../interfaces/note';
import { Result } from '../../lib/utils';

export interface GetNotesForTaskInterface {
  execute(taskId: string): Promise<Result<Note[]>>;
}

export default class GetNotesForTask implements GetNotesForTaskInterface {
  crmGateway: CrmGatewayInterface;

  constructor(crmGateway: CrmGatewayInterface) {
    this.crmGateway = crmGateway;
  }
  async execute(taskId: string): Promise<Result<Note[]>> {
    const response = await this.crmGateway.getNotesForTask(taskId);

    if (response.body && !response.error) return response.body;
    switch (response.error) {
      case 'NotAuthorised':
        return new Error('Not Authorised');
      default:
        return new Error('Unknown error getting notes for task');
    }
  }
}
