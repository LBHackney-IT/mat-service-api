import { v1MatAPIGatewayInterface } from '../../gateways/v1MatAPIGateway';
import { TenancyManagementInteraction } from '../../interfaces/tenancyManagementInteraction';
import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { MatPostgresGatewayInterface } from '../../gateways/matPostgresGateway';

interface SendTaskToOfficerResponse {
  body?: any;
  error?: string;
}

interface SendTaskToOfficerOptions {
  crmGateway: CrmGatewayInterface;
  v1ApiGateway: v1MatAPIGatewayInterface;
  matPostgresGateway: MatPostgresGatewayInterface;
}

interface SendTaskToOfficerInterface {
  execute(
    taskId: string,
    userEmail: string
  ): Promise<SendTaskToOfficerResponse>;
}

class SendTaskToOfficerUseCase implements SendTaskToOfficerInterface {
  crmGateway: CrmGatewayInterface;
  v1ApiGateway: v1MatAPIGatewayInterface;
  matPostgresGateway: MatPostgresGatewayInterface;

  constructor(options: SendTaskToOfficerOptions) {
    this.crmGateway = options.crmGateway;
    this.v1ApiGateway = options.v1ApiGateway;
    this.matPostgresGateway = options.matPostgresGateway;
  }

  public async execute(
    taskId: string,
    userEmail: string
  ): Promise<SendTaskToOfficerResponse> {
    // fetch task from crm
    const existingTask = await this.crmGateway.getTask(taskId);
    if (!existingTask || !existingTask.body)
      return { error: 'Error fetching task from crm' };

    // fetch current user from crm
    const officer = await this.matPostgresGateway.getUserMapping(userEmail);
    if (!officer || !officer.body)
      return { error: 'Error fetching mapped user' };

    // fetch patch data from crm
    const patch = await this.crmGateway.getPatchByOfficerId(
      officer.body.usercrmid
    );
    if (!patch || !patch.body) return { error: 'Error fetching patch' };

    // fetch officer data from crm
    const allOfficersInGivenArea = await this.crmGateway.getOfficersByAreaId(
      patch.body.areaId
    );
    if (!allOfficersInGivenArea || !allOfficersInGivenArea.body)
      return { error: 'Error fetching areaId' };

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

    // const result = await this.v1ApiGateway.transferCall(updateObject);

    const result = {
      body: [
        ['101', 'Officer Mike'],
        ['202', 'Officer Mary'],
        ['303', 'Officer Mark'],
      ],
      error: undefined,
    };

    if (result.body) {
      return {
        body: true,
      };
    } else {
      return {
        error: 'Problem assigning task to manager',
      };
    }
  }
}

export default SendTaskToOfficerUseCase;
