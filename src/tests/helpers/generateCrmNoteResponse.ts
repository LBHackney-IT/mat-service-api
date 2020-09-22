import faker from 'faker';
import { CrmResponse } from '../..//gateways/crmGateway';

const MockCrmNoteResponse = (): CrmResponse => {
  return {
    '@odata.context': faker.lorem.word(),
    value: [
      {
        '@odata.etag': faker.lorem.word(),
        hackney_tenancymanagementinteractionsid: faker.lorem.word(),
        'incident1_x002e_housing_requestcallback@OData.Community.Display.V1.FormattedValue': faker.lorem.word(),
        incident1_x002e_housing_requestcallback: faker.random.boolean(),
        annotation2_x002e_notetext: faker.lorem.words(20),
        'annotation2_x002e_createdby@OData.Community.Display.V1.FormattedValue': `${faker.name.firstName()} ${faker.name.lastName()}`,
        annotation2_x002e_createdby: faker.lorem.word(),
        'annotation2_x002e_createdon@OData.Community.Display.V1.FormattedValue': faker.date.recent.toString(),
        annotation2_x002e_createdon: faker.date.recent().toString(),
        incident1_x002e_incidentid: faker.lorem.word(),
        annotation2_x002e_annotationid: faker.lorem.word(),
      },
    ],
  };
};

export default MockCrmNoteResponse;
