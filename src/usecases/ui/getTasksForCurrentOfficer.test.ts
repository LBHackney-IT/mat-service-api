import getTasksForCurrentOfficer from './getTasksForCurrentOfficer';
import axios from 'axios';
import mockApiTaskResponse from '../../tests/helpers/generateApiTaskResponse';
import apiTaskToUiTask from '../../mappings/apiTaskToUiTask';
import getEmailAddress from './getEmailAddress';
import faker from 'faker';

jest.mock('axios');
jest.mock('../../mappings/apiTaskToUiTask');
jest.mock('./getEmailAddress');

describe('getTasksForCurrentOfficer', () => {
  beforeEach(() => {
    axios.mockClear();
  });

  it('returns an empty array when api path environment variable is not set', async () => {
    getEmailAddress.mockReturnValueOnce(faker.internet.email());
    const response = await getTasksForCurrentOfficer();
    expect(response).toEqual([]);
  });

  it("returns an empty array when user's email address is not available", async () => {
    const data = mockApiTaskResponse();
    axios.get.mockResolvedValue(data);

    process.env.NEXT_PUBLIC_API_PATH = 'http://localhost:3000/api';

    const response = await getTasksForCurrentOfficer();

    expect(response).toEqual([]);
  });

  it('successfully fetches data from an API', async () => {
    const data = mockApiTaskResponse();
    axios.get.mockResolvedValue(data);

    process.env.NEXT_PUBLIC_API_PATH = 'http://localhost:3000/api';

    const mappedTasks = apiTaskToUiTask(data.data);

    getEmailAddress.mockReturnValueOnce(faker.internet.email());
    apiTaskToUiTask.mockReturnValueOnce(mappedTasks);

    const response = await getTasksForCurrentOfficer();

    expect(response).toEqual(apiTaskToUiTask(data.data));
  });
});
