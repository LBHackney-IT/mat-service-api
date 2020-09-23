import v1MatAPIGateway from './v1MatAPIGateway';
import axios from 'axios';
import faker from 'faker';
import MockTMI from '../tests/helpers/generateTMI';
import MockCreateNote from '../tests/helpers/generateCreateNote';
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
            Authorization: `Bearer ${dummyToken}`,
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
            Authorization: `Bearer ${dummyToken}`,
          },
        }
      );
    });

    it('returns the result after a successful request', async () => {
      const dummyPayload = MockTMI();

      axios.post.mockResolvedValue({ data: { interactionId: 'dummy' } });
      const response = await gateway.createTenancyManagementInteraction(
        dummyPayload
      );

      expect(response).toEqual({ body: { interactionId: 'dummy' } });
    });

    it('returns an human readable error when unsuccessful', async () => {
      const error = 'Network Error';
      const errorResponse = { error };

      axios.get.mockReturnValue(Promise.reject(new Error(error)));

      const response = await gateway.getNewTenancies();

      expect(response).toEqual(errorResponse);
    });
  });

  describe('getContactsByUprn', () => {
    it('makes the request to the correct URL with the correct token', () => {
      axios.get.mockResolvedValue(Promise.resolve({ results: [] }));
      gateway.getContactsByUprn('12345678901');
      expect(axios.get).toHaveBeenCalledWith(
        'http://dummy-api.com/v1/Contacts/GetContactsByUprn?urpn=12345678901',
        {
          headers: {
            Authorization: `Bearer ${dummyToken}`,
          },
        }
      );
    });

    it('successfully returns data from an API', async () => {
      const dummyResponse = {
        data: {
          results: [
            { contactId: faker.lorem.word() },
            { contactId: faker.lorem.word() },
          ],
        },
      };

      axios.get.mockResolvedValue(dummyResponse);

      const response = await gateway.getContactsByUprn('12345678901');

      expect(response.body).toEqual(dummyResponse.data.results);
    });

    it('returns an human readable error when unsuccessful', async () => {
      const error = 'Network Error';
      const errorResponse = { error };

      axios.get.mockReturnValue(Promise.reject(new Error(error)));

      const response = await gateway.getContactsByUprn('12345678901');

      expect(response).toEqual(errorResponse);
    });
  });

  describe('transferCall', () => {
    const dummyTmi = { interactionId: 'foo' };
    it('makes the request to the correct URL with the correct token', () => {
      axios.put.mockResolvedValue(Promise.resolve());
      gateway.transferCall(dummyTmi);
      expect(axios.put).toHaveBeenCalledWith(
        'http://dummy-api.com/v1/TenancyManagementInteractions/TransferCall',
        dummyTmi,
        {
          headers: {
            Authorization: `Bearer ${dummyToken}`,
          },
        }
      );
    });

    it('successfully returns data from an API', async () => {
      axios.put.mockResolvedValue(true);
      const response = await gateway.transferCall(dummyTmi);
      expect(response.body).toEqual(true);
    });

    it('returns an human readable error when unsuccessful', async () => {
      const error = 'Network Error';
      const errorResponse = { error };

      axios.put.mockReturnValue(Promise.reject(new Error(error)));
      const response = await gateway.transferCall(dummyTmi);
      expect(response).toEqual(errorResponse);
    });
  });

  describe('createTaskNotes', () => {
    it('makes the request to the correct URL with the correct token', () => {
      const dummyPayload = MockCreateNote();
      axios.post.mockResolvedValue(Promise.resolve());
      gateway.createTaskNote(dummyPayload);
      expect(axios.post).toHaveBeenCalledWith(
        'http://dummy-api.com/v1/TenancyManagementInteractions',
        dummyPayload,
        {
          headers: {
            Authorization: `Bearer ${dummyToken}`,
          },
        }
      );
    });

    it('returns the result after a successful request', async () => {
      const dummyPayload = MockCreateNote();

      axios.post.mockResolvedValue({ data: { interactionId: 'dummy' } });
      const response = await gateway.createTenancyManagementInteraction(
        dummyPayload
      );

      expect(response).toEqual({ body: { interactionId: 'dummy' } });
    });

    it('returns an human readable error when unsuccessful', async () => {
      const dummyPayload = MockCreateNote();
      const error = 'Network Error';
      const errorResponse = { error: `V1 API: ${error}` };

      axios.post.mockReturnValue(Promise.reject(new Error(error)));

      const response = await gateway.createTaskNote(dummyPayload);

      expect(response).toEqual(errorResponse);
    });
  });
});
