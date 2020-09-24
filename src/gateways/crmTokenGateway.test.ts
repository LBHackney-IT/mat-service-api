import CrmTokenGateway from './crmTokenGateway';
import axios from 'axios';
import faker from 'faker';
jest.mock('axios');

describe('TasksGateway', () => {
  beforeEach(() => {
    axios.mockClear();
    process.env.CRM_TOKEN_API_URL = 'fakeUrl';
    process.env.CRM_TOKEN_API_KEY = 'secret';
  });

  describe('Get Tasks', () => {
    it('successfully fetches data from an API', async () => {
      const token = faker.lorem.word();
      const crmResponse = {
        data: {
          accessToken: token,
        },
      };

      axios.post.mockReturnValue(Promise.resolve(crmResponse));

      const crmTokenGateway = new CrmTokenGateway();
      const response = await crmTokenGateway.getToken();

      expect(response).toEqual({ body: token });
    });

    it('returns an human readable error when unsuccessful', async () => {
      const errorMessage = 'Network Error';
      const expectedErrorResponse = {
        error: errorMessage,
      };

      axios.post.mockReturnValue(Promise.reject(new Error(errorMessage)));

      const crmTokenGateway = new CrmTokenGateway();
      const response = await crmTokenGateway.getToken();

      expect(response).toEqual(expectedErrorResponse);
    });
  });
});
