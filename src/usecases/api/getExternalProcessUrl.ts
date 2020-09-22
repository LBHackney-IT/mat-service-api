import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { Task } from '../../interfaces/task';
import { ProcessType } from '../../interfaces/task';
import GetExternalAngularProcessUrl from './getExternalAngularProcessUrl';
import GetExternalReactEtraProcessUrl from './getExternalReactEtraProcessUrl';
import GetExternalReactProcessUrl from './getExternalReactProcessUrl';
import { MatPostgresGatewayInterface } from '../../gateways/matPostgresGateway';

enum ProcessAppType {
  angular,
  reactProcess,
  reactEtra,
}

const ProcessTypeMapping: { [key: string]: ProcessAppType } = {
  [ProcessType.itv]: ProcessAppType.angular,
  [ProcessType.thc]: ProcessAppType.angular,
  [ProcessType.homecheck]: ProcessAppType.angular,
  [ProcessType.etra]: ProcessAppType.reactEtra,
};

export interface GetExternalProcessUrlResponse {
  body?: string;
  error?: string;
}

export interface GetExternalProcessUrlInterface {
  execute(
    taskId: string,
    officerEmail: string
  ): Promise<GetExternalProcessUrlResponse>;
}

export interface GetExternalProcessUrlOptions {
  encryptionKey: string;
  crmGateway: CrmGatewayInterface;
  matPostgresGateway: MatPostgresGatewayInterface;
}

export default class GetExternalProcessUrlUseCase
  implements GetExternalProcessUrlInterface {
  options: GetExternalProcessUrlOptions;

  constructor(options: GetExternalProcessUrlOptions) {
    this.options = options;
  }

  async execute(taskId: string, officerEmail: string) {
    const task: Task | undefined = (
      await this.options.crmGateway.getTask(taskId)
    ).body;
    if (!task) return { error: 'Could not load task from crm' };
    if (!task.processType) {
      return { error: 'Task does not have a process type' };
    }

    const type = ProcessTypeMapping[task.processType];

    let useCase;
    if (type === ProcessAppType.angular) {
      useCase = new GetExternalAngularProcessUrl(this.options);
    } else if (type === ProcessAppType.reactProcess) {
      useCase = new GetExternalReactProcessUrl(this.options);
    } else if (type === ProcessAppType.reactEtra) {
      useCase = new GetExternalReactEtraProcessUrl(this.options);
    } else {
      return { error: 'Unknown external process type' };
    }

    return await useCase.execute(taskId, officerEmail);
  }
}
