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
import { isError, isSuccess } from '../../lib/utils';
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
    crmContactId: 'dummyContactId',
    crmHouseholdId: 'dummyHouseholdId',
    uhPersonNo: 1,
    responsible: true,
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
    crmGateway.getContactsByTagRef = () =>
      Promise.resolve([getContactsByTagRefResponse]);
    matPostgresGateway = mockMatPostgresGateway();
    usecase = new CreateManualTaskUseCase(
      crmGateway,
      v1MatAPIGateway,
      matPostgresGateway
    );
  });

  it('should use the correct data for the TMI', async () => {
    v1MatAPIGateway.createTenancyManagementInteraction = () =>
      Promise.resolve({ body: { interactionId: 'dummy' } });

    dummyGetOfficerPatch.execute.mockResolvedValue(dummyOfficerPatchData);
    const result = await usecase.execute(dummyCallData);
    expect(isSuccess(result)).toBe(true);

    expect(result).toEqual({
      interactionId: 'dummy',
    });
  });

  it('should return an error if there is a problem fetching the contacts', async () => {
    crmGateway.getContactsByTagRef = () =>
      Promise.resolve(new Error('Error fetching contacts'));
    const result = await usecase.execute(dummyCallData);
    expect(isError(result)).toEqual(true);
    expect(result.message).toEqual('Error fetching contacts');
  });

  it('should return an error if there are no contacts found', async () => {
    crmGateway.getContactsByTagRef = () => Promise.resolve([]);
    const result = await usecase.execute(dummyCallData);
    expect(isError(result)).toEqual(true);
    expect(result.message).toEqual('Error fetching contacts');
  });

  it('should create the correct TMI for homechecks', async () => {
    await usecase.execute(dummyCallData);

    const gwCall =
      v1MatAPIGateway.createTenancyManagementInteraction.mock.calls[0][0];
    expect(gwCall.enquirySubject).toEqual('100000052');
    expect(gwCall.serviceRequest.description).toEqual('Starting a home check');
    expect(gwCall.serviceRequest.title).toEqual('Home Check');
  });

  it('should create the correct TMI for itvs', async () => {
    dummyCallData.process = 'itv';
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
