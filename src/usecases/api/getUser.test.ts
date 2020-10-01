import { crmGateway } from '../../gateways';
import faker from 'faker';
import GetUser from './getUser';

describe('GetUser', () => {
  it('returns 404 when no user exists', async () => {
    crmGateway.getUserId = () =>
      Promise.resolve({
        body: undefined,
        error: undefined,
      });

    const emailAddress = faker.internet.email();

    const getUser = new GetUser(emailAddress);
    const response = await getUser.execute();

    expect(response).toEqual({ body: undefined, error: 404 });
  });

  it('returns a 401 if the error is NotAuthorised', async () => {
    crmGateway.getUserId = () =>
      Promise.resolve({
        body: undefined,
        error: 'NotAuthorised',
      });

    const emailAddress = faker.internet.email();

    const getUser = new GetUser(emailAddress);
    const response = await getUser.execute();

    expect(response).toEqual({ body: undefined, error: 401 });
  });

  it('returns a 500 for any other error', async () => {
    crmGateway.getUserId = () =>
      Promise.resolve({
        body: undefined,
        error: faker.lorem.word(),
      });

    const emailAddress = faker.internet.email();

    const getUser = new GetUser(emailAddress);
    const response = await getUser.execute();

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

    const getUser = new GetUser(emailAddress);
    const response = await getUser.execute();

    expect(response).toEqual({ body: crmUserGuid, error: undefined });
  });
});
