import GetTask from './getTask';
import { crmGateway } from '../../gateways';
import { Task } from '../../interfaces/task';
import MockTask from '../../tests/helpers/generateTask';
import faker from 'faker';

describe('GetTask', () => {
  it('Returns a response when no errors are found', async () => {
    const mockResponse: Task = MockTask();

    crmGateway.getTask = () =>
      Promise.resolve({
        body: mockResponse,
        error: undefined,
      });

    const taskId = faker.lorem.word();

    const getTask = new GetTask(taskId);
    const response = await getTask.execute();

    expect(response).toEqual({ body: mockResponse, error: undefined });
  });

  it('Returns a 500 error when errors are found', async () => {
    crmGateway.getTask = () =>
      Promise.resolve({
        body: undefined,
        error: 'Anything',
      });

    const taskId = faker.lorem.word();

    const getTask = new GetTask(taskId);
    const response = await getTask.execute();

    expect(response).toEqual({ body: undefined, error: 500 });
  });

  it('Returns a 401 error when errors is NotAuthorised', async () => {
    crmGateway.getTask = () =>
      Promise.resolve({
        body: undefined,
        error: 'NotAuthorised',
      });

    const taskId = faker.lorem.word();

    const getTask = new GetTask(taskId);
    const response = await getTask.execute();

    expect(response).toEqual({ body: undefined, error: 401 });
  });
});
