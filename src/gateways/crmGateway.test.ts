import CrmGateway from './crmGateway';
import axios from 'axios';
import faker from 'faker';
import MockCrmTaskResponse from '../tests/helpers/generateCrmTaskResponse';
import MockCrmUserResponse from '../tests/helpers/generateCrmUserResponse';
import MockCrmOfficersResponse from '../tests/helpers/generateCrmOfficersResponse';

import { crmResponseToTasks } from '../mappings/crmToTask';

import MockCrmPropertyPatchResponse from '../tests/helpers/generatePropertyPatchResponse';

import MockCrmOfficersPerAreaIdResponse from '../tests/helpers/generateMockCrmOfficersPerAreaIdResponse';
import { crmToOfficersDetails } from '../mappings/crmToOfficersDetails';
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

  describe('Get Property patch by uprn', () => {
    it('sucessfully fetches data from the API', async () => {
      const data = MockCrmPropertyPatchResponse();
      const expectedData = {
        areaName:
          data.value[0][
            'hackney_areaname@OData.Community.Display.V1.FormattedValue'
          ],
        officerFullName: data.value[0].OfficerFullName,
        patchCode:
          data.value[0][
            '_hackney_estateofficerpropertypatchid_value@OData.Community.Display.V1.FormattedValue'
          ],
        ward:
          data.value[0][
            'hackney_ward@OData.Community.Display.V1.FormattedValue'
          ],
        original: data,
      };
      const uprn = '100023006827';

      axios.get.mockResolvedValue({ data: data });
      const crmGateway = new CrmGateway();
      const response = await crmGateway.getPropertyPatch(uprn);
      expect(response).toEqual({ body: expectedData, error: undefined });
    });

    it('returns an error from the API', async () => {
      const uprn = '100023006827';
      const error = faker.lorem.words();
      axios.get.mockReturnValue(Promise.reject(new Error(error)));

      const crmGateway = new CrmGateway();
      const response = await crmGateway.getPropertyPatch(uprn);

      expect(response).toEqual({ body: undefined, error: error });
    });
  });

  describe('Get Officers by area id', () => {
    it('successfully fetches data from the API', async () => {
      const data = MockCrmOfficersPerAreaIdResponse();
      const areaId = 5;

      axios.get.mockResolvedValue({ data: data });

      const crmGateway = new CrmGateway();
      const response = await crmGateway.getOfficersByAreaId(areaId);

      expect(response).toEqual({
        body: crmToOfficersDetails(data),
        error: undefined,
      });
    });

    it('returns an error from the API', async () => {
      const areaId = 1;
      const error = faker.lorem.words();
      axios.get.mockReturnValue(Promise.reject(new Error(error)));

      const crmGateway = new CrmGateway();
      const response = await crmGateway.getOfficersByAreaId(areaId);

      expect(response).toEqual({ body: undefined, error: error });
    });
  });
});
