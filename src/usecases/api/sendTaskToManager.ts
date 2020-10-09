import { V1MatAPIGatewayInterface } from '../../gateways/v1MatAPIGateway';
import { TenancyManagementInteraction } from '../../interfaces/tenancyManagementInteraction';
import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { MatPostgresGatewayInterface } from '../../gateways/matPostgresGateway';
import { isError, Result } from '../../lib/utils';

export interface SendTaskToManagerInterface {
  execute(taskId: string, userEmail: string): Promise<Result<void>>;
}

export default class SendTaskToManagerUseCase
  implements SendTaskToManagerInterface {
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
  ): Promise<Result<void>> {
    // fetch task from crm
    const existingTask = await this.crmGateway.getTask(taskId);
    if (isError(existingTask)) return new Error('Error fetching task from crm');

    // fetch current user from crm
    const officer = await this.matPostgresGateway.getUserMapping(userEmail);
    if (isError(officer) || !officer) {
      return new Error('Error fetching mapped user');
    }

    // fetch patch data from crm
    const patch = await this.crmGateway.getPatchByOfficerId(officer.usercrmid);
    if (isError(patch)) return new Error('Error fetching patch');

    const updateObject: TenancyManagementInteraction = {
      estateOfficerId: officer.usercrmid,
      officerPatchId: officer.usercrmid,
      managerId: patch.areaManagerId,
      assignedToPatch: true,
      areaName: patch.areaId,
      estateOfficerName: officer.username,
      interactionId: taskId,
      serviceRequest: {
        description: `Transferred from: ${officer.username}`,
        id: existingTask.incidentId,
        requestCallback: false,
      },
    };

    const result = await this.v1ApiGateway.transferCall(updateObject);

    if (isError(result)) {
      return new Error('Problem assigning task to manager');
    }
  }
}
