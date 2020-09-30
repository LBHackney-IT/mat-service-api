import axios from 'axios';
import getOfficersForManager from './getOfficersForManager';
jest.mock('axios');

describe('getOfficersForManager', () => {
  const dummyEmail = 'testuser@hackney.gov.uk';
  const dummyResponse = { users: [{ id: 'myFakeResponse' }] };

  it(`makes a post to the correct endpoint`, async () => {
    process.env.NEXT_PUBLIC_API_PATH = 'http://localhost:3000/api';

    axios.get.mockResolvedValue({ data: dummyResponse });
    await getOfficersForManager(dummyEmail);
    expect(axios.get).toHaveBeenCalledWith(
      `http://localhost:3000/api/users?managerEmail=${dummyEmail}`
    );
  });

  it(`returns the correct data`, async () => {
    process.env.NEXT_PUBLIC_API_PATH = 'http://localhost:3000/api';
    axios.get.mockResolvedValue({ data: dummyResponse });
    const result = await getOfficersForManager(dummyEmail);
    expect(result).toEqual(dummyResponse.users);
  });
});
