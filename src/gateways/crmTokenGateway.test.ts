import CrmTokenGateway from './crmTokenGateway';
import axios from 'axios';
import faker from 'faker';
import { isError } from '../lib/utils';
jest.mock('axios');

describe('TasksGateway', () => {
  let crmTokenApiUrl = faker.internet.domainName();
  let crmTokenApiKey = faker.lorem.word();

  beforeEach(() => {
    axios.mockClear();
  });

  describe('Get Token', () => {
    it('successfully fetches data from an API', async () => {
      const token = faker.lorem.word();
      const crmTokenResponse = {
        data: {
          accessToken: token,
        },
      };

      axios.post.mockReturnValue(Promise.resolve(crmTokenResponse));

      const crmTokenGateway = new CrmTokenGateway(
        crmTokenApiUrl,
        crmTokenApiKey
      );
      const response = await crmTokenGateway.getToken();

      expect(response).toEqual(token);
    });

    it('returns an human readable error when unsuccessful', async () => {
      const errorMessage = 'Network Error';
      axios.post.mockReturnValue(Promise.reject(new Error(errorMessage)));

      const crmTokenGateway = new CrmTokenGateway(
        crmTokenApiUrl,
        crmTokenApiKey
      );
      const response = await crmTokenGateway.getToken();
      expect(isError(response)).toBe(true);
      expect(response.message).toEqual(errorMessage);
    });
  });
});
