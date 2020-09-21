import CrmGateway from './crmGateway';
import axios from 'axios';
import faker from 'faker';
import MockCrmTaskResponse from '../tests/helpers/generateCrmTaskResponse';
import MockCrmUserResponse from '../tests/helpers/generateCrmUserResponse';
import { crmResponseToTasks } from '../mappings/crmToTask';
import MockCrmNoteResponse from '../tests/helpers/generateCrmNoteResponse';
import { crmToNotes } from '../mappings/crmToNotes';
jest.mock('axios');

describe('CrmGateway', () => {
  beforeEach(() => {
    axios.mockClear();
  });

  describe('Get Tasks by patch id', () => {
    it('successfully fetches data from an API', async () => {
      const data = MockCrmTaskResponse();
      const patchId = '9cd3823d-8653-e811-8126-70106faaf8c1';

      axios.get.mockResolvedValue({ data: data });

      const crmGateway = new CrmGateway();
      const response = await crmGateway.getTasksForAPatch(patchId);

      const tasks = crmResponseToTasks(data);

      expect(response).toStrictEqual({ body: tasks, error: undefined });
    });

    it('returns an human readable error when unsuccessful', async () => {
      const errorMessage = 'Network Error';
      const errorResponse = {
        body: undefined,
        error: errorMessage,
      };
      const officerId = faker.lorem.word();
      const isManager = faker.random.boolean();
      const areaManagerId = faker.lorem.word();
      const patchId = faker.lorem.word();

      axios.get.mockReturnValue(Promise.reject(new Error(errorMessage)));

      const crmGateway = new CrmGateway();
      const response = await crmGateway.getTasksForAPatch(
        officerId,
        isManager,
        areaManagerId,
        patchId
      );

      expect(response).toStrictEqual(errorResponse);
    });
  });

  describe('Get User by email', () => {
    it('sucessfully fetches data from the API', async () => {
      const data = MockCrmUserResponse();
      const emailAddress = faker.internet.email();

      axios.get.mockResolvedValue({ data: data });

      const crmGateway = new CrmGateway();
      const response = await crmGateway.getUser(emailAddress);

      expect(response).toStrictEqual({ body: data.value, error: undefined });
    });

    it('returns an error from the API', async () => {
      const emailAddress = faker.internet.email();
      const error = faker.lorem.words();
      axios.get.mockReturnValue(Promise.reject(new Error(error)));

      const crmGateway = new CrmGateway();
      const response = await crmGateway.getNotesForTask(emailAddress);

      expect(response).toStrictEqual({ body: undefined, error: error });
    });
  });

  describe('Get Notes by task id', () => {
    it('successfully fetches data from the API', async () => {
      const data = MockCrmNoteResponse();
      const notes = crmToNotes(data);
      const id = faker.lorem.word();

      axios.get.mockResolvedValue({ data: data });

      const crmGateway = new CrmGateway();
      const response = await crmGateway.getNotesForTask(id);

      expect(response).toStrictEqual({ body: notes, error: undefined });
    });

    it('returns an error from the API', async () => {
      const id = faker.lorem.word();
      const error = faker.lorem.words();
      axios.get.mockReturnValue(Promise.reject(new Error(error)));

      const crmGateway = new CrmGateway();
      const response = await crmGateway.getNotesForTask(id);

      expect(response).toStrictEqual({ body: undefined, error: error });
    });
  });
});
