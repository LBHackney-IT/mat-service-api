import CrmGateway from './crmGateway';
import axios from 'axios';
import MockCrmTaskResponse from '../tests/helpers/generateCrmTaskResponse';
import { crmResponseToTasks } from '../mappings/crmToTask';
jest.mock('axios');

describe('CrmGateway', () => {
  beforeEach(() => {
    axios.mockClear();
  });

  describe('Get Tasks by patch id', () => {
    it('successfully fetches data from an API', async () => {
      const data = MockCrmTaskResponse()
      const patchId = '9cd3823d-8653-e811-8126-70106faaf8c1'

      axios.get.mockResolvedValue({data: data});

      const crmGateway = new CrmGateway();
      const response = await crmGateway.getTasksByPatchId(patchId);

      expect(response).toStrictEqual({body: crmResponseToTasks(data), error: undefined});
    });

    it('returns an human readable error when unsuccessful', async () => {
      const errorMessage = 'Network Error';
      const errorResponse = {
        body: undefined,
        error: errorMessage,
      };
      const patchId = '9cd3823d-8653-e811-8126-70106faaf8c1'      

      axios.get.mockReturnValue(Promise.reject(new Error(errorMessage)));

      const crmGateway = new CrmGateway();
      const response = await crmGateway.getTasksByPatchId(patchId);

      expect(response).toEqual(errorResponse);
    });
  });
});
