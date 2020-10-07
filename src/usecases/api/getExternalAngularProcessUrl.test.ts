import GetExternalAngularProcessUrl from './getExternalAngularProcessUrl';
import MockTask from '../../tests/helpers/generateTask';
import externalProcessUrls from './externalProcessUrls.json';
import { decrypt } from '../../lib/encryption';
import moment from 'moment';
import {
  mockCrmGateway,
  mockMatPostgresGateway,
} from '../../tests/helpers/mockGateways';
import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { MatPostgresGatewayInterface } from '../../gateways/matPostgresGateway';
import { isError } from '../../lib/utils';

describe('GetExternalAngularProcessUrl', () => {
  let useCase: GetExternalAngularProcessUrl;
  let crmGateway: CrmGatewayInterface;
  let matPostgresGateway: MatPostgresGatewayInterface;
  const encryptionKey = 'q2zacxLVm4wnpe0YcLwmQA==';

  beforeEach(() => {
    crmGateway = mockCrmGateway();
    matPostgresGateway = mockMatPostgresGateway();
    useCase = new GetExternalAngularProcessUrl(
      encryptionKey,
      crmGateway,
      matPostgresGateway
    );
  });

  it('should create the correct URL', async () => {
    const task = MockTask();
    const userMapping = {
      usercrmid: 'fake-user-crm-id',
      username: 'Fake User',
    };
    const patchData = {
      patchId: 'fakePatchId',
      areaId: '5',
      areaManagerId: 'fake-area-manager-id',
      isManager: false,
    };
    crmGateway.getTask = jest.fn(() =>
      Promise.resolve({
        body: task,
      })
    );
    matPostgresGateway.getUserMapping = jest.fn(() =>
      Promise.resolve({
        body: userMapping,
      })
    );
    crmGateway.getPatchByOfficerId = jest.fn(() =>
      Promise.resolve({
        body: patchData,
      })
    );
    const result = await useCase.execute(
      'fakeTaskId',
      'fake.user@hackney.gov.uk'
    );
    expect(result.startsWith(`${externalProcessUrls.test.itv}?data=`)).toBe(
      true
    );
    const token = decodeURIComponent(
      result.replace(`${externalProcessUrls.test.itv}?data=`, '')
    );

    const payload = decrypt(token, encryptionKey);
    expect(JSON.parse(payload)).toEqual({
      contactId: task.resident.contactCrmId,
      officerId: userMapping.usercrmid,
      officerFullName: userMapping.username,
      contactFullName: task.resident.presentationName,
      contactAddress: task.address.presentationShort,
      officerUsername: 'TBC',
      contactDOB: moment(task.resident.dateOfBirth).format('DD/MM/YYYY'),
      contactMobile: task.resident.mobileNumber || '',
      uprn: task.tenancy.uprn,
      patchId: patchData.patchId || '',
      subjectId: 'c1f72d01-28dc-e711-8115-70106faa6a11',
      areaId: `${patchData.areaId}`,
      processId: '3',
      IsStarting: false,
      HouseholdID: task.householdId,
      ManagerId: patchData.areaManagerId || '',
      TMProcessId: 'fakeTaskId',
      IncidentId: task.incidentId,
      ProcessStage: `${task.stage}`,
      IsManager: patchData.isManager,
      ProcessCRMReference: task.referenceNumber,
    });
  });

  it('should return an error if it could not load a task', async () => {
    const result = await useCase.execute(
      'fakeTaskId',
      'fake.user@hackney.gov.uk'
    );
    expect(isError(result)).toBe(true);
    expect(result.message).toEqual('Could not load task from crm');
  });

  it('should return an error if the task does not have a process type', async () => {
    crmGateway.getTask = jest.fn(() => Promise.resolve({ body: {} }));
    const result = await useCase.execute(
      'fakeTaskId',
      'fake.user@hackney.gov.uk'
    );
    expect(isError(result)).toBe(true);
    expect(result.message).toEqual('Task does not have a process type');
  });

  it('should return an error if it could not load a user mapping', async () => {
    crmGateway.getTask = jest.fn(() =>
      Promise.resolve({ body: { processType: 'itv' } })
    );
    const result = await useCase.execute(
      'fakeTaskId',
      'fake.user@hackney.gov.uk'
    );
    expect(isError(result)).toBe(true);
    expect(result.message).toEqual('Could not load user mapping');
  });

  it('should return an error if it could not load patch data', async () => {
    crmGateway.getTask = jest.fn(() =>
      Promise.resolve({ body: { processType: 'itv' } })
    );
    matPostgresGateway.getUserMapping = jest.fn(() =>
      Promise.resolve({ body: {} })
    );
    const result = await useCase.execute(
      'fakeTaskId',
      'fake.user@hackney.gov.uk'
    );
    expect(isError(result)).toBe(true);
    expect(result.message).toEqual('Could not load officer patch data');
  });
});
