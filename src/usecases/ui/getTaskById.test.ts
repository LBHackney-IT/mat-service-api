import getTaskById from './getTaskById';
import faker from 'faker';
import axios from 'axios';
import MockTask from '../../tests/helpers/generateTask';
jest.mock('axios');

describe('getTaskById', () => {
  beforeEach(() => {
    axios.mockClear();
  });

  it('returns an undefined when no env var is set', async () => {
    const response = await getTaskById(faker.lorem.word());

    expect(response).toEqual(undefined);
  });

  it('can successfully fetch data from an API', async () => {
    process.env.NEXT_PUBLIC_API_PATH = 'http://localhost:3000/api';

    const data = { data: MockTask() };

    axios.get.mockResolvedValue(data);

    const response = await getTaskById(faker.lorem.word());

    expect(response).toEqual(data.data);
  });
});
