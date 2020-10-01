import { crmGateway } from '../../gateways';
import { crmToNotes } from '../../mappings/crmToNotes';
import MockCrmNoteResponse from '../../tests/helpers/generateCrmNoteResponse';
import faker from 'faker';
import getNotesForTask from './getNotesForTask';

describe('GetNotesForTask', () => {
  it('Returns a response when no errors are found', async () => {
    const mockResponse = crmToNotes(MockCrmNoteResponse());

    crmGateway.getNotesForTask = () =>
      Promise.resolve({
        body: mockResponse,
        error: undefined,
      });

    const taskId = faker.lorem.word();
    const response = await getNotesForTask(taskId);

    expect(response).toEqual({ body: mockResponse, error: undefined });
  });

  it('Returns a 500 error when errors are found', async () => {
    crmGateway.getNotesForTask = () =>
      Promise.resolve({
        body: undefined,
        error: 'Anything',
      });

    const taskId = faker.lorem.word();

    const response = await getNotesForTask(taskId);

    expect(response).toEqual({ body: undefined, error: 500 });
  });

  it('Returns a 401 error when errors is NotAuthorised', async () => {
    crmGateway.getNotesForTask = () =>
      Promise.resolve({
        body: undefined,
        error: 'NotAuthorised',
      });

    const taskId = faker.lorem.word();

    const response = await getNotesForTask(taskId);

    expect(response).toEqual({ body: undefined, error: 401 });
  });
});
