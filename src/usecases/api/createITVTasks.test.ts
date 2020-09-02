import v1MatAPIGateway from '../../gateways/v1MatAPIGateway';
import MockTenancy from '../../tests/helpers/generateTenancy';
import CreateITVTasks from './createITVTasks';

jest.mock('../../gateways/v1MatAPIGateway');

describe('createITVTasks', () => {
  beforeEach(() => {
    v1MatAPIGateway.mockClear();
  });

  it('should retrieve new tenancies and create ITV tasks for them', async () => {
    const getNewTenancies = jest.fn(() => ({
      body: [MockTenancy(true), MockTenancy(true)],
      error: undefined,
    }));

    const createTenancyManagementInteraction = jest.fn((tmi) => ({
      body: [],
      error: undefined,
    }));

    v1MatAPIGateway.mockImplementation(() => {
      return {
        getNewTenancies,
        createTenancyManagementInteraction,
      };
    });

    const usecase = new CreateITVTasks();
    usecase.execute();

    expect(getNewTenancies).toHaveBeenCalledTimes(1);
    console.log(createTenancyManagementInteraction.mock.instances);
    expect(createTenancyManagementInteraction).toHaveBeenCalledTimes(2);
  });

  // it('should only create tasks for introductory tenancies', async () => {});
});
