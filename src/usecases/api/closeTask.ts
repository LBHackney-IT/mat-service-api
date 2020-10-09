import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { V1MatAPIGatewayInterface } from '../../gateways/v1MatAPIGateway';
import { MatPostgresGatewayInterface } from '../../gateways/matPostgresGateway';
import { TenancyManagementInteraction } from '../../interfaces/tenancyManagementInteraction';
import { Result, isError, isSuccess } from '../../lib/utils';

export interface CloseTaskInterface {
  execute(taskId: string, userEmail: string): Promise<Result<boolean>>;
}

export default class CloseTaskUseCase implements CloseTaskInterface {
  crmGateway: CrmGatewayInterface;
  v1ApiGateway: V1MatAPIGatewayInterface;
  matPostgresGateway: MatPostgresGatewayInterface;

  constructor(
    crmGateway: CrmGatewayInterface,
    v1ApiGateway: V1MatAPIGatewayInterface,
    matPostgresGateway: MatPostgresGatewayInterface
  ) {
    this.crmGateway = crmGateway;
    this.v1ApiGateway = v1ApiGateway;
    this.matPostgresGateway = matPostgresGateway;
  }

  public async execute(
    taskId: string,
    userEmail: string
  ): Promise<Result<boolean>> {
    // fetch task from crm
    const existingTask = await this.crmGateway.getTask(taskId);
    if (isError(existingTask)) return new Error('Error fetching task from crm');

    // fetch current user from crm
    const officer = await this.matPostgresGateway.getUserMapping(userEmail);
    if (isError(officer) || !officer) {
      return new Error('Error fetching mapped user');
    }

    const updateObject: TenancyManagementInteraction = {
      interactionId: taskId,
      estateOfficerName: officer.username,
      serviceRequest: {
        description: 'Closed task',
        requestCallback: false,
        id: existingTask.incidentId,
      },
      status: 0,
      estateOfficerId: officer.usercrmid,
    };

    const result = await this.v1ApiGateway.patchTenancyManagementInteraction(
      updateObject
    );

    if (isSuccess(result)) {
      return true;
    } else {
      return new Error('Unknown error closing task');
    }
  }
}
