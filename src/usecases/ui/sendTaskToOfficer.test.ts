import sendTaskToOfficer from './sendTaskToOfficer';
import axios from 'axios';
jest.mock('axios');

describe('sendTaskToOfficer', () => {
  const fakeInputs = {
    taskId: 'dummyId',
    housingOfficerId: '123',
  };

  it(`makes a post to the correct endpoint`, async () => {
    axios.post.mockResolvedValue({});
    sendTaskToOfficer(fakeInputs);
    expect(axios.post).toHaveBeenCalledWith(
      '/api/tasks/dummyId/sendTaskToOfficer'
    );
  });
});
