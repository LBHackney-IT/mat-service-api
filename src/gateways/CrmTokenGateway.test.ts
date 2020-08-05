import CrmTokenGateway from './CrmTokenGateway';
import axios from 'axios';
import faker from "faker";
jest.mock('axios');

describe('TasksGateway', () => {
  beforeEach(() => {
    axios.mockClear();
  });

  describe('Get Tasks', () => {
    it('successfully fetches data from an API', async () => {
      const token = faker.lorem.word();
      const data = {
        token: token
      };

      axios.get.mockResolvedValue(data);

      const crmTokenGateway = new CrmTokenGateway();
      const response = await crmTokenGateway.getCloudToken();

      expect(response).toEqual(data);
    });

    it('returns an human readable error when unsuccessful', async () => {
      const errorMessage = 'Network Error';
      const errorResponse = {
        token: undefined
      };

      axios.get.mockReturnValue(Promise.reject(new Error(errorMessage)));

      const crmTokenGateway = new CrmTokenGateway();
      const response = await crmTokenGateway.getCloudToken();

      expect(response).toEqual(errorResponse);
    });
  });
});
