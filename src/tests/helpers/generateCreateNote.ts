import { NewNote } from '../../interfaces/note';
import faker from 'faker';

const MockCreateNote = (): NewNote => {
  return {
    interactionId: faker.lorem.word(),
    estateOfficerName: faker.name.firstName(),
    status: 1,
    estateOfficerId: faker.lorem.word(),
    ServiceRequest: {
      description: faker.lorem.words(),
      requestCallback: false,
      Id: faker.lorem.word(),
    },
  };
};

export default MockCreateNote;
