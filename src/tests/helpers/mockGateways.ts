export const mockCrmGateway = () => ({
  getTasksForAPatch: jest.fn(() => Promise.resolve({})),
  getTask: jest.fn(() => Promise.resolve({})),
  getUser: jest.fn(() => Promise.resolve({})),
  createUser: jest.fn(() => Promise.resolve({})),
  getPatchByOfficerId: jest.fn(() => Promise.resolve({})),
  getContactsByTagRef: jest.fn(() => Promise.resolve({})),
});

export const mockMatPostgresGateway = () => ({
  getTrasByPatchId: jest.fn(() => Promise.resolve({})),
  getUserMapping: jest.fn(() => Promise.resolve({})),
  createUserMapping: jest.fn(() => Promise.resolve({})),
});

export const mockV1MatApiGateway = () => ({
  getNewTenancies: jest.fn(() => Promise.resolve({})),
  getContactsByUprn: jest.fn(() => Promise.resolve({})),
  createTenancyManagementInteraction: jest.fn(() => Promise.resolve({})),
  transferCall: jest.fn(() => Promise.resolve({})),
});
