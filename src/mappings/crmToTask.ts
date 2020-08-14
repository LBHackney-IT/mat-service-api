import { Task, Stage, DueState, TenancyType } from "../interfaces/task";
import { CrmResponse } from '../gateways/crmGateway'


export const crmResponseToTask = (data: CrmResponse): Task => {

  return convertCrmTaskToTask(data.value as CrmTaskValue);
}

export const crmResponseToTasks = (data: CrmResponse): Task[] => {

  const crmTasks = data as CrmTasks;

  const taskArray: Task[] = [];
  crmTasks.value.forEach((element: any) => {
    const task: Task = convertCrmTaskToTask(element as CrmTaskValue);
    taskArray.push(task)
  })

  return taskArray;
}

function convertCrmTaskToTask(crmTask: CrmTaskValue) {

  const task: Task = {
    id: crmTask["hackney_tenancymanagementinteractionsid"],
    createdTime: new Date(crmTask["createdon@OData.Community.Display.V1.FormattedValue"]),
    category: crmTask["_hackney_subjectid_value@OData.Community.Display.V1.FormattedValue"],
    type: crmTask["_hackney_incidentid_value@OData.Community.Display.V1.FormattedValue"],
    resident: {
      presentationName: crmTask["_hackney_contactid_value@OData.Community.Display.V1.FormattedValue"],
      role: "",
      dateOfBirth: new Date("2030-12-31"),
      mobileNumber: "",
      homePhoneNumber: "",
      workPhoneNumber: "",
      email: ""
    },
    address: {
      presentationShort: `${crmTask["contact1_x002e_address1_line1"]}, ${crmTask["contact1_x002e_address1_line2"]}`
    },
    dueTime: new Date("2030-12-31"),
    dueState: DueState.imminent,
    completedTime: new Date("2030-12-31"),
    stage: mapResponseToStage(crmTask["hackney_process_stage"]),
    children: [],
    parent: undefined,
    referenceNumber: "",
    tenancy: {
      type: TenancyType.Secure,
      startDate: new Date("2030-12-31"),
      residents: []
    }
  }

  return task;
}

interface CrmTaskValue {
  "_hackney_contactid_value@OData.Community.Display.V1.FormattedValue": string,
  "createdon@OData.Community.Display.V1.FormattedValue": string,
  "_hackney_subjectid_value@OData.Community.Display.V1.FormattedValue": string,
  "_hackney_incidentid_value@OData.Community.Display.V1.FormattedValue": string,
  "hackney_tenancymanagementinteractionsid": string,
  "contact1_x002e_address1_line1": string,
  "contact1_x002e_address1_line2": string,
  "hackney_process_stage": number,
}

export interface CrmTask {
  "@odata.context": string,
  value: CrmTaskValue
}

export interface CrmTasks {
  "@odata.context": string,
  value: CrmTaskValue[]
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
