import CrmGateway, { CrmGatewayInterface } from './crmGateway';
import axios from 'axios';
import faker from 'faker';
import MockCrmTaskResponse from '../tests/helpers/generateCrmTaskResponse';
import MockCrmUserResponse from '../tests/helpers/generateCrmUserResponse';
import { crmResponseToTasks } from '../mappings/crmToTask';
import MockCrmNoteResponse from '../tests/helpers/generateCrmNoteResponse';
import { crmToNotes } from '../mappings/crmToNotes';
import MockCrmPropertyPatchResponse from '../tests/helpers/generatePropertyPatchResponse';
import MockCrmOfficersPerAreaIdResponse from '../tests/helpers/generateMockCrmOfficersPerAreaIdResponse';
import { crmToOfficersDetails } from '../mappings/crmToOfficersDetails';
import { mockCrmTokenGateway } from '../tests/helpers/mockGateways';
import { CrmTokenGatewayInterface } from './crmTokenGateway';
import { isError, isSuccess } from '../lib/utils';

jest.mock('axios');

describe('CrmGateway', () => {
  let crmTokenGateway: CrmTokenGatewayInterface;
  let crmGateway: CrmGatewayInterface;

  beforeEach(() => {
    crmTokenGateway = mockCrmTokenGateway();
    crmGateway = new CrmGateway('http://fakeurl.com', crmTokenGateway);

    axios.mockClear();
  });

  describe('Get Tasks by patch id', () => {
    it('successfully fetches data from an API', async () => {
      const data = MockCrmTaskResponse();
      const patchId = '9cd3823d-8653-e811-8126-70106faaf8c1';
      const areaManagerId = faker.lorem.word();

      axios.get.mockResolvedValue({ data: data });

      const response = await crmGateway.getTasksForAPatch(
        false,
        areaManagerId,
        patchId
      );

      const tasks = crmResponseToTasks(data);

      expect(isSuccess(response)).toEqual(true);
      expect(response).toStrictEqual(tasks);
    });

    it('returns an human readable error when unsuccessful', async () => {
      const errorMessage = 'Network Error';
      axios.get.mockReturnValue(Promise.reject(new Error(errorMessage)));

      const response = await crmGateway.getTasksForAPatch(
        faker.random.boolean(),
        faker.lorem.word(),
        faker.lorem.word()
      );

      expect(isError(response)).toEqual(true);
      expect(response.message).toEqual(errorMessage);
    });
  });

  describe('Get User by email', () => {
    it('sucessfully fetches data from the API', async () => {
      const data = MockCrmUserResponse();
      const emailAddress = faker.internet.email();

      axios.get.mockResolvedValue({ data: data });

      const response = await crmGateway.getUserId(emailAddress);

      expect(response).toStrictEqual(data.value[0].hackney_estateofficerid);
    });

    it('returns an error from the API', async () => {
      const emailAddress = faker.internet.email();
      const error = faker.lorem.words();
      axios.get.mockReturnValue(Promise.reject(new Error(error)));

      const response = await crmGateway.getUserId(emailAddress);

      expect(isError(response)).toEqual(true);
      expect(response.message).toStrictEqual(error);
    });
  });

  describe('Get Notes by task id', () => {
    it('successfully fetches data from the API', async () => {
      const data = MockCrmNoteResponse();
      const notes = crmToNotes(data);
      const id = faker.lorem.word();

      axios.get.mockResolvedValue({ data: data });

      const response = await crmGateway.getNotesForTask(id);

      expect(response).toStrictEqual(notes);
    });

    it('returns an error from the API', async () => {
      const id = faker.lorem.word();
      const error = faker.lorem.words();
      axios.get.mockReturnValue(Promise.reject(new Error(error)));

      const response = await crmGateway.getNotesForTask(id);

      expect(isError(response)).toEqual(true);
      expect(response.message).toStrictEqual(error);
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
      };
      const uprn = '100023006827';

      axios.get.mockResolvedValue({ data: data });

      const response = await crmGateway.getPropertyPatch(uprn);
      expect(response).toEqual({ body: expectedData });
    });

    it('returns an error from the API', async () => {
      const uprn = '100023006827';
      const error = faker.lorem.words();
      axios.get.mockReturnValue(Promise.reject(new Error(error)));

      const response = await crmGateway.getPropertyPatch(uprn);

      expect(response).toEqual({ error: error });
    });
  });

  describe('Get Tasks by tag_ref', () => {
    const tagRef = '123456/01';

    it('successfully fetches data from an API', async () => {
      const data = MockCrmTaskResponse();
      const tasks = crmResponseToTasks(data);

      axios.get.mockResolvedValue({ data: data });

      const response = await crmGateway.getTasksForTagRef(tagRef);

      expect(isSuccess(response)).toEqual(true);
      expect(response).toStrictEqual(tasks);
    });

    it('returns an human readable error when unsuccessful', async () => {
      const errorMessage = 'Network Error';

      axios.get.mockReturnValue(Promise.reject(new Error(errorMessage)));

      const response = await crmGateway.getTasksForTagRef(tagRef);

      expect(isError(response)).toEqual(true);
      expect(response.message).toEqual(errorMessage);
    });
  });

  describe('Get Officers by area id', () => {
    it('successfully fetches data from the API', async () => {
      const data = MockCrmOfficersPerAreaIdResponse();
      const areaId = 5;

      axios.get.mockResolvedValue({ data: data });

      const response = await crmGateway.getOfficersByAreaId(areaId);

      expect(response).toEqual({
        body: crmToOfficersDetails(data),
      });
    });

    it('returns an error from the API', async () => {
      const areaId = 1;
      const error = faker.lorem.words();
      axios.get.mockReturnValue(Promise.reject(new Error(error)));

      const response = await crmGateway.getOfficersByAreaId(areaId);

      expect(response).toEqual({ error: error });
    });
  });
});
