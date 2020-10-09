import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { ProcessType } from '../../interfaces/task';
import GetExternalAngularProcessUrl from './getExternalAngularProcessUrl';
import GetExternalReactEtraProcessUrl from './getExternalReactEtraProcessUrl';
import GetExternalReactProcessUrl from './getExternalReactProcessUrl';
import { MatPostgresGatewayInterface } from '../../gateways/matPostgresGateway';
import { isError, Result } from '../../lib/utils';

enum ProcessAppType {
  angular,
  reactProcess,
  reactEtra,
}

export type GetExternalProcessUrlResponse = Result<string>;

const ProcessTypeMapping: { [key: string]: ProcessAppType } = {
  [ProcessType.itv]: ProcessAppType.angular,
  [ProcessType.thc]: ProcessAppType.angular,
  [ProcessType.homecheck]: ProcessAppType.angular,
  [ProcessType.etra]: ProcessAppType.reactEtra,
};

export interface GetExternalProcessUrlInterface {
  execute(
    taskId: string,
    officerEmail: string
  ): Promise<GetExternalProcessUrlResponse>;
}

export default class GetExternalProcessUrlUseCase
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

  async execute(
    taskId: string,
    officerEmail: string
  ): Promise<GetExternalProcessUrlResponse> {
    const task = await this.crmGateway.getTask(taskId);
    if (isError(task)) return new Error('Could not load task from crm');
    if (!task.processType) {
      return new Error('Task does not have a process type');
    }

    const type = ProcessTypeMapping[task.processType];

    let useCase;
    if (type === ProcessAppType.angular) {
      useCase = new GetExternalAngularProcessUrl(
        this.encryptionKey,
        this.crmGateway,
        this.matPostgresGateway
      );
    } else if (type === ProcessAppType.reactProcess) {
      useCase = new GetExternalReactProcessUrl(
        this.encryptionKey,
        this.crmGateway,
        this.matPostgresGateway
      );
    } else if (type === ProcessAppType.reactEtra) {
      useCase = new GetExternalReactEtraProcessUrl(
        this.encryptionKey,
        this.crmGateway,
        this.matPostgresGateway
      );
    } else {
      return new Error('Unknown external process type');
    }

    return await useCase.execute(taskId, officerEmail);
  }
}
