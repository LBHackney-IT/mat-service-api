import { mockCrmGateway } from '../../tests/helpers/mockGateways';
import faker from 'faker';
import CreateUser from './createUser';
import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { isError } from '../../lib/utils';

describe('createUser', () => {
  let crmGateway: CrmGatewayInterface;

  beforeEach(() => {
    crmGateway = mockCrmGateway();
  });

  it('Returns a guid and error undefined if the creation was successful', async () => {
    const crmId = faker.lorem.word();
    crmGateway.createUser = () =>
      Promise.resolve({
        body: crmId,
        error: undefined,
      });

    const firstName = faker.name.firstName();
    const familyName = faker.name.lastName();

    const createUser = new CreateUser(crmGateway);
    const response = await createUser.execute(
      faker.internet.email(),
      `${firstName} ${familyName}`,
      firstName,
      familyName
    );

    expect(response).toEqual(crmId);
  });

  it('Returns an error if the creation was unsuccessful', async () => {
    const crmId = faker.lorem.word();
    crmGateway.createUser = () =>
      Promise.resolve({
        error: 'ERROR',
      });

    const firstName = faker.name.firstName();
    const familyName = faker.name.lastName();

    const createUser = new CreateUser(crmGateway);
    const response = await createUser.execute(
      faker.internet.email(),
      `${firstName} ${familyName}`,
      firstName,
      familyName
    );

    expect(isError(response)).toEqual(true);
    expect(response.message).toEqual('ERROR');
  });
});
