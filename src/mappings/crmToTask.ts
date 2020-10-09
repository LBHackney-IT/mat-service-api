import {
  Task,
  Stage,
  State,
  DueState,
  TenancyType,
  ProcessType,
} from '../interfaces/task';
import { CrmResponse } from '../gateways/crmGateway';

const processIds: { [key: number]: ProcessType } = {
  100000052: ProcessType.homecheck,
  100000060: ProcessType.itv,
  100000156: ProcessType.thc,
  100000219: ProcessType.etra,
};

const processTypeLookup = (code: number): ProcessType | null => {
  return processIds[code] || null;
};

export const crmResponseToTask = (data: CrmResponse<CrmTaskValue[]>): Task => {
  const residents = crmResponseToTasks(data);

  const primaryResident =
    residents.find((x) => x.tenancy.residents[0].role === 'Primary Tenant') ||
    residents[0];

  residents.forEach((task: Task) => {
    if (task !== primaryResident) {
      primaryResident.tenancy.residents.push(task.tenancy.residents[0]);
    }
  });

  return primaryResident;
};

export const crmResponseToTasks = (
  crmTasks: CrmResponse<CrmTaskValue[]>
): Task[] => {
  return crmTasks.value.map(convertCrmTaskToTask);
};

function convertCrmTaskToTask(crmTask: CrmTaskValue) {
  const tenant = {
    presentationName: crmTask.name,
    role: crmTask.primaryTenant ? 'Primary Tenant' : 'Tenant',
    dateOfBirth: new Date(crmTask.contact1_x002e_birthdate),
    mobileNumber: crmTask.contact1_x002e_housing_telephone3,
    homePhoneNumber: crmTask.contact1_x002e_telephone2,
    workPhoneNumber: crmTask.contact1_x002e_telephone1,
    email: crmTask.contact1_x002e_emailaddress1,
    contactCrmId: crmTask._hackney_contactid_value,
  };

  const task: Task = {
    id: crmTask.hackney_tenancymanagementinteractionsid,
    createdTime: new Date(crmTask.createdon),
    category:
      crmTask['hackney_processtype@OData.Community.Display.V1.FormattedValue'],
    categoryId: crmTask.hackney_processtype,
    type: 'Unknown',
    resident: tenant,
    address: {
      presentationShort: `${crmTask.contact1_x002e_address1_line1}, ${crmTask.contact1_x002e_address1_line2}`,
    },
    dueTime: new Date(crmTask['dueDate']),
    dueState: DueState.imminent,
    completedTime: new Date(crmTask['completionDate']),
    stage: mapResponseToStage(crmTask.hackney_process_stage),
    state: mapResponseToState(crmTask.statecode),
    children: [],
    parent: crmTask['parent@OData.Community.Display.V1.FormattedValue'],
    referenceNumber: crmTask.hackney_name,
    incidentId: crmTask._hackney_incidentid_value,
    householdId: crmTask._hackney_household_interactionid_value,
    processType: processTypeLookup(crmTask.hackney_enquirysubject),
    assignedToManager:
      !!crmTask._hackney_managerpropertypatchid_value &&
      !crmTask._hackney_estateofficerpatchid_value,
    tenancy: {
      type: TenancyType.Secure,
      startDate: new Date(crmTask.tenancyStartDate),
      residents: [tenant],
      tagRef: crmTask.hackney_household3_x002e_hackney_tag_ref,
      uprn: crmTask.contact1_x002e_hackney_uprn,
    },
  };

  const processType = crmTask.hackney_processtype;

  switch (processType) {
    case 1: // Process
    case 2: // Post Visit Action
    case 0: // Interaction (task created outside process i.e. not PVA)
      task.type =
        crmTask[
          'hackney_enquirysubject@OData.Community.Display.V1.FormattedValue'
        ];
      break;

    case 3: // ETRA
      task.type =
        crmTask[
          'hackney_natureofenquiry@OData.Community.Display.V1.FormattedValue'
        ];
      break;
  }

  return task;
}

export type CrmTaskValue = {
  statecode: number;
  _hackney_managerpropertypatchid_value?: string;
  _hackney_estateofficerpatchid_value?: string;
  hackney_processtype: number;
  createdon: string;
  'hackney_processtype@OData.Community.Display.V1.FormattedValue': string;
  'hackney_natureofenquiry@OData.Community.Display.V1.FormattedValue': string;
  'hackney_enquirysubject@OData.Community.Display.V1.FormattedValue': string;
  'parent@OData.Community.Display.V1.FormattedValue': string;
  hackney_tenancymanagementinteractionsid: string;
  completionDate: string;
  contact1_x002e_fullname: string;
  contact1_x002e_address1_line1: string;
  contact1_x002e_address1_line2: string;
  primaryTenant: boolean;
  contact1_x002e_birthdate: string;
  contact1_x002e_emailaddress1: string;
  contact1_x002e_telephone1: string;
  contact1_x002e_telephone2: string;
  contact1_x002e_housing_telephone3: string;
  contact1_x002e_mobilephone: string;
  dueDate: string;
  tenancyStartDate: string;
  hackney_process_stage: number;
  hackney_name: string;
  name: string;
  _hackney_incidentid_value: string;
  hackney_household3_x002e_hackney_tag_ref: string;
  _hackney_household_interactionid_value: string;
  contact1_x002e_hackney_uprn: string;
  _hackney_contactid_value: string;
  hackney_enquirysubject: number;
};

export const mapResponseToStage = (stage: number): Stage => {
  switch (stage) {
    case 0:
      // Not completed 0
      return Stage.started;
    case 1:
      // Awaiting manager review 1
      return Stage.started;
    case 2:
      // Approved 2
      return Stage.completed;
    case 3:
      // Declined 3
      return Stage.completed;
    case 4:
      // In-progress 4
      return Stage.started;
    case 5:
      // Awaiting manager review 5 - Special status for THC with unable to enter property journey
      return Stage.validating;
    case 6:
      // Approved 6 - Approved for Unable to enter property journey
      return Stage.completed;
    case 7:
      // Declined 7
      return Stage.completed;
    case 8:
      // Completed 8
      return Stage.completed;
    case 9:
      // Escalated 9
      return Stage.validating;
    default:
      return Stage.unstarted;
  }
};

export const mapResponseToState = (state: number): State => {
  switch (state) {
    case 0:
      return State.active;
    case 1:
      return State.inactive;
    default:
      return State.active;
  }
};
