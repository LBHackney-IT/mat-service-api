import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { CrmTokenGatewayInterface } from '../../gateways/crmTokenGateway';
import { MatPostgresGatewayInterface } from '../../gateways/matPostgresGateway';
import { V1MatAPIGatewayInterface } from '../../gateways/v1MatAPIGateway';
import mockTask from '../../tests/helpers/generateTask';
import MockTenancy from './generateTenancy';

export const mockCrmTokenGateway = (): CrmTokenGatewayInterface => ({
  getToken: jest.fn(() => Promise.resolve('fakeToken')),
});

export const mockCrmGateway = (): CrmGatewayInterface => ({
  getTasksForAPatch: jest.fn(() => Promise.resolve([])),
  getTask: jest.fn(() => Promise.resolve(mockTask())),
  getUserId: jest.fn(() => Promise.resolve('fakeUserId')),
  createUser: jest.fn(() => Promise.resolve({})),
  getPatchByOfficerId: jest.fn(() => Promise.resolve({})),
  getPropertyPatch: jest.fn(() => Promise.resolve({})),
  getOfficersByAreaId: jest.fn(() => Promise.resolve({})),
  getTasksForTagRef: jest.fn(() => Promise.resolve([])),
  getNotesForTask: jest.fn(() => Promise.resolve([])),
  getContactsByTagRef: jest.fn(() => Promise.resolve({})),
  getIntroductoryTenanciesByDate: jest.fn(() =>
    Promise.resolve([MockTenancy(true), MockTenancy(true)])
  ),
  healthCheck: jest.fn(() => Promise.resolve({ success: true })),
});

export const mockMatPostgresGateway = (): MatPostgresGatewayInterface => ({
  getTrasByPatchId: jest.fn(() => Promise.resolve([])),
  getUserMapping: jest.fn(() => Promise.resolve(null)),
  createUserMapping: jest.fn(() => Promise.resolve()),
  getLatestItvTaskSyncDate: jest.fn(() => Promise.resolve(new Date())),
  createItvTask: jest.fn(() => Promise.resolve()),
  healthCheck: jest.fn(() => Promise.resolve({ success: true })),
});

export const mockV1MatApiGateway = (): V1MatAPIGatewayInterface => ({
  getContactsByUprn: jest.fn(() => Promise.resolve({})),
  createTenancyManagementInteraction: jest.fn(() => Promise.resolve({})),
  patchTenancyManagementInteraction: jest.fn(() => Promise.resolve({})),
  transferCall: jest.fn(() => Promise.resolve({})),
  createTaskNote: jest.fn(() => Promise.resolve({})),
  healthCheck: jest.fn(() => Promise.resolve({ success: true })),
});
