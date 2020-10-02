import { crmToNotes } from '../../mappings/crmToNotes';
import MockCrmNoteResponse from '../../tests/helpers/generateCrmNoteResponse';
import faker from 'faker';
import GetNotesForTask, { GetNotesForTaskInterface } from './getNotesForTask';
import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { mockCrmGateway } from '../../tests/helpers/mockGateways';

describe('GetNotesForTask', () => {
  let crmGateway: CrmGatewayInterface;
  let getNotesForTask: GetNotesForTaskInterface;

  beforeEach(() => {
    crmGateway = mockCrmGateway();
    getNotesForTask = new GetNotesForTask(crmGateway);
  });

  it('Returns a response when no errors are found', async () => {
    const mockResponse = crmToNotes(MockCrmNoteResponse());

    crmGateway.getNotesForTask = () =>
      Promise.resolve({
        body: mockResponse,
      });

    const taskId = faker.lorem.word();
    const response = await getNotesForTask.execute(taskId);

    expect(response).toEqual({ body: mockResponse, error: undefined });
  });

  it('Returns a 500 error when errors are found', async () => {
    crmGateway.getNotesForTask = () =>
      Promise.resolve({
        body: undefined,
        error: 'Anything',
      });

    const taskId = faker.lorem.word();

    const response = await getNotesForTask.execute(taskId);

    expect(response).toEqual({ error: 500 });
  });

  it('Returns a 401 error when errors is NotAuthorised', async () => {
    crmGateway.getNotesForTask = () =>
      Promise.resolve({
        body: undefined,
        error: 'NotAuthorised',
      });

    const taskId = faker.lorem.word();

    const response = await getNotesForTask.execute(taskId);

    expect(response).toEqual({ error: 401 });
  });
});
