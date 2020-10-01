import { crmGateway } from '../../gateways';
import faker from 'faker';
import CreateUser from './createUser';

describe('createUser', () => {
  it('Returns a guid and error undefined if the creation was successful', async () => {
    const crmId = faker.lorem.word();
    crmGateway.createUser = () =>
      Promise.resolve({
        body: crmId,
        error: undefined,
      });

    const firstName = faker.name.firstName();
    const familyName = faker.name.lastName();
    const user = {
      firstName: firstName,
      familyName: familyName,
      fullName: `${firstName} ${familyName}`,
      emailAddress: faker.internet.email(),
    };

    const createUser = new CreateUser(user);
    const response = await createUser.execute();

    expect(response).toEqual({ body: crmId, error: undefined });
  });
});
