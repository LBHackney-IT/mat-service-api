import GetOfficerPatch from './getOfficerPatch';
import faker from 'faker';
import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { MatPostgresGatewayInterface } from '../../gateways/matPostgresGateway';
import {
  mockCrmGateway,
  mockMatPostgresGateway,
} from '../../tests/helpers/mockGateways';
import { isError, isSuccess } from '../../lib/utils';

const mockEmailAddress = faker.internet.email();
const mockName = `${faker.name.firstName()} ${faker.name.lastName()}`;
const mockOfficerCrmId = faker.random.uuid();
const mockOfficerGoogleId = faker.random.uuid();
const mockPatchId = faker.random.uuid();

//dummy function for gateway methods that don't require implementation in tests
const dummyMock = jest.fn(async () => ({}));

describe('GetOfficerPatch', () => {
  let crmGateway: CrmGatewayInterface;
  let matPostgresGateway: MatPostgresGatewayInterface;
  beforeEach(() => {
    crmGateway = mockCrmGateway();
    matPostgresGateway = mockMatPostgresGateway();
  });

  it('Should retrieve user mapping details and get the id for the associated patch', async () => {
    matPostgresGateway.getUserMapping = jest.fn(() =>
      Promise.resolve({
        name: mockName,
        emailAddress: mockEmailAddress,
        usercrmid: mockOfficerCrmId,
        googleId: mockOfficerGoogleId,
      })
    );

    crmGateway.getPatchByOfficerId = jest.fn(() =>
      Promise.resolve({
        patchId: mockPatchId,
        patchName: undefined,
        officerName: undefined,
        officerId: mockOfficerCrmId,
        isManager: undefined,
        areaManagerId: undefined,
        areaId: undefined,
      })
    );

    const getOfficerPatchUseCase = new GetOfficerPatch(
      crmGateway,
      matPostgresGateway
    );

    const response = await getOfficerPatchUseCase.execute(mockEmailAddress);

    expect(matPostgresGateway.getUserMapping).toHaveBeenCalledTimes(1);
    expect(crmGateway.getPatchByOfficerId).toHaveBeenCalledTimes(1);

    expect(isSuccess(response)).toEqual(true);
    expect(response.officerId).toEqual(mockOfficerCrmId);
    expect(response.patchId).toEqual(mockPatchId);
  });

  it("Should return an error when user doesn't have a crmid", async () => {
    matPostgresGateway.getUserMapping = jest.fn(() =>
      Promise.resolve({
        name: mockName,
        emailAddress: mockEmailAddress,
        usercrmid: undefined,
        googleId: mockOfficerGoogleId,
      })
    );

    const getOfficerPatchUseCase = new GetOfficerPatch(
      crmGateway,
      matPostgresGateway
    );

    const response = await getOfficerPatchUseCase.execute(mockEmailAddress);

    expect(matPostgresGateway.getUserMapping).toHaveBeenCalledTimes(1);
    expect(crmGateway.getPatchByOfficerId).toHaveBeenCalledTimes(0);
    expect(isError(response)).toEqual(true);
    expect(response.message).toEqual('Could not find officer in db');
  });
});
