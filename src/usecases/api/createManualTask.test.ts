import CreateManualTaskUseCase from './createManualTask';
import { V1MatAPIGatewayInterface } from '../../gateways/v1MatAPIGateway';
import GetOfficerPatch from './getOfficerPatch';
import { CrmGatewayInterface } from '../../gateways/crmGateway';
jest.mock('./getOfficerPatch');

describe('createManualTasks', () => {
  let usecase: CreateManualTaskUseCase;
  let v1MatAPIGateway: V1MatAPIGatewayInterface;
  let crmGateway: CrmGatewayInterface;
  let dummyGetOfficerPatch = { execute: jest.fn() };
  let dummyCallData: any;
  let dummyOfficerId = 'dummyOfficerId';
  let dummyOfficerPatchData: any;

  beforeEach(() => {
    dummyCallData = {
      tagRef: 'fakeTagRef',
      uprn: 'fakeUPRN',
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
    v1MatAPIGateway = {
      getNewTenancies: jest.fn(),
      getContactsByUprn: jest.fn(),
      createTenancyManagementInteraction: jest.fn(),
      transferCall: jest.fn(),
    };
    crmGateway = {
      getTasksForAPatch: jest.fn(),
      getTask: jest.fn(),
      getUser: jest.fn(),
      createUser: jest.fn(),
      getPatchByOfficerId: jest.fn(),
      getNotesForTask: jest.fn(),
      getContactsByUprn: jest.fn(),
    };
    usecase = new CreateManualTaskUseCase({ v1MatAPIGateway, crmGateway });
  });

  it('should use the correct data for the TMI', async () => {
    v1MatAPIGateway.createTenancyManagementInteraction.mockResolvedValue(
      Promise.resolve({
        interactionId: 'dummy',
      })
    );
    crmGateway.getContactsByUprn.mockResolvedValue({
      body: [
        {
          crmContactId: 'dummyContactId',
          crmHouseholdId: 'dummyHouseRef',
        },
      ],
    });
    dummyGetOfficerPatch.execute.mockResolvedValue({
      body: dummyOfficerPatchData,
    });
    const result = await usecase.execute(dummyCallData);
    expect(crmGateway.getContactsByUprn).toHaveBeenCalledWith(
      dummyCallData.uprn
    );

    expect(
      v1MatAPIGateway.createTenancyManagementInteraction
    ).toHaveBeenCalledWith({
      areaName: 5,
      contactId: 'dummyContactId',
      enquirySubject: '100000052',
      estateOfficerId: dummyOfficerId,
      estateOfficerName: 'Fake Name',
      householdId: 'dummyHouseRef',
      natureofEnquiry: '15',
      officerPatchId: 'ID1',
      reasonForStartingProcess: undefined,
      processType: 1,
      serviceRequest: {
        childRequests: [],
        contactId: 'dummyContactId',
        createdBy: dummyOfficerId,
        description: 'Starting a home check',
        subject: 'c1f72d01-28dc-e711-8115-70106faa6a11',
        title: 'Home Check',
      },
      source: '1',
      subject: 'c1f72d01-28dc-e711-8115-70106faa6a11',
    });
    expect(result).toEqual({
      interactionId: 'dummy',
    });
    expect(result.error).toBeFalsy();
  });

  it('should return an error if there is a problem fetching the contacts', async () => {
    crmGateway.getContactsByUprn.mockResolvedValue({
      error: 500,
    });
    const result = await usecase.execute(dummyCallData);
    expect(result.error).toEqual('Error fetching contacts');
  });

  it('should return an error if there are no contacts found', async () => {
    crmGateway.getContactsByUprn.mockResolvedValue({
      contacts: [],
    });
    const result = await usecase.execute(dummyCallData);
    expect(result.error).toEqual('Error fetching contacts');
  });

  it('should create the correct TMI for homechecks', async () => {
    crmGateway.getContactsByUprn.mockResolvedValue({
      body: [
        {
          contactId: 'dummyContactId',
          houseRef: 'dummyHouseRef',
        },
      ],
    });
    await usecase.execute(dummyCallData);
    const gwCall =
      v1MatAPIGateway.createTenancyManagementInteraction.mock.calls[0][0];
    expect(gwCall.enquirySubject).toEqual('100000052');
    expect(gwCall.serviceRequest.description).toEqual('Starting a home check');
    expect(gwCall.serviceRequest.title).toEqual('Home Check');
  });

  it('should create the correct TMI for itvs', async () => {
    dummyCallData.process = 'itv';
    crmGateway.getContactsByUprn.mockResolvedValue({
      body: [
        {
          contactId: 'dummyContactId',
          houseRef: 'dummyHouseRef',
        },
      ],
    });
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
    crmGateway.getContactsByUprn.mockResolvedValue({
      body: [
        {
          contactId: 'dummyContactId',
          houseRef: 'dummyHouseRef',
        },
      ],
    });
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
