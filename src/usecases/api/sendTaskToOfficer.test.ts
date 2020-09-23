import SendTaskToOfficerUseCase from './sendTaskToOfficer';

describe('sendTaskToOfficer', () => {
  let crmGateway;
  let matPostgresGateway;
  let v1ApiGateway;
  let useCase;
  let dummyTaskId = 'abc-123-def';
  let dummyToken = {
    name: 'Fake User',
    email: 'fakeuser@hackney.gov.uk',
  };

  const fakeTaskResponse = {
    body: { incidentId: 'fakeIncidentId' },
  };
  const fakeUserMappingResponse = {
    body: {
      usercrmid: 'fakeCrmId',
      username: 'Fake User',
      email: 'me@me.com',
    },
  };
  const fakePatchResponse = {
    body: {
      areaManagerId: 'fakeAreaManagerId',
      areaId: 5,
      patchId: 'fakePatchId',
    },
  };

  beforeEach(() => {
    crmGateway = {
      getTask: () => fakeTaskResponse,
      getPatchByOfficerId: () => fakePatchResponse,
      getOfficersByAreaId: jest.fn(),
    };
    matPostgresGateway = {
      getUserMapping: () => fakeUserMappingResponse,
    };
    v1ApiGateway = {
      transferCall: jest.fn(() => ({ body: true })),
    };
    useCase = new SendTaskToOfficerUseCase({
      crmGateway,
      matPostgresGateway,
      v1ApiGateway,
    });
  });

  it('Should assemble the correct  data to send to the API', async () => {
    const result = await useCase.execute(
      dummyTaskId,
      dummyToken,
      'dummyOfficerId'
    );
    expect(result).toEqual({ body: true });
    expect(v1ApiGateway.transferCall).toHaveBeenCalledWith({
      areaName: 5,
      estateOfficerId: 'dummyOfficerId',
      estateOfficerName: 'Fake User',
      interactionId: 'abc-123-def',
      officerPatchId: 'fakePatchId',
      serviceRequest: {
        description: 'Transferred from: Fake User',
        id: 'fakeIncidentId',
        requestCallback: false,
      },
    });
  });

  it("Should return an error if it can't fetch the task from crm", async () => {
    crmGateway.getTask = jest.fn();
    const result = await useCase.execute(
      dummyTaskId,
      fakeUserMappingResponse.body.email
    );
    expect(result).toEqual({ error: 'Error fetching task from crm' });
  });

  it("Should return an error if it can't fetch the mapped user from postgres", async () => {
    matPostgresGateway.getUserMapping = jest.fn();
    const result = await useCase.execute(
      dummyTaskId,
      fakeUserMappingResponse.body.email
    );
    expect(result).toEqual({ error: 'Error fetching mapped user' });
  });

  it("Should return an error if it can't fetch the patch from crm", async () => {
    crmGateway.getPatchByOfficerId = jest.fn();
    const result = await useCase.execute(
      dummyTaskId,
      fakeUserMappingResponse.body.email
    );
    expect(result).toEqual({ error: 'Error fetching patch' });
  });
});
