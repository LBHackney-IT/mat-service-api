import { Task } from '../../interfaces/task';
import MockTask from '../../tests/helpers/generateTask';
import GetTasksForTagRef from './getTasksForTagRef';

jest.mock('../../gateways/crmGateway');

describe('GetTasks', () => {
  it('Returns a list of tasks when no errors are found', async () => {
    const mockTasks: Task[] = [MockTask(), MockTask()];

    const getTasksForTagRef = jest.fn((async) => ({
      body: mockTasks,
      error: undefined,
    }));

    const crmGateway = {
      getTasksForTagRef: <jest.Mock>getTasksForTagRef,
    };

    const tagRef = '000111/1';
    const getTasks = new GetTasksForTagRef({
      crmGateway,
    });
    const response = await getTasks.execute(tagRef);

    expect(getTasksForTagRef).toHaveBeenCalledTimes(1);
    expect(getTasksForTagRef).toHaveBeenCalledWith(tagRef);
    expect(response.body).toEqual(mockTasks);
  });

  it('Returns an empty list when tasks are not found', async () => {
    const mockTasks: Task[] = [];

    const getTasksForTagRef = jest.fn((async) => ({
      body: mockTasks,
      error: undefined,
    }));

    const crmGateway = {
      getTasksForTagRef: <jest.Mock>getTasksForTagRef,
    };

    const tagRef = '000111/1';
    const getTasks = new GetTasksForTagRef({
      crmGateway,
    });
    const response = await getTasks.execute(tagRef);

    expect(getTasksForTagRef).toHaveBeenCalledTimes(1);
    expect(getTasksForTagRef).toHaveBeenCalledWith(tagRef);
    expect(response.body).toEqual(mockTasks);
  });

  it('Returns a 500 error when errors are found', async () => {
    const getTasksForTagRef = jest.fn((async) => ({
      body: undefined,
      error: 500,
    }));

    const crmGateway = {
      getTasksForTagRef: <jest.Mock>getTasksForTagRef,
    };

    const tagRef = '000111/1';
    const getTasks = new GetTasksForTagRef({
      crmGateway,
    });
    const response = await getTasks.execute(tagRef);

    expect(getTasksForTagRef).toHaveBeenCalledTimes(1);
    expect(getTasksForTagRef).toHaveBeenCalledWith(tagRef);
    expect(response.error).toEqual(500);
  });

  it('Returns a 401 error when errors is NotAuthorised', async () => {
    const getTasksForTagRef = jest.fn((async) => ({
      body: undefined,
      error: 'NotAuthorised',
    }));

    const crmGateway = {
      getTasksForTagRef: <jest.Mock>getTasksForTagRef,
    };

    const tagRef = '000111/1';
    const getTasks = new GetTasksForTagRef({
      crmGateway,
    });
    const response = await getTasks.execute(tagRef);

    expect(getTasksForTagRef).toHaveBeenCalledTimes(1);
    expect(getTasksForTagRef).toHaveBeenCalledWith(tagRef);
    expect(response.error).toEqual(401);
  });
});
