import faker from "faker";
import { CrmResponseInterface } from "../../mappings/crmToTask";

const MockCrmTaskResponse = (): CrmResponseInterface => {
  return (
    {
      "@odata.context": faker.lorem.word(),
      "value": [{
        "_hackney_contactid_value@OData.Community.Display.V1.FormattedValue": faker.name.findName(),
        "createdon@OData.Community.Display.V1.FormattedValue": faker.date.past().toString(),
        "_hackney_subjectid_value@OData.Community.Display.V1.FormattedValue": faker.lorem.word(),
        "_hackney_incidentid_value@OData.Community.Display.V1.FormattedValue": faker.lorem.word(),
        "hackney_tenancymanagementinteractionsid": faker.lorem.word(),
        "contact1_x002e_address1_line1": faker.address.streetAddress(),
        "contact1_x002e_address1_line2": faker.address.streetAddress(),
        "hackney_process_stage": faker.random.number(9),
      }
    ]}
  )
}

export default MockCrmTaskResponse
