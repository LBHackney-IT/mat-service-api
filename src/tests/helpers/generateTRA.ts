import { TRA } from '../../interfaces/tra';
import faker from 'faker';

const MockTRA = (): TRA => {
  return {
    id: faker.random.number(),
    name: faker.lorem.word(),
    patchid: faker.random.uuid(),
  };
};

export default MockTRA;
