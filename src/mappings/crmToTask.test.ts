import { crmResponseToTasks,  mapResponseToStage } from "./crmToTask";
import MockCrmTaskResponse from "../tests/helpers/generateCrmTaskResponse";
import { Task } from "../interfaces/task";

describe("crmResponseToTask", () => {
  it("returns a valid task when given a crmResponse", () => {
    const crmResponse = MockCrmTaskResponse();

    const convertedTask: Task[] = crmResponseToTasks(crmResponse);

    let index = 0;
    convertedTask.forEach(task => {
      const crmValue = crmResponse.value[index];

      expect(task.id).toEqual(crmValue.hackney_tenancymanagementinteractionsid)
      expect(task.createdTime).toEqual(new Date(crmValue["createdon@OData.Community.Display.V1.FormattedValue"]))
      expect(task.category).toEqual(crmValue["_hackney_subjectid_value@OData.Community.Display.V1.FormattedValue"])
      expect(task.type).toEqual(crmValue["_hackney_incidentid_value@OData.Community.Display.V1.FormattedValue"])
      expect(task.resident.presentationName).toEqual(crmValue["_hackney_contactid_value@OData.Community.Display.V1.FormattedValue"])
      expect(task.resident.role).toEqual("")
      expect(task.address.presentationShort).toEqual(`${crmValue.contact1_x002e_address1_line1}, ${crmValue.contact1_x002e_address1_line2}`)
      expect(task.dueTime).toEqual(new Date("2030-12-31"))
      expect(task.stage).toEqual(mapResponseToStage(crmValue.hackney_process_stage))
      index += 1
    })
  })
})
