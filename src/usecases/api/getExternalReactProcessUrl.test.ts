import GetExternalReactProcessUrl from './getExternalReactProcessUrl';
import {
  mockCrmGateway,
  mockMatPostgresGateway,
} from '../../tests/helpers/mockGateways';
import { isError } from '../../lib/utils';

describe('GetExternalReactProcessUrl', () => {
  let useCase;
  let crmGateway;
  let matPostgresGateway;
  const encryptionKey = 'q2zacxLVm4wnpe0YcLwmQA==';

  beforeEach(() => {
    crmGateway = mockCrmGateway();
    matPostgresGateway = mockMatPostgresGateway();
    useCase = new GetExternalReactProcessUrl(
      encryptionKey,
      crmGateway,
      matPostgresGateway
    );
  });

  test.todo('should create the correct URL');

  it('should return an unsupported error', async () => {
    crmGateway.getTask = jest.fn(() =>
      Promise.resolve({ body: { processType: 'itv' } })
    );
    const result = await useCase.execute(
      'fakeTaskId',
      'fake.user@hackney.gov.uk'
    );
    expect(isError(result)).toBe(true);
    expect(result.message).toEqual('New react processes not yet supported');
  });

  it('should return an error if it could not load a task', async () => {
    const result = await useCase.execute(
      'fakeTaskId',
      'fake.user@hackney.gov.uk'
    );
    expect(isError(result)).toBe(true);
    expect(result.message).toEqual('Could not load task from crm');
  });

  it('should return an error if the task does not have a process type', async () => {
    crmGateway.getTask = jest.fn(() => Promise.resolve({ body: {} }));
    const result = await useCase.execute(
      'fakeTaskId',
      'fake.user@hackney.gov.uk'
    );
    expect(isError(result)).toBe(true);
    expect(result.message).toEqual('Task does not have a process type');
  });
});
