import { TenancyManagementInteraction } from '../../interfaces/tenancyManagementInteraction';
import MockTenancy from '../../tests/helpers/generateTenancy';
import CreateITVTasksUseCase from './createITVTasks';
import { tenancyToITVTask } from '../../mappings/tenancyToITVTask';
import {
  mockCrmGateway,
  mockMatPostgresGateway,
  mockV1MatApiGateway,
} from '../../tests/helpers/mockGateways';
import { v1MatAPIGatewayInterface } from '../../gateways/v1MatAPIGateway';
import { MatPostgresGatewayInterface } from '../../gateways/matPostgresGateway';
import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { isError } from '../../lib/utils';
import { Tenancy } from '../../interfaces/tenancy';

describe('createITVTasks', () => {
  let crmGateway: CrmGatewayInterface;
  let matPostgresGateway: MatPostgresGatewayInterface;
  let v1MatAPIGateway: v1MatAPIGatewayInterface;
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
    crmGateway.getTenanciesByDate = jest.fn((date: Date) =>
      Promise.resolve(tenancies)
    );

    createITVTasks = new CreateITVTasksUseCase({
      v1MatAPIGateway: v1MatAPIGateway,
      crmGateway,
      matPostgresGateway,
      logger: dummyLogger,
    });
  });

  it('should set the default date to 2020-09-01T00:00:00Z', async () => {
    matPostgresGateway.getLatestItvTaskSyncDate = () => Promise.resolve(null);
    await createITVTasks.execute();
    expect(crmGateway.getTenanciesByDate).toHaveBeenCalledWith(
      new Date(Date.parse('2020-09-01T00:00:00Z'))
    );
  });
  it('should retrieve new tenancies and create ITV tasks for them and store the result in postgres', async () => {
    const result = await createITVTasks.execute();
    expect(isError(result)).toBe(false);
    expect(crmGateway.getTenanciesByDate).toHaveBeenCalledTimes(1);
    expect(
      v1MatAPIGateway.createTenancyManagementInteraction
    ).toHaveBeenCalledTimes(2);
    expect(
      v1MatAPIGateway.createTenancyManagementInteraction.mock.calls[0][0]
    ).toEqual(tenancyToITVTask(tenancies[0]));
    expect(
      v1MatAPIGateway.createTenancyManagementInteraction.mock.calls[1][0]
    ).toEqual(tenancyToITVTask(tenancies[1]));
    expect(matPostgresGateway.createItvTask.mock.calls[0][0]).toEqual({
      created: tenancies[0].accountCreatedOn,
      crm_id: 'fakeAccountId',
      tag_ref: tenancies[0].tagReference,
    });
    expect(matPostgresGateway.createItvTask.mock.calls[1][0]).toEqual({
      created: tenancies[1].accountCreatedOn,
      crm_id: 'fakeAccountId',
      tag_ref: tenancies[1].tagReference,
    });
    expect(dummyLogger.log).toHaveBeenCalledWith('Creating 2 ITV tasks');
  });

  it('should only create tasks for introductory tenancies', async () => {
    const tenancies = [
      MockTenancy(true),
      MockTenancy(false),
      MockTenancy(true),
    ];
    crmGateway.getTenanciesByDate = jest.fn((date: Date) =>
      Promise.resolve(tenancies)
    );

    const result = await createITVTasks.execute();
    expect(isError(result)).toBe(false);
    expect(
      v1MatAPIGateway.createTenancyManagementInteraction
    ).toHaveBeenCalledTimes(2);
    expect(
      v1MatAPIGateway.createTenancyManagementInteraction.mock.calls[0][0]
    ).toEqual(tenancyToITVTask(tenancies[0]));
    expect(
      v1MatAPIGateway.createTenancyManagementInteraction.mock.calls[1][0]
    ).toEqual(tenancyToITVTask(tenancies[2]));
  });
});
