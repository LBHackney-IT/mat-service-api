import { TenancyManagementInteraction} from '../../interfaces/tenancyManagementInteraction';
import MockTenancy from '../../tests/helpers/generateTenancy';
import CreateITVTasksUseCase from './createITVTasks';
import {tenancyToITVTask} from '../../mappings/tenancyToITVTask';

describe('createITVTasks', () => {
  it('should retrieve new tenancies and create ITV tasks for them', async () => {
    const tenancies = [MockTenancy(true), MockTenancy(true)];
    const getNewTenancies = jest.fn(async () => ({
      result: tenancies
    }));

    const createTenancyManagementInteraction = jest.fn(async (tmi: TenancyManagementInteraction) => ({
      body: [],
      error: undefined,
    }));

    const v1MatAPIGateway = {
      getNewTenancies: <jest.Mock>(getNewTenancies),
      createTenancyManagementInteraction: <jest.Mock>(createTenancyManagementInteraction),
    };

    const createITVTasks = new CreateITVTasksUseCase({
      gateway: v1MatAPIGateway
    })

    await createITVTasks.execute();
    expect(getNewTenancies).toHaveBeenCalledTimes(1);
    expect(createTenancyManagementInteraction).toHaveBeenCalledTimes(2);
    expect(createTenancyManagementInteraction.mock.calls[0][0]).toEqual(tenancyToITVTask(tenancies[0]))
    expect(createTenancyManagementInteraction.mock.calls[1][0]).toEqual(tenancyToITVTask(tenancies[1]))
  });

  it('should only create tasks for introductory tenancies', async () => {
    const tenancies = [MockTenancy(true), MockTenancy(false), MockTenancy(true)];
    const getNewTenancies = jest.fn(async () => ({
      result: tenancies
    }));

    const createTenancyManagementInteraction = jest.fn(async (tmi: TenancyManagementInteraction) => ({
      body: [],
      error: undefined,
    }));

    const v1MatAPIGateway = {
      getNewTenancies: <jest.Mock>(getNewTenancies),
      createTenancyManagementInteraction: <jest.Mock>(createTenancyManagementInteraction),
    };

    const createITVTasks = new CreateITVTasksUseCase({
      gateway: v1MatAPIGateway
    })

    await createITVTasks.execute();

    expect(getNewTenancies).toHaveBeenCalledTimes(1);
    expect(createTenancyManagementInteraction).toHaveBeenCalledTimes(2);
    expect(createTenancyManagementInteraction.mock.calls[0][0]).toEqual(tenancyToITVTask(tenancies[0]))
    expect(createTenancyManagementInteraction.mock.calls[1][0]).toEqual(tenancyToITVTask(tenancies[2]))
  });
});
