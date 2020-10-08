import SendTaskToOfficerUseCase from './sendTaskToOfficer';
import {
  mockCrmGateway,
  mockMatPostgresGateway,
  mockV1MatApiGateway,
} from '../../tests/helpers/mockGateways';
import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { V1MatAPIGatewayInterface } from '../../gateways/v1MatAPIGateway';
import { MatPostgresGatewayInterface } from '../../gateways/matPostgresGateway';
import MockTask from '../../tests/helpers/generateTask';
import { isError, isSuccess } from '../../lib/utils';

describe('sendTaskToOfficer', () => {
  let crmGateway: CrmGatewayInterface;
  let matPostgresGateway: MatPostgresGatewayInterface;
  let v1ApiGateway: V1MatAPIGatewayInterface;
  let useCase: SendTaskToOfficerUseCase;
  let dummyTaskId = 'abc-123-def';
  let dummyToken = {
    name: 'Fake User',
    email: 'fakeuser@hackney.gov.uk',
  };

  // const dummyTask = MockTask();
  const fakeTaskResponse = {
    body: MockTask(),
  };
  const fakeUserMappingResponse = {
    usercrmid: 'fakeCrmId',
    username: 'Fake User',
    email: 'me@me.com',
  };
  const fakePatchResponse = {
    body: {
      areaManagerId: 'fakeAreaManagerId',
      areaId: 5,
      patchId: 'fakePatchId',
    },
  };

  beforeEach(() => {
    crmGateway = mockCrmGateway();
    crmGateway.getTask = () => Promise.resolve(fakeTaskResponse);
    crmGateway.getPatchByOfficerId = () => Promise.resolve(fakePatchResponse);
    matPostgresGateway = mockMatPostgresGateway();

    v1ApiGateway = mockV1MatApiGateway();
    (v1ApiGateway.transferCall = jest.fn(() =>
      Promise.resolve({ body: true })
    )),
      (useCase = new SendTaskToOfficerUseCase(
        crmGateway,
        v1ApiGateway,
        matPostgresGateway
      ));
  });

  it('Should assemble the correct  data to send to the API', async () => {
    const result = await useCase.execute(
      dummyTaskId,
      dummyToken,
      'dummyOfficerId'
    );
    expect(isSuccess(result)).toEqual(true);
    expect(v1ApiGateway.transferCall).toHaveBeenCalledWith({
      areaName: 5,
      estateOfficerId: 'dummyOfficerId',
      estateOfficerName: 'Fake User',
      interactionId: 'abc-123-def',
      officerPatchId: 'fakePatchId',
      serviceRequest: {
        description: 'Transferred from: Fake User',
        requestCallback: false,
        id: fakeTaskResponse.body.incidentId,
      },
    });
  });

  it("Should return an error if it can't fetch the task from crm", async () => {
    crmGateway.getTask = jest.fn();
    const result = await useCase.execute(
      dummyTaskId,
      fakeUserMappingResponse.email,
      'dummyOfficerId'
    );
    expect(isError(result)).toEqual(true);
    expect(result.message).toEqual('Error fetching task from crm');
  });

  it("Should return an error if it can't fetch the patch from crm", async () => {
    crmGateway.getPatchByOfficerId = jest.fn();
    const result = await useCase.execute(
      dummyTaskId,
      fakeUserMappingResponse.email,
      'dummyOfficerId'
    );
    expect(isError(result)).toEqual(true);
    expect(result.message).toEqual('Error fetching patch');
  });
});
