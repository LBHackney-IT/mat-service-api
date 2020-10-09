import GetTask, { GetTaskInterface } from './getTask';
import { Task } from '../../interfaces/task';
import MockTask from '../../tests/helpers/generateTask';
import faker from 'faker';
import { mockCrmGateway } from '../../tests/helpers/mockGateways';
import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { isError, isSuccess } from '../../lib/utils';

describe('GetTask', () => {
  let crmGateway: CrmGatewayInterface;
  let getTask: GetTaskInterface;

  const taskId = faker.lorem.word();

  beforeEach(() => {
    crmGateway = mockCrmGateway();
    getTask = new GetTask(crmGateway);
  });

  it('Returns a response when no errors are found', async () => {
    const mockResponse = MockTask();

    crmGateway.getTask = () => Promise.resolve(mockResponse);

    const response = await getTask.execute(taskId);
    expect(isSuccess(response)).toEqual(true);
    expect(response).toEqual(mockResponse);
  });

  it('Returns the error when errors are found', async () => {
    crmGateway.getTask = () => Promise.resolve(new Error('Anything'));

    const response = await getTask.execute(taskId);
    expect(isError(response)).toEqual(true);
    expect(response.message).toEqual('Anything');
  });
});
