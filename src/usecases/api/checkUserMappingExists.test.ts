import faker from 'faker';
import {
  GetUserMappingResponse,
  MatPostgresGatewayInterface,
} from '../../gateways/matPostgresGateway';
import { isSuccess } from '../../lib/utils';
import { mockMatPostgresGateway } from '../../tests/helpers/mockGateways';
import CheckUserMappingExists, {
  CheckUserMappingExistsInterface,
} from './checkUserMappingExists';

jest.mock('../../gateways/matPostgresGateway');

describe('checkUserMappingExists', () => {
  let matPostgresGateway: MatPostgresGatewayInterface;
  let checkUserMappingExists: CheckUserMappingExistsInterface;

  beforeEach(() => {
    matPostgresGateway = mockMatPostgresGateway();
    checkUserMappingExists = new CheckUserMappingExists(matPostgresGateway);
  });

  it('Returns a false response when no errors are found and there are no results', async () => {
    matPostgresGateway.getUserMapping = () =>
      Promise.resolve({
        body: undefined,
        error: undefined,
      });

    const emailAddress = faker.internet.email();
    const response = await checkUserMappingExists.execute(emailAddress);

    expect(isSuccess(response)).toBe(true);
    expect(response).toEqual(false);
  });

  it('Returns a true response when no errors are found and there is a result', async () => {
    const emailAddress = faker.internet.email();
    const randomUserMapping = {
      username: faker.lorem.word(),
      emailAddress,
      usercrmid: faker.lorem.word(),
      googleId: faker.lorem.word(),
    };

    matPostgresGateway.getUserMapping = () =>
      Promise.resolve({
        body: randomUserMapping,
        error: undefined,
      });

    const response = await checkUserMappingExists.execute(emailAddress);

    expect(isSuccess(response)).toBe(true);
    expect(response).toEqual(true);
  });

  it('Returns a false response and an error when an error is returned', async () => {
    matPostgresGateway.getUserMapping = () =>
      Promise.resolve({
        body: [],
        error: 500,
      });

    const emailAddress = faker.internet.email();
    const response = await checkUserMappingExists.execute(emailAddress);

    expect(response).toEqual(false);
  });
});
