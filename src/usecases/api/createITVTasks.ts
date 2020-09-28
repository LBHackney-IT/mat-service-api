import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { MatPostgresGatewayInterface } from '../../gateways/matPostgresGateway';
import { v1MatAPIGatewayInterface } from '../../gateways/v1MatAPIGateway';
import { isError, Result } from '../../lib/utils';
import { tenancyToITVTask } from '../../mappings/tenancyToITVTask';

interface CreateITVTasksOptions {
  matPostgresGateway: MatPostgresGatewayInterface;
  v1MatAPIGateway: v1MatAPIGatewayInterface;
  crmGateway: CrmGatewayInterface;
  logger?: Console;
}

interface CreateITVTasksInterface {
  execute(): Promise<Result<boolean>>;
}

export default class CreateITVTasksUseCase implements CreateITVTasksInterface {
  matPostgresGateway: MatPostgresGatewayInterface;
  v1MatAPIGateway: v1MatAPIGatewayInterface;
  crmGateway: CrmGatewayInterface;
  logger: Console;

  constructor(options: CreateITVTasksOptions) {
    this.matPostgresGateway = options.matPostgresGateway;
    this.v1MatAPIGateway = options.v1MatAPIGateway;
    this.crmGateway = options.crmGateway;
    this.logger = options.logger || console;
  }

  public async execute(): Promise<Result<boolean>> {
    // Get the last date from postgres
    let lastDate = await this.matPostgresGateway.getLatestItvTaskSyncDate();
    if (isError(lastDate)) {
      return new Error('Error fetching the last date from Postgres');
    }
    if (lastDate === null) {
      lastDate = new Date(Date.parse('2020-09-01T00:00:00Z'));
    }

    const tenancies = await this.crmGateway.getTenanciesByDate(lastDate);
    if (isError(tenancies)) return new Error('Error fetching new tenancies');

    // Filter out all non-introductory tenancies
    const introductoryTenancies = tenancies.filter((tenancy) => {
      return tenancy.housingTenure === 'INT';
    });

    this.logger.log(`Creating ${introductoryTenancies.length} ITV tasks`);

    // Send to the api endpoint to create a tmi
    for (const tenancy of introductoryTenancies) {
      // Create the new TMI
      const tmi = tenancyToITVTask(tenancy);
      const createdTask = await this.v1MatAPIGateway.createTenancyManagementInteraction(
        tmi
      );

      if (!createdTask.body || !createdTask.body.interactionId) {
        return new Error(
          `Error creating ITV Task. Tenancy: ${tenancy.tagReference}`
        );
      }

      // Save to the database
      const dbResult = await this.matPostgresGateway.createItvTask({
        tag_ref: tenancy.tagReference,
        crm_id: createdTask.body.interactionId,
        created: tenancy.accountCreatedOn,
      });

      if (isError(dbResult)) {
        return new Error(`Error writing to db: ${dbResult.message}`);
      }
    }
    return true;
  }
}
