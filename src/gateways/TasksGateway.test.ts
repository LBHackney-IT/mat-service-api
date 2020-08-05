import TasksGateway from './TasksGateway';
import axios from 'axios';
jest.mock('axios');

describe('TasksGateway', () => {
  beforeEach(() => {
    axios.mockClear();
  });

  describe('Get Tasks', () => {
    it('successfully fetches data from an API', async () => {
      const data = {
        body: '',
        error: undefined,
      };

      axios.get.mockResolvedValue(data);

      const tasksGateway = new TasksGateway();
      const response = await tasksGateway.getTasks();

      expect(response).toEqual(data);
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
