import { Task } from '../../interfaces/task';
import MockTask from '../../tests/helpers/generateTask';
import GetTasksForAPatch from './getTasksForAPatch';
import faker from 'faker';

jest.mock('../../gateways/crmGateway');

const dummyMock = jest.fn(async () => ({}));

describe('GetTasks', () => {
  it('Returns a list of tasks when no errors are found', async () => {
    const mockTasks: Task[] = [MockTask(), MockTask()];

    const getTasksForAPatch = jest.fn((async) => ({
      body: mockTasks,
      error: undefined,
    }));

    const crmGateway = {
      getPatchByOfficerId: <jest.Mock>dummyMock,
      getTasksForAPatch: <jest.Mock>getTasksForAPatch,
      getTask: <jest.Mock>dummyMock,
      getUser: <jest.Mock>dummyMock,
      createUser: <jest.Mock>dummyMock,
    };

    const patchId = faker.random.uuid();
    const officerId = faker.random.uuid();
    const isManager = false;

    const getTasks = new GetTasksForAPatch({
      crmGateway,
      patchId,
      officerId,
      isManager,
    });
    const response = await getTasks.execute();
    expect(getTasksForAPatch).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual(mockTasks);
  });

  it('Returns a empty list when tasks are not found', async () => {
    const mockTasks: Task[] = [];

    const getTasksForAPatch = jest.fn((async) => ({
      body: mockTasks,
      error: undefined,
    }));

    const crmGateway = {
      getPatchByOfficerId: <jest.Mock>dummyMock,
      getTasksForAPatch: <jest.Mock>getTasksForAPatch,
      getTask: <jest.Mock>dummyMock,
      getUser: <jest.Mock>dummyMock,
      createUser: <jest.Mock>dummyMock,
    };

    const patchId = faker.random.uuid();
    const officerId = faker.random.uuid();
    const isManager = false;

    const getTasks = new GetTasksForAPatch({
      crmGateway,
      patchId,
      officerId,
      isManager,
    });
    const response = await getTasks.execute();
    expect(getTasksForAPatch).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual(mockTasks);
  });

  it('Returns a 500 error when errors are found', async () => {
    const getTasksForAPatch = jest.fn((async) => ({
      body: undefined,
      error: 500,
    }));

    const crmGateway = {
      getPatchByOfficerId: <jest.Mock>dummyMock,
      getTasksForAPatch: <jest.Mock>getTasksForAPatch,
      getTask: <jest.Mock>dummyMock,
      getUser: <jest.Mock>dummyMock,
      createUser: <jest.Mock>dummyMock,
    };

    const patchId = faker.random.uuid();
    const officerId = faker.random.uuid();
    const isManager = false;

    const getTasks = new GetTasksForAPatch({
      crmGateway,
      patchId,
      officerId,
      isManager,
    });
    const response = await getTasks.execute();
    expect(getTasksForAPatch).toHaveBeenCalledTimes(1);
    expect(response.error).toEqual(500);
  });

  it('Returns a 401 error when errors is NotAuthorised', async () => {
    const getTasksForAPatch = jest.fn((async) => ({
      body: undefined,
      error: 'NotAuthorised',
    }));

    const crmGateway = {
      getPatchByOfficerId: <jest.Mock>dummyMock,
      getTasksForAPatch: <jest.Mock>getTasksForAPatch,
      getTask: <jest.Mock>dummyMock,
      getUser: <jest.Mock>dummyMock,
      createUser: <jest.Mock>dummyMock,
    };

    const patchId = faker.random.uuid();
    const officerId = faker.random.uuid();
    const isManager = false;

    const getTasks = new GetTasksForAPatch({
      crmGateway,
      patchId,
      officerId,
      isManager,
    });
    const response = await getTasks.execute();
    expect(getTasksForAPatch).toHaveBeenCalledTimes(1);
    expect(response.error).toEqual(401);
  });
});
