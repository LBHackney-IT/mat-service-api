import faker from 'faker';

const MockCrmOfficersPerAreaIdResponse = () => {
  return {
    '@odata.context': faker.internet.domainName(),
    value: [
      {
        'estateOfficerId@OData.Community.Display.V1.FormattedValue': faker.lorem.word(),
        estateOfficerId: faker.random.word(),
        estateOfficerPatchId: faker.random.word(),
      },
      {
        'estateOfficerId@OData.Community.Display.V1.FormattedValue': faker.lorem.word(),
        estateOfficerId: faker.random.word(),
        estateOfficerPatchId: faker.random.word(),
      },
      {
        'estateOfficerId@OData.Community.Display.V1.FormattedValue': faker.lorem.word(),
        estateOfficerId: faker.random.word(),
        estateOfficerPatchId: faker.random.word(),
      },
    ],
  };
};

export default MockCrmOfficersPerAreaIdResponse;
