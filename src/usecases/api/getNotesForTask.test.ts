import { crmToNotes } from '../../mappings/crmToNotes';
import MockCrmNoteResponse from '../../tests/helpers/generateCrmNoteResponse';
import faker from 'faker';
import GetNotesForTask, { GetNotesForTaskInterface } from './getNotesForTask';
import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { mockCrmGateway } from '../../tests/helpers/mockGateways';
import { isError, isSuccess } from '../../lib/utils';

describe('GetNotesForTask', () => {
  let crmGateway: CrmGatewayInterface;
  let getNotesForTask: GetNotesForTaskInterface;

  beforeEach(() => {
    crmGateway = mockCrmGateway();
    getNotesForTask = new GetNotesForTask(crmGateway);
  });

  it('Returns a response when no errors are found', async () => {
    const mockResponse = crmToNotes(MockCrmNoteResponse());

    crmGateway.getNotesForTask = () => Promise.resolve(mockResponse);

    const taskId = faker.lorem.word();
    const response = await getNotesForTask.execute(taskId);

    expect(isSuccess(response)).toEqual(true);
    expect(response).toEqual(mockResponse);
  });

  it('Returns the error when errors are found', async () => {
    crmGateway.getNotesForTask = () => Promise.resolve(new Error('Anything'));

    const taskId = faker.lorem.word();

    const response = await getNotesForTask.execute(taskId);

    expect(isError(response)).toEqual(true);
    expect(response.message).toEqual('Anything');
  });
});
