import faker from 'faker';
import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { isError, isSuccess } from '../../lib/utils';
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
      Promise.resolve(mockOfficers)
    );

    const getOfficers = new GetOfficersPerArea(crmGateway);
    const response = await getOfficers.execute(areaId);
    expect(crmGateway.getOfficersByAreaId).toHaveBeenCalledTimes(1);
    expect(isSuccess(response)).toEqual(true);
    expect(response).toEqual(mockOfficers);
  });

  it('Returns a empty list when officers are not found', async () => {
    const mockOfficers: Officer[] = [];

    crmGateway.getOfficersByAreaId = jest.fn(() =>
      Promise.resolve(mockOfficers)
    );

    const getOfficers = new GetOfficersPerArea(crmGateway);

    const response = await getOfficers.execute(areaId);
    expect(crmGateway.getOfficersByAreaId).toHaveBeenCalledTimes(1);
    expect(isSuccess(response)).toEqual(true);
    expect(response).toEqual(mockOfficers);
  });

  it('Returns an error when errors are found', async () => {
    crmGateway.getOfficersByAreaId = jest.fn(() =>
      Promise.resolve(new Error('Unknown error'))
    );

    const getOfficers = new GetOfficersPerArea(crmGateway);

    const response = await getOfficers.execute(areaId);
    expect(crmGateway.getOfficersByAreaId).toHaveBeenCalledTimes(1);
    expect(isError(response)).toEqual(true);
    expect(response.message).toEqual('Unknown error');
  });
});
