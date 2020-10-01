import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { V1MatAPIGatewayInterface } from '../../gateways/v1MatAPIGateway';
import { MatPostgresGatewayInterface } from '../../gateways/matPostgresGateway';
import { TenancyManagementInteraction } from '../../interfaces/tenancyManagementInteraction';

interface CloseTaskResponse {
  body?: boolean;
  error?: string;
}
interface CloseTaskOptions {
  crmGateway: CrmGatewayInterface;
  v1ApiGateway: V1MatAPIGatewayInterface;
  matPostgresGateway: MatPostgresGatewayInterface;
}

interface CloseTaskInterface {
  execute(taskId: string, userEmail: string): Promise<CloseTaskResponse>;
}

class CloseTaskUseCase implements CloseTaskInterface {
  crmGateway: CrmGatewayInterface;
  v1ApiGateway: V1MatAPIGatewayInterface;
  matPostgresGateway: MatPostgresGatewayInterface;

  //TODO: use args not options
  constructor(options: CloseTaskOptions) {
    this.crmGateway = options.crmGateway;
    this.v1ApiGateway = options.v1ApiGateway;
    this.matPostgresGateway = options.matPostgresGateway;
  }

  public async execute(
    taskId: string,
    userEmail: string
  ): Promise<CloseTaskResponse> {
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

    const updateObject: TenancyManagementInteraction = {
      interactionId: taskId,
      estateOfficerName: officer.body.username,
      serviceRequest: {
        description: 'Closed task',
        requestCallback: false,
        id: existingTask.body.incidentId,
      },
      status: 0,
      estateOfficerId: officer.body.usercrmid,
    };

    const result = await this.v1ApiGateway.patchTenancyManagementInteraction(
      updateObject
    );

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

export default CloseTaskUseCase;
