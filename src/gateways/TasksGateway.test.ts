import TasksGateway from './TasksGateway';
import axios from 'axios';
import MockCrmTaskResponse from '../tests/helpers/generateCrmTaskResponse';
import crmResponseToTask from '../mappings/crmToTask';
jest.mock('axios');

describe('TasksGateway', () => {
  beforeEach(() => {
    axios.mockClear();
  });

  describe('Get Tasks', () => {
    it('successfully fetches data from an API', async () => {
      const data = MockCrmTaskResponse()

      axios.get.mockResolvedValue({data: data});

      const tasksGateway = new TasksGateway();
      const response = await tasksGateway.getTasks();

      expect(response).toEqual({body: crmResponseToTask(data), error: undefined});
    });

    it('returns an human readable error when unsuccessful', async () => {
      const errorMessage = 'Network Error';
      const errorResponse = {
        body: undefined,
        error: errorMessage,
      };

      axios.get.mockReturnValue(Promise.reject(new Error(errorMessage)));

      const tasksGateway = new TasksGateway();
      const response = await tasksGateway.getTasks();

      expect(response).toEqual(errorResponse);
    });
  });
});
