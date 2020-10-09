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
    return this.crmGateway.getNotesForTask(taskId);
  }
}
