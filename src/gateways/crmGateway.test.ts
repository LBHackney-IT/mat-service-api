import CrmGateway from './crmGateway';
import axios from 'axios';
import faker from 'faker';
import MockCrmTaskResponse from '../tests/helpers/generateCrmTaskResponse';
import MockCrmUserResponse from '../tests/helpers/generateCrmUserResponse';
import { crmResponseToTasks } from '../mappings/crmToTask';
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
      const patchId = '9cd3823d-8653-e811-8126-70106faaf8c1';

      axios.get.mockReturnValue(Promise.reject(new Error(errorMessage)));

      const crmGateway = new CrmGateway();
      const response = await crmGateway.getTasksForAPatch(patchId);

      expect(response).toEqual(errorResponse);
    });
  });

  describe('Get User by email', () => {
    it('sucessfully fetches data from the API', async () => {
      const data = MockCrmUserResponse();
      const emailAddress = faker.internet.email();

      axios.get.mockResolvedValue({ data: data });

      const crmGateway = new CrmGateway();
      const response = await crmGateway.getUser(emailAddress);

      expect(response).toEqual({ body: data.value, error: undefined });
    });

    it('returns an error from the API', async () => {
      const emailAddress = faker.internet.email();
      const error = faker.lorem.words();
      axios.get.mockReturnValue(Promise.reject(new Error(error)));

      const crmGateway = new CrmGateway();
      const response = await crmGateway.getUser(emailAddress);

      expect(response).toEqual({ body: undefined, error: error });
    });
  });

  describe('Get Tasks by tag_ref', () => {
    it('successfully fetches data from an API', async () => {
      const data = MockCrmTaskResponse();
      const tagRef = '123456/01';

      axios.get.mockResolvedValue({ data: data });

      const crmGateway = new CrmGateway();
      const response = await crmGateway.getTasksForTagRef(tagRef);

      const tasks = crmResponseToTasks(data);

      expect(response).toStrictEqual({ body: tasks, error: undefined });
    });

    it('returns an human readable error when unsuccessful', async () => {
      const errorMessage = 'Network Error';
      const errorResponse = {
        body: undefined,
        error: errorMessage,
      };
      const tagRef = '123456/01';

      axios.get.mockReturnValue(Promise.reject(new Error(errorMessage)));

      const crmGateway = new CrmGateway();
      const response = await crmGateway.getTasksForTagRef(tagRef);

      expect(response).toEqual(errorResponse);
    });
  });
});
