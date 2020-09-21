import faker from 'faker';
import { Officer } from '../../mappings/crmToOfficersDetails';
import GetOfficersPerArea from '../../usecases/api/getOfficersPerArea';

jest.mock('../../gateways/crmGateway');

const dummyMock = jest.fn(async () => ({}));

describe('GetOfficersPerArea', () => {
  it('Returns a list of officers when no errors are found', async () => {
    const mockOfficers: Officer[] = [
      {
        name: faker.random.word.name,
        id: faker.random.uuid(),
        patchid: faker.random.uuid(),
      },
      {
        name: faker.random.word.name,
        id: faker.random.uuid(),
        patchid: faker.random.uuid(),
      },
    ];

    const getOfficersByAreaId = jest.fn((async) => ({
      body: mockOfficers,
      error: undefined,
    }));

    const crmGateway = {
      getPatchByOfficerId: <jest.Mock>dummyMock,
      getTasksForAPatch: <jest.Mock>dummyMock,
      getTask: <jest.Mock>dummyMock,
      getUser: <jest.Mock>dummyMock,
      createUser: <jest.Mock>dummyMock,
      getOfficersByAreaId: <jest.Mock>getOfficersByAreaId,
    };

    const areaId = 5;

    const getOfficers = new GetOfficersPerArea({
      areaId,
      crmGateway,
    });
    const response = await getOfficers.execute();
    expect(getOfficersByAreaId).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual(mockOfficers);
  });

  it('Returns a empty list when officers are not found', async () => {
    const mockOfficers: Officer[] = [];

    const getOfficersByAreaId = jest.fn((async) => ({
      body: mockOfficers,
      error: undefined,
    }));

    const crmGateway = {
      getPatchByOfficerId: <jest.Mock>dummyMock,
      getTasksForAPatch: <jest.Mock>dummyMock,
      getTask: <jest.Mock>dummyMock,
      getUser: <jest.Mock>dummyMock,
      createUser: <jest.Mock>dummyMock,
      getOfficersByAreaId: <jest.Mock>getOfficersByAreaId,
    };

    const areaId = 5;

    const getOfficers = new GetOfficersPerArea({
      areaId,
      crmGateway,
    });

    const response = await getOfficers.execute();
    expect(getOfficersByAreaId).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual(mockOfficers);
    expect(response.error).toEqual(undefined);
  });

  it('Returns a 500 when errors are found', async () => {
    const getOfficersByAreaId = jest.fn((async) => ({
      body: undefined,
      error: 500,
    }));

    const crmGateway = {
      getPatchByOfficerId: <jest.Mock>dummyMock,
      getTasksForAPatch: <jest.Mock>dummyMock,
      getTask: <jest.Mock>dummyMock,
      getUser: <jest.Mock>dummyMock,
      createUser: <jest.Mock>dummyMock,
      getOfficersByAreaId: <jest.Mock>getOfficersByAreaId,
    };

    const areaId = 5;

    const getOfficers = new GetOfficersPerArea({
      areaId,
      crmGateway,
    });

    const response = await getOfficers.execute();
    expect(getOfficersByAreaId).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual(undefined);
    expect(response.error).toEqual(500);
  });

  it('Returns a 401 error when error is NotAuthorised', async () => {
    const getOfficersByAreaId = jest.fn((async) => ({
      body: undefined,
      error: 'NotAuthorised',
    }));

    const crmGateway = {
      getPatchByOfficerId: <jest.Mock>dummyMock,
      getTasksForAPatch: <jest.Mock>dummyMock,
      getTask: <jest.Mock>dummyMock,
      getUser: <jest.Mock>dummyMock,
      createUser: <jest.Mock>dummyMock,
      getOfficersByAreaId: <jest.Mock>getOfficersByAreaId,
    };

    const areaId = 5;

    const getOfficers = new GetOfficersPerArea({
      areaId,
      crmGateway,
    });

    const response = await getOfficers.execute();
    expect(getOfficersByAreaId).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual(undefined);
    expect(response.error).toEqual(401);
  });
});
