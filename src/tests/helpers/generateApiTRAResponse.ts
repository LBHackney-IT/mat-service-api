import faker from 'faker';

interface ApiTRAResponse {
  data: any[];
  status: number;
  statusText: string;
  headers: Record<string, unknown>;
  config: Record<string, unknown>;
  request: Record<string, unknown>;
}

const mockApiTRAResponse = (): ApiTRAResponse => {
  return {
    data: [
      {
        traid: faker.random.number,
        name: faker.lorem.word(),
        patchcrmid: faker.random.word(),
      },
    ],
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
    request: {},
  };
};

export default mockApiTRAResponse;
