import GetOfficerPatch from './getOfficerPatch';
import faker from 'faker';
import { CrmGatewayInterface } from '../../gateways/crmGateway';
import MatPostgresGateway, {
  MatPostgresGatewayInterface,
} from '../../gateways/matPostgresGateway';
import {
  mockCrmGateway,
  mockMatPostgresGateway,
} from '../../tests/helpers/mockGateways';

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
        body: {
          name: mockName,
          emailAddress: mockEmailAddress,
          usercrmid: mockOfficerCrmId,
          googleId: mockOfficerGoogleId,
        },
        error: undefined,
      })
    );

    crmGateway.getPatchByOfficerId = jest.fn(() =>
      Promise.resolve({
        body: {
          patchId: mockPatchId,
          patchName: undefined,
          officerName: undefined,
          officerId: mockOfficerCrmId,
          isManager: undefined,
          areaManagerId: undefined,
          areaId: undefined,
        },
        error: undefined,
      })
    );

    const getOfficerPatchUseCase = new GetOfficerPatch(
      crmGateway,
      matPostgresGateway
    );

    const response = await getOfficerPatchUseCase.execute(mockEmailAddress);

    expect(matPostgresGateway.getUserMapping).toHaveBeenCalledTimes(1);
    expect(crmGateway.getPatchByOfficerId).toHaveBeenCalledTimes(1);

    expect(response.body.officerId).toEqual(mockOfficerCrmId);
    expect(response.body.patchId).toEqual(mockPatchId);
  });

  it("Should return 404 when user doesn't have a crmid", async () => {
    //mock responce form mat gw
    matPostgresGateway.getUserMapping = jest.fn(() =>
      Promise.resolve({
        body: {
          name: mockName,
          emailAddress: mockEmailAddress,
          usercrmid: undefined,
          googleId: mockOfficerGoogleId,
        },
        error: undefined,
      })
    );

    const getOfficerPatchUseCase = new GetOfficerPatch(
      crmGateway,
      matPostgresGateway
    );

    const response = await getOfficerPatchUseCase.execute(mockEmailAddress);

    expect(matPostgresGateway.getUserMapping).toHaveBeenCalledTimes(1);
    expect(crmGateway.getPatchByOfficerId).toHaveBeenCalledTimes(0);
    expect(response.error).toEqual(404);
  });

  it('Should return undefined when officer is not associated with a patch in CRM', async () => {
    //mock responce form mat gw
    matPostgresGateway.getUserMapping = jest.fn(() =>
      Promise.resolve({
        body: {
          name: mockName,
          emailAddress: mockEmailAddress,
          usercrmid: mockOfficerCrmId,
          googleId: mockOfficerGoogleId,
        },
        error: undefined,
      })
    );

    //mock response from crm gw method
    crmGateway.getPatchByOfficerId = jest.fn(() =>
      Promise.resolve({
        body: {
          patchId: undefined,
          patchName: undefined,
          officerName: undefined,
          officerId: mockOfficerCrmId,
          isManager: undefined,
          areaManagerId: undefined,
          areaId: undefined,
        },
        error: undefined,
      })
    );

    const getOfficerPatchUseCase = new GetOfficerPatch(
      crmGateway,
      matPostgresGateway
    );

    const response = await getOfficerPatchUseCase.execute(mockEmailAddress);

    expect(matPostgresGateway.getUserMapping).toHaveBeenCalledTimes(1);
    expect(crmGateway.getPatchByOfficerId).toHaveBeenCalledTimes(1);
    expect(response.error).toEqual(undefined);
  });
});
