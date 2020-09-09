import CrmGateway from '../../gateways/crmGateway';
import MatPostgresGateway from '../../gateways/matPostgresGateway';
import GetTRAs from '../../usecases/api/getTRAs';
import faker from 'faker';

jest.mock('../../gateways/crmGateway.ts');
jest.mock('../../gateways/matPostgresGateway.ts');

const mockOfficerName = `${faker.name.firstName()} ${faker.name.lastName()}`;
const mockPatchName = faker.random.word();
const mockEmailAddress = faker.internet.email();
const mockCRMPatchId = faker.random.uuid();
const mockUserGoogleId = faker.random.number();
const mockUserCRMId = faker.random.uuid();
const mockValidUserMapping = {
  name: mockOfficerName,
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
  beforeEach(() => {
    CrmGateway.mockClear();
    MatPostgresGateway.mockClear();
  });

  it('Returns a response when no errors are found', async () => {
    MatPostgresGateway.mockImplementationOnce(() => {
      return {
        getUserMapping: () => ({
          //userMappingTable
          body: mockValidUserMapping,
          error: undefined,
        }),
        getTrasByPatchId: () => ({
          body: [mockTRA],
          error: undefined,
        }),
      };
    });

    CrmGateway.mockImplementationOnce(() => {
      return {
        getPatchByOfficerId: () => ({
          body: {
            patchid: mockCRMPatchId,
            patchname: mockPatchName,
            officername: mockOfficerName,
          },
          error: undefined,
        }),
      };
    });

    const getTRAs = new GetTRAs(mockEmailAddress);
    const response = await getTRAs.execute();

    expect(MatPostgresGateway).toHaveBeenCalledTimes(1);
    expect(CrmGateway).toHaveBeenCalledTimes(1);

    expect(response).toEqual({
      body: {
        patchname: mockPatchName,
        tras: [mockTRA],
        officername: mockOfficerName,
      },
      error: undefined,
    });
  });

  it('returns status code 400 when email address is not provided', async () => {
    const getTRAs = new GetTRAs();
    const response = await getTRAs.execute();

    expect(MatPostgresGateway).toHaveBeenCalledTimes(0);
    expect(CrmGateway).toHaveBeenCalledTimes(0);

    expect(response).toEqual({
      body: undefined,
      error: 400,
    });
  });

  it('returns status code 500 when MatPostgresGateway throws an error', async () => {
    MatPostgresGateway.mockImplementationOnce(() => {
      throw new Error();
    });

    const getTRAs = new GetTRAs(mockEmailAddress);
    const response = await getTRAs.execute();

    expect(MatPostgresGateway).toHaveBeenCalledTimes(1);
    expect(CrmGateway).toHaveBeenCalledTimes(0);

    expect(response).toEqual({
      body: undefined,
      error: 500,
    });
  });

  it('returns status code 500 when CRMGateway throws an error', async () => {
    MatPostgresGateway.mockImplementationOnce(() => {
      return {
        getUserMapping: () => ({
          body: mockValidUserMapping,
          error: undefined,
        }),
        getTrasByPatchId: () => ({
          body: [mockTRA],
          error: undefined,
        }),
      };
    });

    CrmGateway.mockImplementationOnce(() => {
      throw new Error();
    });

    const getTRAs = new GetTRAs(mockEmailAddress);
    const response = await getTRAs.execute();

    expect(MatPostgresGateway).toHaveBeenCalledTimes(1);
    expect(CrmGateway).toHaveBeenCalledTimes(1);

    expect(response).toEqual({
      body: undefined,
      error: 500,
    });
  });

  it('returns a empty list of TRAs when officer is not linked to a patch', async () => {
    MatPostgresGateway.mockImplementationOnce(() => {
      return {
        getUserMapping: () => ({
          body: mockValidUserMapping,
          error: undefined,
        }),
        getTrasByPatchId: () => ({
          body: [mockTRA],
          error: undefined,
        }),
      };
    });

    CrmGateway.mockImplementationOnce(() => {
      return {
        getPatchByOfficerId: () => ({
          body: {
            patchid: undefined,
            patchname: undefined,
            officername: undefined,
          },
          error: undefined,
        }),
      };
    });

    const getTRAs = new GetTRAs(mockEmailAddress);
    const response = await getTRAs.execute();

    expect(MatPostgresGateway).toHaveBeenCalledTimes(1);
    expect(CrmGateway).toHaveBeenCalledTimes(1);

    expect(response).toEqual({
      body: {
        patchname: '',
        tras: [],
        officername: '',
      },
      error: undefined,
    });
  });
});
