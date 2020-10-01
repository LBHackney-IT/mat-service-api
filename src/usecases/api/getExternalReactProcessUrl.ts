import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { MatPostgresGatewayInterface } from '../../gateways/matPostgresGateway';
import { Task } from '../../interfaces/task';
import {
  GetExternalProcessUrlInterface,
  GetExternalProcessUrlOptions,
  GetExternalProcessUrlResponse,
} from './getExternalProcessUrl';

export default class GetExternalReactEtraProcessUrl
  implements GetExternalProcessUrlInterface {
  encryptionKey: string;
  crmGateway: CrmGatewayInterface;
  matPostgresGateway: MatPostgresGatewayInterface;

  //TODO: use args not options
  constructor(options: GetExternalProcessUrlOptions) {
    this.encryptionKey = options.encryptionKey;
    this.crmGateway = options.crmGateway;
    this.matPostgresGateway = options.matPostgresGateway;
  }

  public async execute(
    taskId: string,
    officerEmail: string
  ): Promise<GetExternalProcessUrlResponse> {
    const task: Task | undefined = (await this.crmGateway.getTask(taskId)).body;
    if (!officerEmail) return { error: 'Officer email required' };
    if (!task) return { error: 'Could not load task from crm' };
    if (!task.processType) {
      return { error: 'Task does not have a process type' };
    }

    return { error: `New react processes not yet supported` };
  }
}
