import faker from 'faker';
import {
  Task,
  Stage,
  DueState,
  TenancyType,
  ProcessType,
} from '../../interfaces/task';

interface ApiTaskResponse {
  data: Task[];
  status: number;
  statusText: string;
  headers: {};
  config: {};
  request: {};
}

const mockApiTaskResponse = (): ApiTaskResponse => {
  return {
    data: [
      {
        address: {
          presentationShort: faker.address.streetAddress(),
        },
        category: faker.lorem.word(),
        categoryId: 1,
        completedTime: faker.date.future(),
        createdTime: faker.date.past(),
        dueState: DueState.imminent,
        dueTime: faker.date.future(),
        id: faker.lorem.word(),
        referenceNumber: faker.lorem.word(),
        householdId: faker.lorem.word(),
        resident: {
          presentationName: faker.name.firstName(),
          role: '',
          dateOfBirth: faker.date.past(),
          email: faker.internet.email(),
          mobileNumber: faker.phone.phoneNumber(),
          homePhoneNumber: faker.phone.phoneNumber(),
          workPhoneNumber: faker.phone.phoneNumber(),
          contactCrmId: faker.lorem.word(),
        },
        stage: Stage.started,
        type: faker.lorem.word(),
        tenancy: {
          type: TenancyType.Secure,
          startDate: faker.date.past(),
          residents: [],
          tagRef: faker.lorem.word(),
          uprn: faker.lorem.word(),
        },
        incidentId: faker.lorem.word(),
        processType: ProcessType.itv,
        assignedToManager: false,
      },
    ],
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
    request: {},
  };
};

export default mockApiTaskResponse;
