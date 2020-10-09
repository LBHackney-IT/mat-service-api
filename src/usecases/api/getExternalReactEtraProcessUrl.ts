import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { MatPostgresGatewayInterface } from '../../gateways/matPostgresGateway';
import { isError } from '../../lib/utils';
import {
  GetExternalProcessUrlInterface,
  GetExternalProcessUrlResponse,
} from './getExternalProcessUrl';

export default class GetExternalReactEtraProcessUrl
  implements GetExternalProcessUrlInterface {
  encryptionKey: string;
  crmGateway: CrmGatewayInterface;
  matPostgresGateway: MatPostgresGatewayInterface;

  constructor(
    encryptionKey: string,
    crmGateway: CrmGatewayInterface,
    matPostgresGateway: MatPostgresGatewayInterface
  ) {
    this.encryptionKey = encryptionKey;
    this.crmGateway = crmGateway;
    this.matPostgresGateway = matPostgresGateway;
  }

  public async execute(
    taskId: string,
    officerEmail: string
  ): Promise<GetExternalProcessUrlResponse> {
    if (!officerEmail) return new Error('Officer email required');
    const task = await this.crmGateway.getTask(taskId);
    if (isError(task)) return new Error('Could not load task from crm');
    if (!task.processType) {
      return new Error('Task does not have a process type');
    }

    return new Error(`ETRA not yet supported`);
  }
}
