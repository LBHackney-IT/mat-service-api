import { V1MatAPIGatewayInterface } from '../../gateways/v1MatAPIGateway';
import { TenancyManagementInteraction } from '../../interfaces/tenancyManagementInteraction';
import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { MatPostgresGatewayInterface } from '../../gateways/matPostgresGateway';
import { Result } from '../../lib/utils';

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
    if (!existingTask || !existingTask.body)
      return new Error('Error fetching task from crm');

    // fetch current user from crm
    const officer = await this.matPostgresGateway.getUserMapping(userEmail);
    if (!officer || !officer.body)
      return new Error('Error fetching mapped user');

    // fetch patch data from crm
    const patch = await this.crmGateway.getPatchByOfficerId(
      officer.body.usercrmid
    );
    if (!patch || !patch.body) return new Error('Error fetching patch');

    const updateObject: TenancyManagementInteraction = {
      estateOfficerId: officer.body.usercrmid,
      officerPatchId: officer.body.usercrmid,
      managerId: patch.body.areaManagerId,
      assignedToPatch: true,
      areaName: patch.body.areaId,
      estateOfficerName: officer.body.username,
      interactionId: taskId,
      serviceRequest: {
        description: `Transferred from: ${officer.body.username}`,
        id: existingTask.body.incidentId,
        requestCallback: false,
      },
    };

    const result = await this.v1ApiGateway.transferCall(updateObject);

    if (!result.body) {
      return new Error('Problem assigning task to manager');
    }
  }
}
