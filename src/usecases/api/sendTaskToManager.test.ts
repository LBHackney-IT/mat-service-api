import SendTaskToManagerUseCase from './sendTaskToManager';
import { mockCrmGateway } from '../../tests/helpers/mockGateways';
import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { V1MatAPIGatewayInterface } from '../../gateways/v1MatAPIGateway';
import { MatPostgresGatewayInterface } from '../../gateways/matPostgresGateway';
import { isError, isSuccess } from '../../lib/utils';

describe('sendTaskToManager', () => {
  let crmGateway: CrmGatewayInterface;
  let matPostgresGateway: MatPostgresGatewayInterface;
  let v1ApiGateway: V1MatAPIGatewayInterface;
  let useCase: SendTaskToManagerUseCase;
  let dummyTaskId = 'abc-123-def';

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
    },
  };

  beforeEach(() => {
    crmGateway = mockCrmGateway();
    crmGateway = {
      getTask: () => fakeTaskResponse,
      getPatchByOfficerId: () => fakePatchResponse,
    };
    matPostgresGateway = {
      getUserMapping: () => fakeUserMappingResponse,
    };
    v1ApiGateway = {
      transferCall: jest.fn(() => ({ body: true })),
    };
    useCase = new SendTaskToManagerUseCase(
      crmGateway,
      v1ApiGateway,
      matPostgresGateway
    );
  });

  it('Should assemble the correct TMI data to send to the API', async () => {
    const result = await useCase.execute(
      dummyTaskId,
      fakeUserMappingResponse.body.email
    );
    expect(isSuccess(result)).toEqual(true);
    expect(v1ApiGateway.transferCall).toHaveBeenCalledWith({
      areaName: 5,
      assignedToPatch: true,
      estateOfficerId: 'fakeCrmId',
      estateOfficerName: 'Fake User',
      interactionId: 'abc-123-def',
      managerId: 'fakeAreaManagerId',
      officerPatchId: 'fakeCrmId',
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
    expect(isError(result)).toEqual(true);
    expect(result.message).toEqual('Error fetching task from crm');
  });

  it("Should return an error if it can't fetch the mapped user from postgres", async () => {
    matPostgresGateway.getUserMapping = jest.fn();
    const result = await useCase.execute(
      dummyTaskId,
      fakeUserMappingResponse.body.email
    );
    expect(isError(result)).toEqual(true);
    expect(result.message).toEqual('Error fetching mapped user');
  });

  it("Should return an error if it can't fetch the patch from crm", async () => {
    crmGateway.getPatchByOfficerId = jest.fn();
    const result = await useCase.execute(
      dummyTaskId,
      fakeUserMappingResponse.body.email
    );
    expect(isError(result)).toEqual(true);
    expect(result.message).toEqual('Error fetching patch');
  });
});
