import CrmGateway, { CrmGatewayInterface } from '../../gateways/crmGateway';
import MatPostgresGateway, {
  MatPostgresGatewayInterface,
} from '../../gateways/matPostgresGateway';
import { v1MatAPIGatewayInterface } from '../../gateways/v1MatAPIGateway';
import { TenancyManagementInteraction } from '../../interfaces/tenancyManagementInteraction';
import { tenancyToITVTask } from '../../mappings/tenancyToITVTask';

interface CreateITVTasksResponse {
  body?: boolean;
  error?: string;
}

interface CreateITVTasksOptions {
  matPostgresGateway: MatPostgresGatewayInterface;
  v1MatAPIGateway: v1MatAPIGatewayInterface;
  crmGateway: CrmGatewayInterface;
}

interface CreateITVTasksInterface {
  execute(): Promise<CreateITVTasksResponse>;
}

export default class CreateITVTasksUseCase implements CreateITVTasksInterface {
  matPostgresGateway: MatPostgresGatewayInterface;
  v1MatAPIGateway: v1MatAPIGatewayInterface;
  crmGateway: CrmGatewayInterface;

  constructor(options: CreateITVTasksOptions) {
    this.matPostgresGateway = options.matPostgresGateway;
    this.v1MatAPIGateway = options.v1MatAPIGateway;
    this.crmGateway = options.crmGateway;
  }

  public async execute(): Promise<CreateITVTasksResponse> {
    // Get the last date from postgres
    const lastDateResult = await this.matPostgresGateway.getLatestItvTaskSyncDate();
    const lastDate =
      lastDateResult.body || new Date(Date.parse('2020-09-01T00:00:00Z'));

    const tenancies = await this.crmGateway.getTenanciesByDate(lastDate);
    if (tenancies.error || !tenancies.body) {
      return { error: 'Error fetching new tenancies' };
    }
    // Filter out all non-introductory tenancies
    let introductoryTenancies = tenancies.body.filter((tenancy) => {
      return tenancy.housingTenure === 'INT';
    });

    console.log(`Creating ${introductoryTenancies.length} ITV tasks`);

    // Send to the api endpoint to create a tmi
    for (const tenancy of introductoryTenancies) {
      // Create the new TMI
      const tmi = tenancyToITVTask(tenancy);
      const createdTask = await this.v1MatAPIGateway.createTenancyManagementInteraction(
        tmi
      );

      if (!createdTask.body || !createdTask.body.interactionId) {
        return {
          error: `Error creating ITV Task. Tenancy: ${tenancy.tagReference}`,
        };
      }

      // Save to the database
      const dbResult = await this.matPostgresGateway.createItvTask({
        tag_ref: tenancy.tagReference,
        crm_id: createdTask.body.interactionId,
        created: tenancy.accountCreatedOn,
      });

      if (dbResult.error) {
        return {
          error: `Error writing to db: ${dbResult.error}`,
        };
      }
    }
    return {
      body: true,
    };
  }
}
