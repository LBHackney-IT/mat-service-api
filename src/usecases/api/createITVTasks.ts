import { v1MatAPIGatewayInterface } from '../../gateways/v1MatAPIGateway';
import { TenancyManagementInteraction } from '../../interfaces/tenancyManagementInteraction';
import { tenancyToITVTask } from '../../mappings/tenancyToITVTask';

interface CreateITVTasksResponse {
  body: any | undefined;
  error: number | undefined;
}

interface CreateITVTasksOptions {
  gateway: v1MatAPIGatewayInterface;
}

interface CreateITVTasksInterface {
  execute(): Promise<CreateITVTasksResponse>;
}

class CreateITVTasksUseCase implements CreateITVTasksInterface {
  v1MatAPIGateway: v1MatAPIGatewayInterface;

  constructor(options: CreateITVTasksOptions) {
    this.v1MatAPIGateway = options.gateway;
  }

  public async execute(): Promise<CreateITVTasksResponse> {
    const tenancies = await this.v1MatAPIGateway.getNewTenancies();

    // Check if no error
    if (tenancies.error) {
      switch (tenancies.error) {
        case 'NotAuthorised':
          return {
            body: undefined,
            error: 401,
          };
        default:
          return {
            body: undefined,
            error: 500,
          };
      }
    }
    if (!tenancies.result) {
      return {
        body: undefined,
        error: 500,
      };
    }

    // Filter out all non-introductory tenancies
    let introductoryTenancies = tenancies.result.filter((tenancy) => {
      return tenancy.housingTenure === 'INT';
    });

    // Loop over the remaining introductory tenancies, convert to tmi objects
    const tmiObjects: TenancyManagementInteraction[] = introductoryTenancies.map(
      (tenancy) => tenancyToITVTask(tenancy)
    );

    // Send to the api endpoint to create a tmi
    for (const tmi of tmiObjects) {
      await this.v1MatAPIGateway.createTenancyManagementInteraction(tmi);
    }

    return {
      body: true,
      error: undefined,
    };
  }
}

export default CreateITVTasksUseCase;
