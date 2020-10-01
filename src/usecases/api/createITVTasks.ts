import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { MatPostgresGatewayInterface } from '../../gateways/matPostgresGateway';
import { V1MatAPIGatewayInterface } from '../../gateways/v1MatAPIGateway';
import { isError, Logger, Result } from '../../lib/utils';
import { tenancyToITVTask } from '../../mappings/tenancyToITVTask';

interface CreateITVTasksInterface {
  execute(taskCount: number): Promise<Result<boolean>>;
}

export default class CreateITVTasksUseCase implements CreateITVTasksInterface {
  matPostgresGateway: MatPostgresGatewayInterface;
  v1MatAPIGateway: V1MatAPIGatewayInterface;
  crmGateway: CrmGatewayInterface;
  logger: Logger;

  constructor(
    matPostgresGateway: MatPostgresGatewayInterface,
    v1MatAPIGateway: V1MatAPIGatewayInterface,
    crmGateway: CrmGatewayInterface,
    logger?: Logger
  ) {
    this.matPostgresGateway = matPostgresGateway;
    this.v1MatAPIGateway = v1MatAPIGateway;
    this.crmGateway = crmGateway;
    this.logger = logger || console;
  }

  public async execute(taskCount: number): Promise<Result<boolean>> {
    // Get the last date from postgres
    let lastDate = await this.matPostgresGateway.getLatestItvTaskSyncDate();
    if (isError(lastDate)) {
      return new Error('Error fetching the last date from Postgres');
    }
    if (lastDate === null) {
      lastDate = new Date(Date.parse('2019-11-03T11:00:17.9033333Z'));
    }

    let tenancies = await this.crmGateway.getIntroductoryTenanciesByDate(
      lastDate
    );
    if (isError(tenancies)) return new Error('Error fetching new tenancies');

    tenancies.sort(
      (a, b) => a.accountCreatedOn.getTime() - b.accountCreatedOn.getTime()
    );
    tenancies = tenancies.slice(0, taskCount);

    this.logger.log(`Creating ${tenancies.length} ITV tasks`);

    if (tenancies.length > 0) {
      this.logger.log(
        `Tenancies start: ${tenancies[0].accountCreatedOn} end: ${
          tenancies[tenancies.length - 1].accountCreatedOn
        }`
      );
    }
    this.logger.log('Starting insert at:', new Date());
    // Send to the api endpoint to create a tmi
    for (const tenancy of tenancies) {
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
    this.logger.log('Insert complete at:', new Date());
    return true;
  }
}
