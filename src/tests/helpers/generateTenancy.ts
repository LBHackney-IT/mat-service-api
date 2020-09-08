import faker from 'faker';
import { Tenancy } from '../../interfaces/tenancy';

const MockTenancy = (introductory: boolean): Tenancy => {
  return {
    accountId: faker.lorem.word(),
    officerId: faker.lorem.word(),
    officerName: faker.name.findName(),
    accountCreatedOn: faker.date.recent(),
    housingTenure: introductory ? 'INT' : 'SEC',
    patchId: faker.lorem.word(),
    areaId: 0,
    managerId: faker.lorem.word(),
    householdId: faker.lorem.word(),
    tagReference: faker.lorem.word(),
    neighbourhoodOffice: faker.lorem.word(),
    estateAddress: faker.address.streetAddress(),
    addressLine1: faker.lorem.word(),
    addressLine2: faker.lorem.word(),
    addressLine3: faker.lorem.word(),
    postCode: faker.lorem.word(),
    fullAddress: faker.address.streetAddress(),
    contacts: [
      {
        contactId: faker.lorem.word(),
        responsible: true,
        title: faker.lorem.word(),
        firstName: faker.name.findName(),
        lastName: faker.name.findName(),
      },
    ],
  };
};

export default MockTenancy;
