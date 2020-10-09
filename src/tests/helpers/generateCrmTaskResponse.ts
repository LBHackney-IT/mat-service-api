import faker from 'faker';
import { CrmResponse } from '../..//gateways/crmGateway';
import { CrmTaskValue } from '../../mappings/crmToTask';

export default (): CrmResponse<CrmTaskValue[]> => {
  return {
    '@odata.context': faker.lorem.word(),
    value: [
      {
        createdon: faker.date.past().toISOString(),
        hackney_processtype: 1,
        'hackney_processtype@OData.Community.Display.V1.FormattedValue': faker.lorem.word(),
        'hackney_enquirysubject@OData.Community.Display.V1.FormattedValue': faker.lorem.word(),
        hackney_tenancymanagementinteractionsid: faker.lorem.word(),
        hackney_process_stage: faker.random.number(9),
        completionDate: faker.date.recent().toISOString(),
        dueDate: faker.date.future().toISOString(),
        name: faker.name.findName(),
        contact1_x002e_address1_line1: faker.address.streetAddress(),
        contact1_x002e_address1_line2: faker.address.streetAddress(),
        contact1_x002e_birthdate: faker.date.past().toISOString(),
        contact1_x002e_emailaddress1: faker.internet.email(),
        contact1_x002e_telephone1: faker.phone.phoneNumber(),
        contact1_x002e_telephone2: faker.phone.phoneNumber(),
        contact1_x002e_housing_telephone3: faker.phone.phoneNumber(),
        contact1_x002e_mobilephone: faker.phone.phoneNumber(),
        hackney_name: faker.random.alphaNumeric(),
        tenancyStartDate: faker.date.past().toISOString(),
        _hackney_estateofficerpatchid_value: faker.random.uuid(),
        statecode: faker.random.number(),
        'hackney_natureofenquiry@OData.Community.Display.V1.FormattedValue': faker.lorem.word(),
        'parent@OData.Community.Display.V1.FormattedValue': faker.lorem.word(),
        contact1_x002e_fullname: faker.name.findName(),
        primaryTenant: false,
        _hackney_incidentid_value: faker.lorem.word(),
        hackney_household3_x002e_hackney_tag_ref: faker.lorem.word(),
        _hackney_household_interactionid_value: faker.lorem.word(),
        contact1_x002e_hackney_uprn: faker.lorem.word(),
        _hackney_contactid_value: faker.lorem.word(),
        hackney_enquirysubject: faker.random.number(),
      },
    ],
  };
};
