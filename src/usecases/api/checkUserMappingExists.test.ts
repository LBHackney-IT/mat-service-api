import MatPostgresGateway from '../../gateways/matPostgresGateway';
import faker from 'faker';
import CheckUserMappingExists from './checkUserMappingExists';
jest.mock('../../gateways/matPostgresGateway');

describe('checkUserMappingExists', () => {
  beforeEach(() => {
    MatPostgresGateway.mockClear();
  });

  it('Returns a false response when no errors are found and there are no results', async () => {
    MatPostgresGateway.mockImplementationOnce(() => {
      return {
        getUserMapping: () => ({
          body: undefined,
          error: undefined,
        }),
      };
    });

    const emailAddress = faker.internet.email();
    const checkUserMappingExists = new CheckUserMappingExists(emailAddress);
    const response = await checkUserMappingExists.execute();

    expect(MatPostgresGateway).toHaveBeenCalledTimes(1);
    expect(response).toEqual({ body: false, error: undefined });
  });

  it('Returns a true response when no errors are found and there is a result', async () => {
    const emailAddress = faker.internet.email();
    const randomUserMapping = {
      name: faker.lorem.word(),
      emailAddress,
      usercrmid: faker.lorem.word(),
      googleId: faker.lorem.word(),
    };

    MatPostgresGateway.mockImplementationOnce(() => {
      return {
        getUserMapping: () => ({
          body: randomUserMapping,
          error: undefined,
        }),
      };
    });

    const checkUserMappingExists = new CheckUserMappingExists(emailAddress);
    const response = await checkUserMappingExists.execute();

    expect(MatPostgresGateway).toHaveBeenCalledTimes(1);
    expect(response).toEqual({ body: true, error: undefined });
  });

  it('Returns a false response and an error when an error is returned', async () => {
    MatPostgresGateway.mockImplementationOnce(() => {
      return {
        getUserMapping: () => ({
          body: [],
          error: 500,
        }),
      };
    });

    const emailAddress = faker.internet.email();
    const checkUserMappingExists = new CheckUserMappingExists(emailAddress);
    const response = await checkUserMappingExists.execute();

    expect(MatPostgresGateway).toHaveBeenCalledTimes(1);
    expect(response).toEqual({ body: false, error: 500 });
  });
});
