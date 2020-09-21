import getOfficersByArea from './getOfficersByArea';
import axios from 'axios';
jest.mock('axios');

describe('sendTaskToOfficer', () => {
  it(`makes a post to the correct endpoint`, async () => {
    axios.post.mockResolvedValue({});
    getOfficersByArea('dummyId');
    expect(axios.post).toHaveBeenCalledWith('/api/tasks/dummyId/users');
  });
});
