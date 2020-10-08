import {
  mockMatPostgresGateway,
  mockCrmGateway,
} from '../../tests/helpers/mockGateways';
import GetTRAs from '../../usecases/api/getTRAs';
import faker from 'faker';
import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { MatPostgresGatewayInterface } from '../../gateways/matPostgresGateway';
import { isError, isSuccess } from '../../lib/utils';

const mockOfficerName = `${faker.name.firstName()} ${faker.name.lastName()}`;
const mockPatchName = faker.random.word();
const mockEmailAddress = faker.internet.email();
const mockCRMPatchId = faker.random.uuid();
const mockUserGoogleId = faker.random.number();
const mockUserCRMId = faker.random.uuid();
const mockValidUserMapping = {
  username: mockOfficerName,
  emailAddress: mockEmailAddress,
  usercrmid: mockUserCRMId,
  googleId: mockUserGoogleId,
};

const mockTRA = {
  traid: faker.random.number(),
  name: faker.random.word(),
  patchcrmid: mockCRMPatchId,
};

describe('GetTRAs', () => {
  let crmGateway: CrmGatewayInterface;
  let matPostgresGateway: MatPostgresGatewayInterface;
  let getTRAs: GetTRAs;

  beforeEach(() => {
    crmGateway = mockCrmGateway();
    matPostgresGateway = mockMatPostgresGateway();

    getTRAs = new GetTRAs(matPostgresGateway, crmGateway);
  });

  it('Returns a response when no errors are found', async () => {
    matPostgresGateway.getUserMapping = () =>
      Promise.resolve(mockValidUserMapping);
    matPostgresGateway.getTrasByPatchId = () => Promise.resolve([mockTRA]);

    crmGateway.getPatchByOfficerId = () =>
      Promise.resolve({
        body: {
          patchId: mockCRMPatchId,
          patchName: mockPatchName,
          officerName: mockOfficerName,
          officerId: 'dummyId',
          isManager: true,
          areaManagerId: 'dummyAreaManagerId',
          areaId: 5,
        },
        error: undefined,
      });

    const response = await getTRAs.execute(mockEmailAddress);

    expect(isSuccess(response)).toEqual(true);
    expect(response).toEqual({
      patchname: mockPatchName,
      tras: [mockTRA],
      officername: mockOfficerName,
    });
  });

  it('returns error message when email address is not provided', async () => {
    const response = await getTRAs.execute(undefined);

    expect(isError(response)).toEqual(true);
    expect(response.message).toEqual('Error: email address missing');
  });

  it('returns a empty list of TRAs when officer is not linked to a patch', async () => {
    matPostgresGateway.getUserMapping = () =>
      Promise.resolve(mockValidUserMapping);
    matPostgresGateway.getTrasByPatchId = () => Promise.resolve([mockTRA]);

    crmGateway.getPatchByOfficerId = () =>
      Promise.resolve({
        body: {
          patchid: undefined,
          patchname: undefined,
          officername: undefined,
        },
        error: undefined,
      });

    const response = await getTRAs.execute(mockEmailAddress);

    expect(isSuccess(response)).toEqual(true);
    expect(response).toEqual({
      patchname: '',
      tras: [],
      officername: '',
    });
  });
});
