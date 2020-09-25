import { Task } from '../../interfaces/task';
import MockTask from '../../tests/helpers/generateTask';
import GetTasksForAPatch from './getTasksForAPatch';
import faker from 'faker';

jest.mock('../../gateways/crmGateway');

const dummyMock = jest.fn(async () => ({}));

describe('GetTasks', () => {
  let patchId: string;
  let officerId: string;
  let areaManagerId: string;
  let isManager: boolean;
  let getTasksForAPatch: any;
  let mockTasks: Task[];
  let crmGateway: object;
  let getTasks: GetTasksForAPatch;

  beforeEach(() => {
    mockTasks = [MockTask(), MockTask()];
    patchId = faker.random.uuid();
    officerId = faker.random.uuid();
    areaManagerId = faker.random.uuid();
    isManager = false;
    getTasksForAPatch = jest.fn((async) => ({
      body: mockTasks,
      error: undefined,
    }));

    crmGateway = {
      getPatchByOfficerId: <jest.Mock>dummyMock,
      getTasksForAPatch: <jest.Mock>getTasksForAPatch,
      getTask: <jest.Mock>dummyMock,
      getUser: <jest.Mock>dummyMock,
      createUser: <jest.Mock>dummyMock,
    };
    getTasks = new GetTasksForAPatch({
      crmGateway,
    });
  });

  it('Returns a list of tasks when no errors are found', async () => {
    const response = await getTasks.execute(
      officerId,
      isManager,
      areaManagerId,
      patchId
    );
    expect(getTasksForAPatch).toHaveBeenCalledTimes(1);
    expect(getTasksForAPatch).toHaveBeenCalledWith(
      officerId,
      isManager,
      areaManagerId,
      patchId
    );
    expect(response.body).toEqual(mockTasks);
  });

  it('Returns a empty list when tasks are not found', async () => {
    mockTasks = [];

    const response = await getTasks.execute(
      officerId,
      isManager,
      areaManagerId,
      patchId
    );
    expect(getTasksForAPatch).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual(mockTasks);
  });

  it('Returns the error when errors are found', async () => {
    crmGateway.getTasksForAPatch = jest.fn((async) => ({
      body: undefined,
      error: 'NotAuthorised',
    }));

    const response = await getTasks.execute(
      officerId,
      isManager,
      areaManagerId,
      patchId
    );
    expect(crmGateway.getTasksForAPatch).toHaveBeenCalledTimes(1);
    expect(response.error).toEqual('NotAuthorised');
  });
});
