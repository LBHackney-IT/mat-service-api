import sendTaskToOfficer from './sendTaskToOfficer';
import axios from 'axios';
jest.mock('axios');

describe('sendTaskToOfficer', () => {
  beforeEach(() => {
    axios.mockClear();
  });

  const selectedTaskAndOfficer = {
    taskId: 'dummyId',
    housingOfficerId: '123',
  };

  it(`makes a post to the correct endpoint`, async () => {
    process.env.NEXT_PUBLIC_API_PATH = 'http://localhost:3000/api';

    axios.post.mockResolvedValue({});
    const response = await sendTaskToOfficer(selectedTaskAndOfficer);
    expect(response).toEqual(true);
  });

  it('Returns an error', async () => {
    process.env.NEXT_PUBLIC_API_PATH = 'http://localhost:3000/api';

    axios.post.mockImplementationOnce(() => Promise.reject(new Error()));
    const response = await sendTaskToOfficer(selectedTaskAndOfficer);
    expect(response).toEqual(false);
  });
});
