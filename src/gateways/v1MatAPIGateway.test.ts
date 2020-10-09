import V1MatAPIGateway from './v1MatAPIGateway';
import axios from 'axios';
import faker from 'faker';
import MockTMI from '../tests/helpers/generateTMI';
import MockCreateNote from '../tests/helpers/generateCreateNote';
import { isSuccess } from '../lib/utils';
jest.mock('axios');
const dummyToken = 'abc123';
const dummyHeaders = {
  headers: {
    Authorization: `Bearer ${dummyToken}`,
  },
};

describe('v1MatAPIGateway', () => {
  let gateway: V1MatAPIGateway;

  beforeEach(() => {
    axios.mockClear();

    gateway = new V1MatAPIGateway('http://dummy-api.com', dummyToken);
  });

  describe('createTenancyManagementInteraction', () => {
    it('makes the request to the correct URL with the correct token', () => {
      const dummyPayload = MockTMI();
      axios.post.mockResolvedValue(Promise.resolve());
      gateway.createTenancyManagementInteraction(dummyPayload);
      expect(axios.post).toHaveBeenCalledWith(
        'http://dummy-api.com/v1/TenancyManagementInteractions/CreateTenancyManagementInteraction',
        dummyPayload,
        dummyHeaders
      );
    });

    it('returns the result after a successful request', async () => {
      const dummyPayload = MockTMI();

      axios.post.mockResolvedValue({ data: { interactionId: 'dummy' } });
      const response = await gateway.createTenancyManagementInteraction(
        dummyPayload
      );

      expect(response).toEqual({ interactionId: 'dummy' });
    });

    it('returns an human readable error when unsuccessful', async () => {
      const error = new Error('Network Error');

      axios.post.mockReturnValue(Promise.reject(error));

      const response = await gateway.createTenancyManagementInteraction();

      expect(response).toEqual(error);
    });
  });

  describe('patchTenancyManagementInteraction', () => {
    it('makes the request to the correct URL with the correct token', () => {
      const dummyPayload = MockTMI();
      axios.patch.mockResolvedValue(Promise.resolve(dummyPayload));
      gateway.patchTenancyManagementInteraction(dummyPayload);
      expect(axios.patch).toHaveBeenCalledWith(
        'http://dummy-api.com/v1/TenancyManagementInteractions',
        dummyPayload,
        dummyHeaders
      );
    });

    it('returns the result after a successful request', async () => {
      const dummyPayload = MockTMI();

      axios.patch.mockResolvedValue({ data: dummyPayload });
      const response = await gateway.patchTenancyManagementInteraction(
        dummyPayload
      );

      expect(response).toEqual(dummyPayload);
    });

    it('returns an error when unsuccessful', async () => {
      const error = new Error('Network Error');

      axios.patch.mockReturnValue(Promise.reject(error));
      const response = await gateway.patchTenancyManagementInteraction(
        MockTMI()
      );

      expect(response).toEqual(error);
    });
  });

  describe('getContactsByUprn', () => {
    it('makes the request to the correct URL with the correct token', () => {
      axios.get.mockResolvedValue(Promise.resolve({ results: [] }));
      gateway.getContactsByUprn('12345678901');
      expect(axios.get).toHaveBeenCalledWith(
        'http://dummy-api.com/v1/Contacts/GetContactsByUprn?urpn=12345678901',
        dummyHeaders
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

      expect(response).toEqual(dummyResponse.data.results);
    });

    it('returns an error when unsuccessful', async () => {
      const error = new Error('Network Error');

      axios.get.mockReturnValue(Promise.reject(error));

      const response = await gateway.getContactsByUprn('12345678901');

      expect(response).toEqual(error);
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
        dummyHeaders
      );
    });

    it('successfully returns data from an API', async () => {
      axios.put.mockResolvedValue(true);
      const response = await gateway.transferCall(dummyTmi);
      expect(isSuccess(response)).toEqual(true);
    });

    it('returns an error when unsuccessful', async () => {
      const error = new Error('Network Error');

      axios.put.mockReturnValue(Promise.reject(error));
      const response = await gateway.transferCall(dummyTmi);
      expect(response).toEqual(error);
    });
  });

  describe('createTaskNotes', () => {
    it('makes the request to the correct URL with the correct token', () => {
      const dummyPayload = MockCreateNote();
      axios.patch.mockResolvedValue(Promise.resolve());
      gateway.createTaskNote(dummyPayload);
      expect(axios.patch).toHaveBeenCalledWith(
        'http://dummy-api.com/v1/TenancyManagementInteractions',
        dummyPayload,
        dummyHeaders
      );
    });

    it('returns the result after a successful request', async () => {
      const dummyPayload = MockCreateNote();

      axios.patch.mockResolvedValue({ data: { interactionId: 'dummy' } });
      const response = await gateway.createTaskNote(dummyPayload);

      expect(response).toEqual({ interactionId: 'dummy' });
    });

    it('returns an error when unsuccessful', async () => {
      const error = new Error('Network Error');

      axios.patch.mockReturnValue(Promise.reject(error));

      const response = await gateway.createTaskNote(MockCreateNote());

      expect(response).toEqual(error);
    });
  });
});
