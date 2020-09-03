import v1MatAPIGateway from './v1MatAPIGateway';
import axios from 'axios';
import faker from 'faker';
import MockTMI from '../tests/helpers/generateTMI';
jest.mock('axios');
const dummyToken = 'abc123';

describe('v1MatAPIGateway', () => {
  let gateway: v1MatAPIGateway;

  beforeEach(() => {
    axios.mockClear();

    gateway = new v1MatAPIGateway({
      v1MatApiUrl: 'http://dummy-api.com',
      v1MatApiToken: dummyToken,
    });
  });

  describe('getNewTenancies', () => {
    it('makes the request to the correct URL with the correct token', () => {
      axios.get.mockResolvedValue(Promise.resolve({ result: [] }));
      gateway.getNewTenancies();
      expect(axios.get).toHaveBeenCalledWith(
        'http://dummy-api.com/v1/tenancy/new',
        {
          headers: {
            'x-api-key': dummyToken,
          },
        }
      );
    });

    it('successfully returns data from an API', async () => {
      const dummyResponse = {
        result: [
          { accountId: faker.lorem.word() },
          { accountId: faker.lorem.word() },
        ],
      };

      axios.get.mockResolvedValue(dummyResponse);

      const response = await gateway.getNewTenancies();

      expect(response).toEqual(dummyResponse);
    });

    it('returns an human readable error when unsuccessful', async () => {
      const error = 'Network Error';
      const errorResponse = {
        body: undefined,
        error,
      };

      axios.get.mockReturnValue(Promise.reject(new Error(error)));

      const response = await gateway.getNewTenancies();

      expect(response).toEqual(errorResponse);
    });
  });

  describe('createTenancyManagementInteraction', () => {
    it('makes the request to the correct URL with the correct token', () => {
      const dummyPayload = MockTMI();
      axios.post.mockResolvedValue(Promise.resolve());
      gateway.createTenancyManagementInteraction(dummyPayload);
      expect(axios.post).toHaveBeenCalledWith(
        'http://dummy-api.com/v1/TenancyManagementInteractions/CreateTenancyManagementInteraction',
        dummyPayload,
        {
          headers: {
            'x-api-key': dummyToken,
          },
        }
      );
    });

    it('returns no errors after a successful request', async () => {
      const dummyPayload = MockTMI();

      axios.post.mockReturnValue(Promise.resolve());
      const response = await gateway.createTenancyManagementInteraction(
        dummyPayload
      );

      expect(response).toEqual({ error: undefined });
    });

    it('returns an human readable error when unsuccessful', async () => {
      const error = 'Network Error';
      const errorResponse = { error };

      axios.get.mockReturnValue(Promise.reject(new Error(error)));

      const response = await gateway.getNewTenancies();

      expect(response).toEqual(errorResponse);
    });
  });
});
