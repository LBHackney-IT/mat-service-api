import faker from 'faker';

const MockCrmOfficersResponse = () => {
  return {
    id: faker.random.number(),
    name: faker.lorem.word(),
    patchid: faker.random.uuid(),
  };
};

export default MockCrmOfficersResponse;
