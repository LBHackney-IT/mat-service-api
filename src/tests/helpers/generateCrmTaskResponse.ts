import faker from "faker";
import { CrmResponse } from "../..//gateways/crmGateway";

const MockCrmTaskResponse = (): CrmResponse => {
  return (
    {
      "@odata.context": faker.lorem.word(),
      "value": [{
        createdon: faker.date.past().toString(),
        hackney_processtype: 1,
        "hackney_processtype@OData.Community.Display.V1.FormattedValue": faker.lorem.word(),
        "hackney_enquirysubject@OData.Community.Display.V1.FormattedValue": faker.lorem.word(),
        "hackney_tenancymanagementinteractionsid": faker.lorem.word(),
        "hackney_process_stage": faker.random.number(9),
        "completionDate": faker.date.recent(),
        "dueDate": faker.date.future(),
        "name": faker.name.findName(),
        "contact1_x002e_address1_line1": faker.address.streetAddress(),
        "contact1_x002e_address1_line2": faker.address.streetAddress(),
        "contact1_x002e_hackney_responsible": "No",
        "contact1_x002e_birthdate": faker.date.past(),
        "contact1_x002e_emailaddress1": faker.internet.email(),
        "contact1_x002e_telephone1": faker.phone.phoneNumber(),
        "contact1_x002e_telephone2": faker.phone.phoneNumber(),
        "contact1_x002e_housing_telephone3": faker.phone.phoneNumber(),
        "contact1_x002e_mobilephone": faker.phone.phoneNumber(),
        "hackney_name": faker.random.alphaNumeric(),
        "tenancyStartDate": faker.date.past()
      }
      ]
    }
  )
}

export default MockCrmTaskResponse
