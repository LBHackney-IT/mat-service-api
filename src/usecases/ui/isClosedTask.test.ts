import axios from 'axios';
import isClosedTask from './isClosedTask';
jest.mock('axios');

describe('isClosedTask', () => {
  it(`makes a post to the correct endpoint`, async () => {
    axios.put.mockResolvedValue({});
    isClosedTask('dummyId');
    expect(axios.put).toHaveBeenCalledWith('/api/tasks/dummyId/closeTask');
  });
});
