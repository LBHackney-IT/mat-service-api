import { Task } from '../../interfaces/task';
import MockTask from '../../tests/helpers/generateTask';
import { CrmGatewayInterface } from '../../gateways/crmGateway';
import GetTasksForTagRef, { GetTasksInterface } from './getTasksForTagRef';
import { mockCrmGateway } from '../../tests/helpers/mockGateways';

describe('GetTasks', () => {
  let crmGateway: CrmGatewayInterface;
  let getTasksForTagRef: GetTasksInterface;

  beforeEach(() => {
    crmGateway = mockCrmGateway();
    getTasksForTagRef = new GetTasksForTagRef(crmGateway);
  });

  it('Returns a list of tasks when no errors are found', async () => {
    const mockTasks: Task[] = [MockTask(), MockTask()];

    crmGateway.getTasksForTagRef = () =>
      Promise.resolve({
        body: mockTasks,
        error: undefined,
      });

    const tagRef = '000111/1';
    const getTasks = new GetTasksForTagRef(crmGateway);
    const response = await getTasks.execute(tagRef);

    expect(response.body).toEqual(mockTasks);
  });

  it('Returns an empty list when tasks are not found', async () => {
    const mockTasks: Task[] = [];

    crmGateway.getTasksForTagRef = () =>
      Promise.resolve({
        body: mockTasks,
        error: undefined,
      });

    const tagRef = '000111/1';
    const getTasks = new GetTasksForTagRef(crmGateway);
    const response = await getTasks.execute(tagRef);

    expect(response.body).toEqual(mockTasks);
  });

  it('Returns a 500 error when errors are found', async () => {
    crmGateway.getTasksForTagRef = () =>
      Promise.resolve({
        body: undefined,
        error: '500',
      });

    const tagRef = '000111/1';
    const getTasks = new GetTasksForTagRef(crmGateway);
    const response = await getTasks.execute(tagRef);

    expect(response.error).toEqual(500);
  });

  it('Returns a 401 error when errors is NotAuthorised', async () => {
    crmGateway.getTasksForTagRef = () =>
      Promise.resolve({
        body: undefined,
        error: 'NotAuthorised',
      });

    const tagRef = '000111/1';
    const getTasks = new GetTasksForTagRef(crmGateway);
    const response = await getTasks.execute(tagRef);

    expect(response.error).toEqual(401);
  });
});
