import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { MatPostgresGatewayInterface } from '../../gateways/matPostgresGateway';
import { v1MatAPIGatewayInterface } from '../../gateways/v1MatAPIGateway';

export const mockCrmGateway = (): CrmGatewayInterface => ({
  getTasksForAPatch: jest.fn(() => Promise.resolve({})),
  getTask: jest.fn(() => Promise.resolve({})),
  getUserId: jest.fn(() => Promise.resolve({})),
  createUser: jest.fn(() => Promise.resolve({})),
  getPatchByOfficerId: jest.fn(() => Promise.resolve({})),
  getPropertyPatch: jest.fn(() => Promise.resolve({})),
  getOfficersByAreaId: jest.fn(() => Promise.resolve({})),
  getTasksForTagRef: jest.fn(() => Promise.resolve({})),
  getNotesForTask: jest.fn(() => Promise.resolve({})),
  getContactsByTagRef: jest.fn(() => Promise.resolve({})),
  getTenanciesByDate: jest.fn(() => Promise.resolve({})),
  healthCheck: jest.fn(() => Promise.resolve({ success: true })),
});

export const mockMatPostgresGateway = (): MatPostgresGatewayInterface => ({
  getTrasByPatchId: jest.fn(() => Promise.resolve({})),
  getUserMapping: jest.fn(() => Promise.resolve({})),
  createUserMapping: jest.fn(() => Promise.resolve({})),
  getLatestItvTaskSyncDate: jest.fn(() => Promise.resolve({})),
  createItvTask: jest.fn(() => Promise.resolve({})),
  healthCheck: jest.fn(() => Promise.resolve({ success: true })),
});

export const mockV1MatApiGateway = (): v1MatAPIGatewayInterface => ({
  getContactsByUprn: jest.fn(() => Promise.resolve({})),
  createTenancyManagementInteraction: jest.fn(() => Promise.resolve({})),
  patchTenancyManagementInteraction: jest.fn(() => Promise.resolve({})),
  transferCall: jest.fn(() => Promise.resolve({})),
  createTaskNote: jest.fn(() => Promise.resolve({})),
  healthCheck: jest.fn(() => Promise.resolve({ success: true })),
});
