import { mockCrmGateway } from '../../tests/helpers/mockGateways';
import faker from 'faker';
import CreateUser from './createUser';
import { CrmGatewayInterface } from '../../gateways/crmGateway';

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

    expect(response).toEqual({ body: crmId, error: undefined });
  });
});
