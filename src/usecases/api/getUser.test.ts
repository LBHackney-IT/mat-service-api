import faker from 'faker';
import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { mockCrmGateway } from '../../tests/helpers/mockGateways';
import GetUser, { GetUserInterface } from './getUser';

describe('GetUser', () => {
  let crmGateway: CrmGatewayInterface;
  let getUser: GetUserInterface;

  beforeEach(() => {
    crmGateway = mockCrmGateway();
    getUser = new GetUser(crmGateway);
  });

  it('returns 404 when no user exists', async () => {
    crmGateway.getUserId = () =>
      Promise.resolve({
        body: undefined,
        error: undefined,
      });

    const emailAddress = faker.internet.email();

    const response = await getUser.execute(emailAddress);

    expect(response).toEqual({ body: undefined, error: 404 });
  });

  it('returns a 401 if the error is NotAuthorised', async () => {
    crmGateway.getUserId = () =>
      Promise.resolve({
        body: undefined,
        error: 'NotAuthorised',
      });

    const emailAddress = faker.internet.email();

    const response = await getUser.execute(emailAddress);

    expect(response).toEqual({ body: undefined, error: 401 });
  });

  it('returns a 500 for any other error', async () => {
    crmGateway.getUserId = () =>
      Promise.resolve({
        body: undefined,
        error: faker.lorem.word(),
      });

    const emailAddress = faker.internet.email();

    const response = await getUser.execute(emailAddress);

    expect(response).toEqual({ body: undefined, error: 500 });
  });

  it('returns a user guid when the user exists', async () => {
    const crmUserGuid = faker.lorem.word();
    crmGateway.getUserId = () =>
      Promise.resolve({
        body: crmUserGuid,
        error: undefined,
      });

    const emailAddress = faker.internet.email();

    const response = await getUser.execute(emailAddress);

    expect(response).toEqual({ body: crmUserGuid, error: undefined });
  });
});
