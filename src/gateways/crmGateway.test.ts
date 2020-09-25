import CrmGateway from './crmGateway';
import axios from 'axios';
import faker from 'faker';
import MockCrmTaskResponse from '../tests/helpers/generateCrmTaskResponse';
import MockCrmUserResponse from '../tests/helpers/generateCrmUserResponse';
import MockCrmOfficersResponse from '../tests/helpers/generateCrmOfficersResponse';

import { crmResponseToTasks } from '../mappings/crmToTask';

import MockCrmNoteResponse from '../tests/helpers/generateCrmNoteResponse';
import { crmToNotes } from '../mappings/crmToNotes';
import MockCrmPropertyPatchResponse from '../tests/helpers/generatePropertyPatchResponse';

import MockCrmOfficersPerAreaIdResponse from '../tests/helpers/generateMockCrmOfficersPerAreaIdResponse';
import { crmToOfficersDetails } from '../mappings/crmToOfficersDetails';
import CrmTokenGateway from '../gateways/crmTokenGateway';

jest.mock('axios');
jest.mock('../gateways/crmTokenGateway');

describe('CrmGateway', () => {
  beforeEach(() => {
    axios.mockClear();
    CrmTokenGateway.prototype.getToken.mockResolvedValue(() =>
      Promise.resolve({ body: 'fakeToken' })
    );
  });

  describe('Get Tasks by patch id', () => {
    it('successfully fetches data from an API', async () => {
      const data = MockCrmTaskResponse();
      const patchId = '9cd3823d-8653-e811-8126-70106faaf8c1';
      const areaManagerId = faker.lorem.word();

      axios.get.mockResolvedValue({ data: data });

      const crmGateway = new CrmGateway();
      const response = await crmGateway.getTasksForAPatch(
        false,
        areaManagerId,
        patchId
      );

      const tasks = crmResponseToTasks(data);

      expect(response).toStrictEqual({ body: tasks });
    });

    it('returns an human readable error when unsuccessful', async () => {
      axios.get.mockReturnValue(Promise.reject(new Error()));

      const crmGateway = new CrmGateway();
      const response = await crmGateway.getTasksForAPatch(
        faker.random.boolean(),
        faker.lorem.word(),
        faker.lorem.word()
      );

      expect(response).toStrictEqual({
        error: 'Error getting tasks by patch and officer',
      });
    });
  });

  describe('Get User by email', () => {
    it('sucessfully fetches data from the API', async () => {
      const data = MockCrmUserResponse();
      const emailAddress = faker.internet.email();

      axios.get.mockResolvedValue({ data: data });

      const crmGateway = new CrmGateway();
      const response = await crmGateway.getUserId(emailAddress);

      expect(response).toStrictEqual({
        body: data.value[0].hackney_estateofficerid,
      });
    });

    it('returns an error from the API', async () => {
      axios.get.mockReturnValue(Promise.reject(new Error()));

      const crmGateway = new CrmGateway();
      const response = await crmGateway.getNotesForTask(faker.internet.email());

      expect(response).toStrictEqual({ error: 'Error getting notes for task' });
    });
  });

  describe('Get Notes by task id', () => {
    it('successfully fetches data from the API', async () => {
      const data = MockCrmNoteResponse();
      const notes = crmToNotes(data);
      const id = faker.lorem.word();

      axios.get.mockResolvedValue({ data: data });

      const crmGateway = new CrmGateway();
      const response = await crmGateway.getNotesForTask(id);

      expect(response).toStrictEqual({ body: notes });
    });

    it('returns an error from the API', async () => {
      const id = faker.lorem.word();
      const error = faker.lorem.words();
      axios.get.mockReturnValue(Promise.reject(new Error(error)));

      const crmGateway = new CrmGateway();
      const response = await crmGateway.getNotesForTask(id);

      expect(response).toStrictEqual({ error: 'Error getting notes for task' });
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
      expect(response).toEqual({ body: expectedData });
    });

    it('returns an error from the API', async () => {
      const uprn = '100023006827';
      axios.get.mockReturnValue(Promise.reject(new Error()));

      const crmGateway = new CrmGateway();
      const response = await crmGateway.getPropertyPatch(uprn);

      expect(response).toEqual({ error: 'Error getting property patch' });
    });
  });

  describe('Get Tasks by tag_ref', () => {
    it('successfully fetches data from an API', async () => {
      const data = MockCrmTaskResponse();
      const tagRef = '123456/01';

      axios.get.mockResolvedValue({ data: data });

      const crmGateway = new CrmGateway();
      const response = await crmGateway.getTasksForTagRef(tagRef);

      const tasks = crmResponseToTasks(data);

      expect(response).toStrictEqual({ body: tasks });
    });

    it('returns an human readable error when unsuccessful', async () => {
      axios.get.mockReturnValue(Promise.reject(new Error()));

      const crmGateway = new CrmGateway();
      const response = await crmGateway.getTasksForTagRef('123456/01');

      expect(response).toEqual({ error: 'Error getting tasks for tag ref' });
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
      });
    });

    it('returns an error from the API', async () => {
      axios.get.mockReturnValue(Promise.reject(new Error()));

      const crmGateway = new CrmGateway();
      const response = await crmGateway.getOfficersByAreaId(1);

      expect(response).toEqual({ error: 'Error getting officers by area id' });
    });
  });
});
