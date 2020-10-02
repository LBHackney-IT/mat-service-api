import { TenancyManagementInteraction } from '../../interfaces/tenancyManagementInteraction';
import MockTenancy from '../../tests/helpers/generateTenancy';
import CreateITVTasksUseCase from './createITVTasks';
import { tenancyToITVTask } from '../../mappings/tenancyToITVTask';
import {
  mockCrmGateway,
  mockMatPostgresGateway,
  mockV1MatApiGateway,
} from '../../tests/helpers/mockGateways';
import { V1MatAPIGatewayInterface } from '../../gateways/v1MatAPIGateway';
import { MatPostgresGatewayInterface } from '../../gateways/matPostgresGateway';
import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { isError } from '../../lib/utils';
import { Tenancy } from '../../interfaces/tenancy';

describe('createITVTasks', () => {
  let crmGateway: CrmGatewayInterface;
  let matPostgresGateway: MatPostgresGatewayInterface;
  let v1MatAPIGateway: V1MatAPIGatewayInterface;
  let createITVTasks: CreateITVTasksUseCase;
  let tenancies: Tenancy[];
  const dummyLogger = { log: jest.fn() };

  beforeEach(() => {
    crmGateway = mockCrmGateway();

    matPostgresGateway = mockMatPostgresGateway();
    matPostgresGateway.getLatestItvTaskSyncDate = () =>
      Promise.resolve(new Date(Date.parse('2020-02-03T01:02:03Z')));

    v1MatAPIGateway = mockV1MatApiGateway();
    v1MatAPIGateway.createTenancyManagementInteraction = jest.fn(() =>
      Promise.resolve({ body: { interactionId: 'fakeAccountId' } })
    );

    tenancies = [MockTenancy(true), MockTenancy(true)];
    crmGateway.getIntroductoryTenanciesByDate = jest.fn((date: Date) =>
      Promise.resolve(tenancies)
    );

    createITVTasks = new CreateITVTasksUseCase(
      matPostgresGateway,
      v1MatAPIGateway,
      crmGateway,
      dummyLogger
    );
  });

  it('should set the default date to 2020-09-01T00:00:00Z', async () => {
    matPostgresGateway.getLatestItvTaskSyncDate = () => Promise.resolve(null);
    await createITVTasks.execute(1);
    expect(crmGateway.getIntroductoryTenanciesByDate).toHaveBeenCalledWith(
      new Date(Date.parse('2019-11-03T11:00:17.9033333Z'))
    );
  });

  it('should retrieve new tenancies and create ITV tasks for them and store the result in postgres', async () => {
    const result = await createITVTasks.execute(5);
    const orderedTenancies = tenancies.sort(
      (a, b) => a.accountCreatedOn.getTime() - b.accountCreatedOn.getTime()
    );
    expect(isError(result)).toBe(false);
    expect(crmGateway.getIntroductoryTenanciesByDate).toHaveBeenCalledTimes(1);
    expect(
      v1MatAPIGateway.createTenancyManagementInteraction
    ).toHaveBeenCalledTimes(2);
    expect(
      v1MatAPIGateway.createTenancyManagementInteraction.mock.calls[0][0]
    ).toEqual(tenancyToITVTask(orderedTenancies[0]));
    expect(
      v1MatAPIGateway.createTenancyManagementInteraction.mock.calls[1][0]
    ).toEqual(tenancyToITVTask(orderedTenancies[1]));
    expect(matPostgresGateway.createItvTask.mock.calls[0][0]).toEqual({
      created: orderedTenancies[0].accountCreatedOn,
      crm_id: 'fakeAccountId',
      tag_ref: orderedTenancies[0].tagReference,
    });
    expect(matPostgresGateway.createItvTask.mock.calls[1][0]).toEqual({
      created: orderedTenancies[1].accountCreatedOn,
      crm_id: 'fakeAccountId',
      tag_ref: orderedTenancies[1].tagReference,
    });
    expect(dummyLogger.log).toHaveBeenCalledWith('Creating 2 ITV tasks');
  });

  it('should limit the number of tasks to the number passed in', async () => {
    const result = await createITVTasks.execute(1);
    expect(isError(result)).toBe(false);
    expect(
      v1MatAPIGateway.createTenancyManagementInteraction
    ).toHaveBeenCalledTimes(1);

    expect(dummyLogger.log).toHaveBeenCalledWith('Creating 1 ITV tasks');
  });
});
