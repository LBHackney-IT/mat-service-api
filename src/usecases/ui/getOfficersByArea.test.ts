import getOfficersByArea from './getOfficersByArea';
import axios from 'axios';
jest.mock('axios');

describe('getOfficersByArea', () => {
  it(`makes a post to the correct endpoint`, async () => {
    process.env.NEXT_PUBLIC_API_PATH = 'http://localhost:3000/api';

    axios.get.mockResolvedValue({});
    await getOfficersByArea(5);
    expect(axios.get).toHaveBeenCalledWith(
      'http://localhost:3000/api/users?managerAreaId=5'
    );
  });
});
