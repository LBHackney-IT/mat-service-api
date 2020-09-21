import getNotesById from './getNotes';
import faker from 'faker';
import axios from 'axios';
import { crmToNotes } from '../../mappings/crmToNotes';
import MockCrmNoteResponse from '../../tests/helpers/generateCrmNoteResponse';
jest.mock('axios');

describe('getNotesById', () => {
  beforeEach(() => {
    axios.mockClear();
  });

  it('returns an empty array when no env var is set', async () => {
    const response = await getNotesById(faker.lorem.word());

    expect(response).toEqual([]);
  });

  it('can successfull fetch data from an API', async () => {
    process.env.NEXT_PUBLIC_API_PATH = 'http://localhost:3100/api';

    const data = crmToNotes(MockCrmNoteResponse());

    axios.get.mockResolvedValue(data);

    const response = await getNotesById(faker.lorem.word());

    expect(response).toEqual(data);
  });
});
