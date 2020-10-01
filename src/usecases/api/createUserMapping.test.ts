import faker from 'faker';
import CreateUserMapping from './createUserMapping';
import { mockMatPostgresGateway } from '../../tests/helpers/mockGateways';

describe('createUserMapping', () => {
  let matPostgresGateway: MatPostgresGatewayInterface;

  beforeEach(() => {
    matPostgresGateway = mockMatPostgresGateway();
  });

  it('Returns error undefined if the creation was successful', async () => {
    matPostgresGateway.createUserMapping = () =>
      Promise.resolve({
        error: undefined,
      });

    const emailAddress = faker.internet.email();
    const randomUserMapping = {
      name: faker.lorem.word(),
      emailAddress,
      usercrmid: faker.lorem.word(),
      googleId: faker.lorem.word(),
    };

    const createUserMapping = new CreateUserMapping(matPostgresGateway);
    const response = await createUserMapping.execute(randomUserMapping);

    expect(response).toEqual({ error: undefined });
  });

  it('Returns a 500 error if there is an issue with the creation', async () => {
    matPostgresGateway.createUserMapping = () =>
      Promise.resolve({
        error: 500,
      });

    const randomUserMapping = {
      name: faker.lorem.word(),
      usercrmid: faker.lorem.word(),
      googleId: faker.lorem.word(),
      emailAddress: undefined,
    };

    const createUserMapping = new CreateUserMapping(matPostgresGateway);
    const response = await createUserMapping.execute();

    expect(response).toEqual({ error: 500 });
  });
});
