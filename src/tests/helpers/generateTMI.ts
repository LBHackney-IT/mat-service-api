import faker from 'faker';
import { TenancyManagementInteraction } from '../../interfaces/tenancyManagementInteraction';

const MockTMI = (): TenancyManagementInteraction => {
  return {
    transferred: undefined,
    status: undefined,
    parentInteractionId: undefined,
    householdId: undefined,
    processStage: undefined,
    reasonForStartingProcess: undefined,
    assignedToPatch: undefined,
    assignedToManager: undefined,
    managerId: undefined,
    estateOffice: undefined,
    adviceGiven: undefined,
    interactionId: undefined,
    contactId: faker.lorem.word(),
    enquirySubject: '100000060',
    estateOfficerId: faker.lorem.word(),
    subject: 'c1f72d01-28dc-e711-8115-70106faa6a11',
    source: '1',
    natureofEnquiry: '15',
    estateOfficerName: faker.lorem.word(),
    officerPatchId: faker.lorem.word(),
    areaName: faker.random.number(),
    serviceRequest: {
      id: undefined,
      title: 'Initial tenancy visit',
      description: 'Starting an initial tenancy visit',
      contactId: faker.lorem.word(),
      parentCaseId: undefined,
      createdDate: undefined,
      enquiryType: undefined,
      ticketNumber: undefined,
      requestCallback: undefined,
      transferred: undefined,
      createdBy: undefined,
      childRequests: undefined,
      subject: 'c1f72d01-28dc-e711-8115-70106faa6a11',
    },
    processType: 1,
  };
};

export default MockTMI;
