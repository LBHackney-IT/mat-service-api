import createCrmUser from './createCrmUser';
import axios from 'axios';
import faker from 'faker';
import { use } from 'chai';
jest.mock('axios');

describe('createCrmUser', () => {
  beforeEach(() => {
    axios.mockClear();
  });

  const firstName = faker.name.firstName();
  const familyName = faker.name.lastName();
  const user = {
    fullName: `${firstName} ${familyName}`,
    emailAddress: faker.internet.email(),
    firstName,
    familyName,
  };

  it('returns false when no env var is set', async () => {
    const response = await createCrmUser(user);

    expect(response).toEqual(false);
  });

  it('responds with a GUID for the new user when successful', async () => {
    process.env.NEXT_PUBLIC_API_PATH = 'http://localhost:3000/api';

    const crmGuid = faker.lorem.word();
    axios.post.mockResolvedValue(crmGuid);

    const response = await createCrmUser(user);
    expect(response).toEqual(crmGuid);
  });

  it('responds with false when a failure is received', async () => {
    process.env.NEXT_PUBLIC_API_PATH = 'http://localhost:3000/api';

    const crmGuid = faker.lorem.word();
    axios.post.mockImplementationOnce(() => Promise.reject(new Error()));

    const response = await createCrmUser(user);
    expect(response).toEqual(false);
  });
});
