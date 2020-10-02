import faker from 'faker';
import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { Officer } from '../../mappings/crmToOfficersDetails';
import { mockCrmGateway } from '../../tests/helpers/mockGateways';
import GetOfficersPerArea from '../../usecases/api/getOfficersPerArea';

const dummyMock = jest.fn(async () => ({}));

describe('GetOfficersPerArea', () => {
  const areaId = 5;
  let crmGateway: CrmGatewayInterface;

  beforeEach(() => {
    crmGateway = mockCrmGateway();
  });

  it('Returns a list of officers when no errors are found', async () => {
    const mockOfficers: Officer[] = [
      {
        name: faker.random.word.name,
        id: faker.random.uuid(),
        patchid: faker.random.uuid(),
      },
    ];

    crmGateway.getOfficersByAreaId = jest.fn(() =>
      Promise.resolve({
        body: mockOfficers,
        error: undefined,
      })
    );

    const getOfficers = new GetOfficersPerArea(crmGateway);
    const response = await getOfficers.execute(areaId);
    expect(crmGateway.getOfficersByAreaId).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual(mockOfficers);
  });

  it('Returns a empty list when officers are not found', async () => {
    const mockOfficers: Officer[] = [];

    crmGateway.getOfficersByAreaId = jest.fn(() =>
      Promise.resolve({
        body: mockOfficers,
        error: undefined,
      })
    );

    const getOfficers = new GetOfficersPerArea(crmGateway);

    const response = await getOfficers.execute(areaId);
    expect(crmGateway.getOfficersByAreaId).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual(mockOfficers);
    expect(response.error).toEqual(undefined);
  });

  it('Returns a 500 when errors are found', async () => {
    crmGateway.getOfficersByAreaId = jest.fn(() =>
      Promise.resolve({
        body: undefined,
        error: 500,
      })
    );

    const getOfficers = new GetOfficersPerArea(crmGateway);

    const response = await getOfficers.execute(areaId);
    expect(crmGateway.getOfficersByAreaId).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual(undefined);
    expect(response.error).toEqual(500);
  });

  it('Returns a 401 error when error is NotAuthorised', async () => {
    crmGateway.getOfficersByAreaId = jest.fn(() =>
      Promise.resolve({
        body: undefined,
        error: 'NotAuthorised',
      })
    );

    const getOfficers = new GetOfficersPerArea(crmGateway);

    const response = await getOfficers.execute(areaId);
    expect(crmGateway.getOfficersByAreaId).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual(undefined);
    expect(response.error).toEqual(401);
  });
});
