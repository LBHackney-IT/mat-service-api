import { Task } from '../../interfaces/task';
import MockTask from '../../tests/helpers/generateTask';
import GetTasksForAPatch, {
  GetTasksForAPatchInterface,
} from './getTasksForAPatch';
import faker from 'faker';
import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { mockCrmGateway } from '../../tests/helpers/mockGateways';

jest.mock('../../gateways/crmGateway');

const dummyMock = jest.fn(async () => ({}));

describe('GetTasks', () => {
  let patchId: string;
  let areaManagerId: string;
  let isManager: boolean;
  let getTasksForAPatch: any;
  let mockTasks: Task[];
  let crmGateway: CrmGatewayInterface;
  let getTasks: GetTasksForAPatchInterface;

  beforeEach(() => {
    mockTasks = [MockTask(), MockTask()];
    patchId = faker.random.uuid();
    areaManagerId = faker.random.uuid();
    isManager = false;
    getTasksForAPatch = jest.fn((async) => ({
      body: mockTasks,
      error: undefined,
    }));

    crmGateway = mockCrmGateway();
    getTasks = new GetTasksForAPatch(crmGateway);
  });

  it('Returns a list of tasks when no errors are found', async () => {
    crmGateway.getTasksForAPatch = () =>
      Promise.resolve({
        body: mockTasks,
        error: undefined,
      });

    const response = await getTasks.execute(isManager, areaManagerId, patchId);
    expect(response.body).toEqual(mockTasks);
  });

  it('Returns a empty list when tasks are not found', async () => {
    mockTasks = [];

    crmGateway.getTasksForAPatch = () =>
      Promise.resolve({
        body: [],
        error: undefined,
      });

    const response = await getTasks.execute(isManager, areaManagerId, patchId);
    expect(response.body).toEqual(mockTasks);
  });

  it('Returns the error when errors are found', async () => {
    crmGateway.getTasksForAPatch = () =>
      Promise.resolve({
        body: undefined,
        error: 'NotAuthorised',
      });

    const response = await getTasks.execute(isManager, areaManagerId, patchId);
    expect(response.error).toEqual('NotAuthorised');
  });
});
