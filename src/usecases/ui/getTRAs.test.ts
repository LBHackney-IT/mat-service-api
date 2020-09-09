import getTRAs from './getTRAs';
import axios from 'axios';
import faker from 'faker';
import getEmailAddress from './getEmailAddress';
import apiTRAToUiTRA from '../../mappings/apiTRAToUiTRA';

jest.mock('axios');
jest.mock('./getEmailAddress.ts');
jest.mock('../../mappings/apiTRAToUiTRA.ts');

const mockCRMPatchId = faker.random.uuid();
const mockCRMPatchId2 = faker.random.uuid();
const mockPatchName = faker.random.word();
const mockOfficerName = `${faker.name.firstName()} ${faker.name.lastName()}`;

const mockTRAsFromAPI = [
  {
    traid: 1,
    name: mockPatchName,
    patchid: mockCRMPatchId,
  },
  {
    traid: 2,
    name: mockPatchName,
    patchid: mockCRMPatchId2,
  },
];

const mockMappedTRAs = [
  {
    id: 1,
    name: mockPatchName,
    patchid: mockCRMPatchId,
  },
  {
    id: 2,
    name: mockPatchName,
    patchid: mockCRMPatchId2,
  },
];

describe('getTRAs', () => {
  beforeEach(() => {
    axios.mockClear();
  });

  it('successfully fetches data from an API', async () => {
    const data = {
      data: {
        patchname: mockPatchName,
        tras: mockTRAsFromAPI,
        officername: mockOfficerName,
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
      request: {},
    };

    axios.get.mockResolvedValue(data);

    process.env.NEXT_PUBLIC_API_PATH = 'http://localhost:3000/api';

    getEmailAddress.mockReturnValueOnce(faker.internet.email);
    apiTRAToUiTRA.mockReturnValueOnce(mockMappedTRAs);

    const response = await getTRAs();

    expect(response).toEqual({
      tras: mockMappedTRAs,
      officername: mockOfficerName,
      patchname: mockPatchName,
    });
  });

  it('returns a empty list of TRAs when users email is not available', async () => {
    getEmailAddress.mockReturnValueOnce(undefined);
    const response = await getTRAs();
    expect(response).toEqual({
      tras: [],
      officername: '',
      patchname: '',
    });
  });
});
