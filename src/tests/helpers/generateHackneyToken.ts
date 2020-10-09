import faker from 'faker';
import HackneyToken from '../../interfaces/hackneyToken';

export default (): HackneyToken => ({
  sub: faker.lorem.word(),
  email: faker.internet.email(),
  iss: 'hackney',
  name: faker.name.firstName(),
  groups: [faker.lorem.word()],
  iat: faker.random.number(),
});
