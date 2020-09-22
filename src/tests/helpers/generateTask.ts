import {
  Task,
  Stage,
  DueState,
  TenancyType,
  ProcessType,
} from '../../interfaces/task';
import faker from 'faker';

const MockTask = (): Task => {
  return {
    id: faker.lorem.word(),
    createdTime: faker.date.recent(),
    category: faker.lorem.word(),
    categoryId: 1,
    type: faker.lorem.word(),
    resident: {
      presentationName: faker.name.findName(),
      role: faker.lorem.word(),
      dateOfBirth: faker.date.past(),
      mobileNumber: faker.phone.phoneNumber(),
      homePhoneNumber: faker.phone.phoneNumber(),
      workPhoneNumber: faker.phone.phoneNumber(),
      email: faker.internet.email(),
      contactCrmId: faker.lorem.word(),
    },
    address: {
      presentationShort: faker.address.streetAddress(),
    },
    dueTime: faker.date.future(),
    stage: Stage.started,
    dueState: DueState.imminent,
    completedTime: faker.date.recent(),
    referenceNumber: faker.random.alphaNumeric(),
    householdId: faker.lorem.word(),
    tenancy: {
      type: TenancyType.Secure,
      startDate: faker.date.past(),
      residents: [],
      tagRef: faker.lorem.word(),
      uprn: faker.lorem.word(),
    },
    incidentId: faker.lorem.word(),
    processType: ProcessType.itv,
  };
};

export default MockTask;
