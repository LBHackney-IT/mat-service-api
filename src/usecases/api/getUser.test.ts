import faker from 'faker';
import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { isError, isSuccess } from '../../lib/utils';
import { mockCrmGateway } from '../../tests/helpers/mockGateways';
import GetUser, { GetUserInterface } from './getUser';

describe('GetUser', () => {
  let crmGateway: CrmGatewayInterface;
  let getUser: GetUserInterface;

  beforeEach(() => {
    crmGateway = mockCrmGateway();
    getUser = new GetUser(crmGateway);
  });

  it('returns an error when no user exists', async () => {
    crmGateway.getUserId = () =>
      Promise.resolve({
        body: undefined,
        error: undefined,
      });

    const emailAddress = faker.internet.email();

    const response = await getUser.execute(emailAddress);

    expect(isError(response)).toEqual(true);
    expect(response.message).toEqual('User not found');
  });

  it('returns the error message from crmGateway if there is one', async () => {
    crmGateway.getUserId = () =>
      Promise.resolve({
        body: undefined,
        error: 'NotAuthorised',
      });

    const emailAddress = faker.internet.email();

    const response = await getUser.execute(emailAddress);

    expect(isError(response)).toEqual(true);
    expect(response.message).toEqual('NotAuthorised');
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

    expect(isSuccess(response)).toEqual(true);
    expect(response).toEqual(crmUserGuid);
  });
});
