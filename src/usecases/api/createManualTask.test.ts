import CreateManualTaskUseCase, {
  CreateManualTaskInterface,
} from './createManualTask';
import { V1MatAPIGatewayInterface } from '../../gateways/v1MatAPIGateway';
import GetOfficerPatch from './getOfficerPatch';
import {
  mockV1MatApiGateway,
  mockCrmGateway,
  mockMatPostgresGateway,
} from '../../tests/helpers/mockGateways';
import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { MatPostgresGatewayInterface } from '../../gateways/matPostgresGateway';
import MockTMI from '../../tests/helpers/generateTMI';
jest.mock('./getOfficerPatch');

describe('createManualTasks', () => {
  let usecase: CreateManualTaskInterface;
  let v1MatAPIGateway: V1MatAPIGatewayInterface;
  let crmGateway: CrmGatewayInterface;
  let matPostgresGateway: MatPostgresGatewayInterface;
  let dummyGetOfficerPatch = { execute: jest.fn() };
  let dummyCallData: any;
  let dummyOfficerId = 'dummyOfficerId';
  let dummyOfficerPatchData: any;
  let getContactsByTagRefResponse = {
    body: [
      {
        crmContactId: 'dummyContactId',
        crmHouseholdId: 'dummyHouseholdId',
        uhPersonNo: 1,
        responsible: true,
      },
    ],
  };

  beforeEach(() => {
    dummyCallData = {
      tagRef: '1234567-01',
      process: 'homecheck',
      officerEmail: 'fake@email.com',
      officerName: 'Fake Name',
    };
    dummyOfficerPatchData = {
      patchId: 'ID1',
      officerId: dummyOfficerId,
      areaId: 5,
    };
    GetOfficerPatch.mockImplementationOnce(() => dummyGetOfficerPatch);
    v1MatAPIGateway = mockV1MatApiGateway();
    crmGateway = mockCrmGateway();
    matPostgresGateway = mockMatPostgresGateway();
    usecase = new CreateManualTaskUseCase(
      crmGateway,
      v1MatAPIGateway,
      matPostgresGateway
    );
  });

  it('should use the correct data for the TMI', async () => {
    v1MatAPIGateway.createTenancyManagementInteraction = () =>
      Promise.resolve({ interactionId: 'dummy' });

    crmGateway.getContactsByTagRef = () =>
      Promise.resolve(getContactsByTagRefResponse);
    dummyGetOfficerPatch.execute.mockResolvedValue({
      body: dummyOfficerPatchData,
    });
    const result = await usecase.execute(dummyCallData);
    expect(result.error).toBe(undefined);

    expect(result).toEqual({
      interactionId: 'dummy',
    });
    expect(result.error).toBeFalsy();
  });

  it('should return an error if there is a problem fetching the contacts', async () => {
    crmGateway.getContactsByTagRef = () =>
      Promise.resolve({
        error: '500',
      });
    const result = await usecase.execute(dummyCallData);
    expect(result.error).toEqual('Error fetching contacts');
  });

  it('should return an error if there are no contacts found', async () => {
    crmGateway.getContactsByTagRef = () =>
      Promise.resolve({
        contacts: [],
      });
    const result = await usecase.execute(dummyCallData);
    expect(result.error).toEqual('Error fetching contacts');
  });

  it('should create the correct TMI for homechecks', async () => {
    crmGateway.getContactsByTagRef = () =>
      Promise.resolve(getContactsByTagRefResponse);
    await usecase.execute(dummyCallData);

    const gwCall =
      v1MatAPIGateway.createTenancyManagementInteraction.mock.calls[0][0];
    expect(gwCall.enquirySubject).toEqual('100000052');
    expect(gwCall.serviceRequest.description).toEqual('Starting a home check');
    expect(gwCall.serviceRequest.title).toEqual('Home Check');
  });

  it('should create the correct TMI for itvs', async () => {
    dummyCallData.process = 'itv';
    crmGateway.getContactsByTagRef = () =>
      Promise.resolve(getContactsByTagRefResponse);
    await usecase.execute(dummyCallData);

    const gwCall =
      v1MatAPIGateway.createTenancyManagementInteraction.mock.calls[0][0];
    expect(gwCall.enquirySubject).toEqual('100000060');
    expect(gwCall.serviceRequest.description).toEqual(
      'Starting an introductory tenancy visit'
    );
    expect(gwCall.serviceRequest.title).toEqual('Introductory Tenancy Visit');
  });

  it('should create the correct TMI for thcs', async () => {
    dummyCallData.process = 'thc';
    dummyCallData.subProcess = '6';
    crmGateway.getContactsByTagRef = () =>
      Promise.resolve(getContactsByTagRefResponse);
    await usecase.execute(dummyCallData);
    const gwCall =
      v1MatAPIGateway.createTenancyManagementInteraction.mock.calls[0][0];
    expect(gwCall.enquirySubject).toEqual('100000156');
    expect(gwCall.serviceRequest.description).toEqual(
      'Starting a tenancy & household check'
    );
    expect(gwCall.serviceRequest.title).toEqual('Tenancy & Household Check');
    expect(gwCall.reasonForStartingProcess).toEqual('6');
  });
});
