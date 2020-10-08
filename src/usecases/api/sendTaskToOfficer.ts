import { V1MatAPIGatewayInterface } from '../../gateways/v1MatAPIGateway';
import { TenancyManagementInteraction } from '../../interfaces/tenancyManagementInteraction';
import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { MatPostgresGatewayInterface } from '../../gateways/matPostgresGateway';
import HackneyToken from '../../interfaces/hackneyToken';
import { Result } from '../../lib/utils';

interface SendTaskToOfficerInterface {
  execute(
    taskId: string,
    userDetails: HackneyToken,
    newOfficerId: string
  ): Promise<Result<void>>;
}

class SendTaskToOfficerUseCase implements SendTaskToOfficerInterface {
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
    userDetails: HackneyToken,
    newOfficerId: string
  ): Promise<Result<void>> {
    // fetch task from crm
    const existingTask = await this.crmGateway.getTask(taskId);
    if (!existingTask || !existingTask.body)
      return new Error('Error fetching task from crm');

    // fetch patch data from crm
    const housingOfficerPatch = await this.crmGateway.getPatchByOfficerId(
      newOfficerId
    );
    if (
      !housingOfficerPatch ||
      !housingOfficerPatch.body ||
      !housingOfficerPatch.body.patchId ||
      !housingOfficerPatch.body.areaId
    )
      return new Error('Error fetching patch');

    const updateObject: TenancyManagementInteraction = {
      interactionId: taskId, //TMI id
      estateOfficerId: newOfficerId, //officer id
      officerPatchId: housingOfficerPatch.body.patchId, //patch id
      areaName: housingOfficerPatch.body.areaId, //areaId
      serviceRequest: {
        description: `Transferred from: ${userDetails.name}`, //use the same value as below for estateOfficerName
        requestCallback: false, //leave as false for now
        id: existingTask.body.incidentId, //incident ID
      },
      estateOfficerName: userDetails.name, //officer’s name, in this case it will be the manager's name
    };

    const result = await this.v1ApiGateway.transferCall(updateObject);

    if (!result.body) {
      return new Error('Problem assigning task to officer');
    }
  }
}

export default SendTaskToOfficerUseCase;
