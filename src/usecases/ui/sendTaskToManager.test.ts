import sendTaskToManager from './sendTaskToManager';
import axios from 'axios';
jest.mock('axios');

describe('sendTaskToManager', () => {
  it(`makes a post to the correct endpoint`, async () => {
    axios.post.mockResolvedValue({});
    sendTaskToManager('dummyId');
    expect(axios.post).toHaveBeenCalledWith('/api/tasks/dummyId/sendToManager');
  });
});
