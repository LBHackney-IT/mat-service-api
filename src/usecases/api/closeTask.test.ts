import CloseTask, { CloseTaskInterface } from './closeTask';
import {
  mockCrmGateway,
  mockMatPostgresGateway,
  mockV1MatApiGateway,
} from '../../tests/helpers/mockGateways';
import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { V1MatAPIGatewayInterface } from '../../gateways/v1MatAPIGateway';
import { MatPostgresGatewayInterface } from '../../gateways/matPostgresGateway';
import { isError } from '../../lib/utils';

describe('sendTaskToManager', () => {
  let crmGateway: CrmGatewayInterface;
  let matPostgresGateway: MatPostgresGatewayInterface;
  let v1ApiGateway: V1MatAPIGatewayInterface;
  let useCase: CloseTaskInterface;
  let dummyTaskId = 'abc-123-def';

  const fakeTaskResponse = { incidentId: 'fakeIncidentId' };
  const fakeUserMappingResponse = {
    usercrmid: 'fakeCrmId',
    username: 'Fake User',
    emailAddress: 'me@me.com',
    googleId: '123',
  };
  const fakePatchResponse = {
    body: {
      areaManagerId: 'fakeAreaManagerId',
      areaId: 5,
    },
  };

  beforeEach(() => {
    crmGateway = mockCrmGateway();
    crmGateway.getTask = () => Promise.resolve(fakeTaskResponse);

    matPostgresGateway = mockMatPostgresGateway();
    matPostgresGateway.getUserMapping = () =>
      Promise.resolve(fakeUserMappingResponse);

    v1ApiGateway = mockV1MatApiGateway();
    v1ApiGateway.patchTenancyManagementInteraction = jest.fn(() =>
      Promise.resolve({ body: true })
    );

    useCase = new CloseTask(crmGateway, v1ApiGateway, matPostgresGateway);
  });

  it('Should assemble the correct TMI data to send to the API', async () => {
    const result = await useCase.execute(
      dummyTaskId,
      fakeUserMappingResponse.emailAddress
    );
    expect(result).toEqual(true);
    expect(v1ApiGateway.patchTenancyManagementInteraction).toHaveBeenCalledWith(
      {
        estateOfficerId: 'fakeCrmId',
        estateOfficerName: 'Fake User',
        interactionId: 'abc-123-def',
        serviceRequest: {
          description: 'Closed task',
          id: 'fakeIncidentId',
          requestCallback: false,
        },
        status: 0,
      }
    );
  });

  it("Should return an error if it can't fetch the task from crm", async () => {
    crmGateway.getTask = () => Promise.resolve(new Error('No task found'));
    const result = await useCase.execute(
      dummyTaskId,
      fakeUserMappingResponse.emailAddress
    );
    expect(isError(result)).toEqual(true);
    expect(result.message).toEqual('Error fetching task from crm');
  });

  it("Should return an error if it can't fetch the mapped user from postgres", async () => {
    matPostgresGateway.getUserMapping = () => Promise.resolve(null);
    const result = await useCase.execute(
      dummyTaskId,
      fakeUserMappingResponse.emailAddress
    );
    expect(isError(result)).toEqual(true);
    expect(result.message).toEqual('Error fetching mapped user');
  });

  it("Should return an error if it can't update the task via v1 api", async () => {
    v1ApiGateway.patchTenancyManagementInteraction = jest.fn(() =>
      Promise.resolve(new Error())
    );
    const result = await useCase.execute(
      dummyTaskId,
      fakeUserMappingResponse.emailAddress
    );
    expect(isError(result)).toEqual(true);
    expect(result.message).toEqual('Unknown error closing task');
  });
});
