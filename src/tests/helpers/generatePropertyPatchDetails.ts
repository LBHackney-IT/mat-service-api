import faker from 'faker';

export default () => ({
  patchCode: faker.lorem.word(),
  areaName: faker.lorem.word(),
  ward: faker.lorem.word(),
  officerFullName: faker.lorem.word(),
});
