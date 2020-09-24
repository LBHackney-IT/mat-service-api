import createNote from './createNote';
import axios from 'axios';
import faker from 'faker';
import MockCreateNote from '../../tests/helpers/generateCreateNote';
import createUserMapping from './createUserMapping';
jest.mock('axios');

describe('createNote', () => {
  beforeEach(() => {
    axios.mockClear();
  });

  const note = MockCreateNote();

  it('returns false when no env var is set', async () => {
    const response = await createNote(note);

    expect(response).toEqual(false);
  });

  it('returns true on a success response from the API', async () => {
    process.env.NEXT_PUBLIC_API_PATH = 'http://localhost:3100/api';

    axios.post.mockResolvedValue(true);

    const response = await createNote(note);

    expect(response).toEqual(true);
  });

  it('returns false on a fail response from the API', async () => {
    process.env.NEXT_PUBLIC_API_PATH = 'http://localhost:3100/api';

    axios.post.mockImplementationOnce(() => Promise.reject(new Error()));

    const response = await createNote(note);

    expect(response).toEqual(false);
  });
});
