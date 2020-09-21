import faker from 'faker';
import { GetPropertyPatchResponse } from '../../gateways/crmGateway';
import {
  PropertyPatchDetailsInterface,
  CrmResponseInterface,
} from '../../mappings/crmToPropertyPatch';

const MockCrmPropertyPatchResponse = () => {
  return {
    '@odata.context': faker.lorem.word(),
    value: [
      {
        '@odata.etag': faker.lorem.word(),
        '_hackney_estateofficerpropertypatchid_value@OData.Community.Display.V1.FormattedValue': faker.lorem.word(),
        hackney_estateofficerpropertypatchid_value: faker.lorem.word(),
        hackney_propertyareapatchid: faker.lorem.word(),
        'hackney_areaname@OData.Community.Display.V1.FormattedValue': faker.lorem.word(),
        hackney_areaname: faker.random.number(1),
        'hackney_ward@OData.Community.Display.V1.FormattedValue': faker.lorem.word(),
        hackney_ward: faker.random.number(2),
        ManagerFullName: faker.lorem.word(),
        OfficerFullName: faker.lorem.word(),
      },
    ],
  };
};

export default MockCrmPropertyPatchResponse;
