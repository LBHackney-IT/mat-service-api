import faker from 'faker';

export default () => ({
  patchId: faker.lorem.word(),
  patchName: faker.lorem.word(),
  officerName: faker.lorem.word(),
  officerId: faker.lorem.word(),
  isManager: faker.random.boolean(),
  areaManagerId: faker.lorem.word(),
  areaId: faker.random.number(),
});
