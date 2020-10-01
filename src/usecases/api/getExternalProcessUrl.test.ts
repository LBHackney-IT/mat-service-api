import GetExternalProcessUrl from './getExternalProcessUrl';
import GetExternalAngularProcessUrl from './getExternalAngularProcessUrl';
import GetExternalReactEtraProcessUrl from './getExternalReactEtraProcessUrl';
import {
  mockCrmGateway,
  mockMatPostgresGateway,
} from '../../tests/helpers/mockGateways';

jest.mock('./getExternalAngularProcessUrl');
jest.mock('./getExternalReactEtraProcessUrl');

describe('GetExternalProcessUrl', () => {
  let useCase;
  let crmGateway;
  let matPostgresGateway;
  const encryptionKey = 'q2zacxLVm4wnpe0YcLwmQA==';

  beforeEach(() => {
    crmGateway = mockCrmGateway();
    matPostgresGateway = mockMatPostgresGateway();
    useCase = new GetExternalProcessUrl(
      encryptionKey,
      crmGateway,
      matPostgresGateway
    );
  });

  it('should call the correct usecase for an angular task', async () => {
    crmGateway.getTask = jest.fn(() =>
      Promise.resolve({ body: { processType: 'itv' } })
    );
    const result = await useCase.execute(
      'fakeTaskId',
      'fake.user@hackney.gov.uk'
    );

    expect(GetExternalAngularProcessUrl).toHaveBeenCalledTimes(1);
    expect(GetExternalReactEtraProcessUrl).toHaveBeenCalledTimes(0);
  });

  it('should call the correct usecase for an etra task', async () => {
    crmGateway.getTask = jest.fn(() =>
      Promise.resolve({ body: { processType: 'etra' } })
    );
    const result = await useCase.execute(
      'fakeTaskId',
      'fake.user@hackney.gov.uk'
    );

    expect(GetExternalAngularProcessUrl).toHaveBeenCalledTimes(0);
    expect(GetExternalReactEtraProcessUrl).toHaveBeenCalledTimes(1);
  });

  it('should return an error if it could not load a task', async () => {
    const result = await useCase.execute(
      'fakeTaskId',
      'fake.user@hackney.gov.uk'
    );
    expect(result).toEqual({ error: 'Could not load task from crm' });
  });

  it('should return an error if the task does not have a process type', async () => {
    crmGateway.getTask = jest.fn(() => Promise.resolve({ body: {} }));
    const result = await useCase.execute(
      'fakeTaskId',
      'fake.user@hackney.gov.uk'
    );
    expect(result).toEqual({ error: 'Task does not have a process type' });
  });

  it('should return an error if it has an incorrect process type', async () => {
    crmGateway.getTask = jest.fn(() =>
      Promise.resolve({ body: { processType: 'unknown' } })
    );
    const result = await useCase.execute(
      'fakeTaskId',
      'fake.user@hackney.gov.uk'
    );
    expect(result).toEqual({ error: 'Unknown external process type' });
  });
});
