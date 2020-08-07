import { Task, Stage, DueState } from "../interfaces/task";

export interface CrmResponseInterface {
  "@odata.context": string,
  value: {
    "_hackney_contactid_value@OData.Community.Display.V1.FormattedValue": string,
    "createdon@OData.Community.Display.V1.FormattedValue": string,
    "_hackney_subjectid_value@OData.Community.Display.V1.FormattedValue": string,
    "_hackney_incidentid_value@OData.Community.Display.V1.FormattedValue": string,
    "hackney_tenancymanagementinteractionsid": string,
    "contact1_x002e_address1_line1": string,
    "contact1_x002e_address1_line2": string,
    "hackney_process_stage": number,
  }[]
}



const crmResponseToTask = (crmResponse: CrmResponseInterface): Task[] => {
  const taskArray: Task[] = [];
  crmResponse.value.forEach((element: any) => {
    const task: Task = {
      id: element.hackney_tenancymanagementinteractionsid,
      createdTime: new Date(element["createdon@OData.Community.Display.V1.FormattedValue"]),
      category: element["_hackney_subjectid_value@OData.Community.Display.V1.FormattedValue"],
      type: element["_hackney_incidentid_value@OData.Community.Display.V1.FormattedValue"],
      resident: {
        presentationName: element["_hackney_contactid_value@OData.Community.Display.V1.FormattedValue"],
        role: "",
        dateOfBirth: new Date("2030-12-31"),
        mobileNumber: "",
        homePhoneNumber: "",
        workPhoneNumber: "",
        email: ""
      },
      address: {
        presentationShort: `${element["contact1_x002e_address1_line1"]}, ${element["contact1_x002e_address1_line2"]}`
      },
      dueTime: new Date("2030-12-31"),
      dueState: DueState.imminent,
      completedTime: new Date("2030-12-31"),
      stage: mapResponseToStage(element["hackney_process_stage"]),
      children: [],
      parent: undefined,
      referenceNumber: ""

    }
    taskArray.push(task)
  })
  return taskArray
}


export const mapResponseToStage = (stage: number): Stage => {
  switch (stage) {
    case 0:
      // Not completed 0
      return Stage.started
    case 1:
      // Awaiting manager review 1
      return Stage.started
    case 2:
      // Approved 2
      return Stage.completed
    case 3:
      // Declined 3
      return Stage.completed
    case 4:
      // In-progress 4
      return Stage.started
    case 5:
      // Awaiting manager review 5 - Special status for THC with unable to enter property journey
      return Stage.validating
    case 6:
      // Approved 6 - Approved for Unable to enter property journey
      return Stage.completed
    case 7:
      // Declined 7
      return Stage.completed
    case 8:
      // Completed 8
      return Stage.completed
    case 9:
      // Escalated 9
      return Stage.validating
    default:
      return Stage.unstarted
  }
}

export default crmResponseToTask;
