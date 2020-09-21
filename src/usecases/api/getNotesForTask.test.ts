import CrmGateway from '../../gateways/crmGateway';
import { crmToNotes } from '../../mappings/crmToNotes';
import MockCrmNoteResponse from '../../tests/helpers/generateCrmNoteResponse';
import faker from 'faker';
import GetNotesForTask from './getNotesForTask';
jest.mock('../../gateways/crmGateway');

describe('GetNotesForTask', () => {
  beforeEach(() => {
    CrmGateway.mockClear();
  });

  it('Returns a response when no errors are found', async () => {
    const mockResponse = crmToNotes(MockCrmNoteResponse());

    CrmGateway.mockImplementationOnce(() => {
      return {
        getNotesForTask: () => ({
          body: mockResponse,
          error: undefined,
        }),
      };
    });

    const taskId = faker.lorem.word();
    const getNotesForTask = new GetNotesForTask(taskId);
    const response = await getNotesForTask.execute();

    expect(CrmGateway).toHaveBeenCalledTimes(1);
    expect(response).toEqual({ body: mockResponse, error: undefined });
  });

  it('Returns a 500 error when errors are found', async () => {
    CrmGateway.mockImplementationOnce(() => {
      return {
        getNotesForTask: () => ({
          body: undefined,
          error: 'Anything',
        }),
      };
    });

    const taskId = faker.lorem.word();

    const getNotesForTask = new GetNotesForTask(taskId);
    const response = await getNotesForTask.execute();

    expect(CrmGateway).toHaveBeenCalledTimes(1);
    expect(response).toEqual({ body: undefined, error: 500 });
  });

  it('Returns a 401 error when errors is NotAuthorised', async () => {
    CrmGateway.mockImplementationOnce(() => {
      return {
        getNotesForTask: () => ({
          body: undefined,
          error: 'NotAuthorised',
        }),
      };
    });

    const taskId = faker.lorem.word();

    const getNotesForTask = new GetNotesForTask(taskId);
    const response = await getNotesForTask.execute();

    expect(CrmGateway).toHaveBeenCalledTimes(1);
    expect(response).toEqual({ body: undefined, error: 401 });
  });
});
