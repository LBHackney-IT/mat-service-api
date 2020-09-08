import faker from 'faker';

const MockCrmUserResponse = () => {
  return {
    '@odata.context': faker.internet.domainName(),
    value: [
      {
        '@odata.etag': faker.lorem.word(),
        hackney_estateofficerid: faker.random.word(),
      },
    ],
  };
};

export default MockCrmUserResponse;
