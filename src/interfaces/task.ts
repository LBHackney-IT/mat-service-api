export interface Task {
  id: string;
  createdTime: Date;
  category: string;
  categoryId: number;
  type: string;
  resident: Resident;
  address: {
    presentationShort: string;
  };
  dueTime?: Date;
  dueState?: DueState;
  completedTime: Date;
  stage: Stage;
  children?: Task[];
  parent?: string;
  referenceNumber: string;
  incidentId: string;
  householdId: string;
  tenancy: {
    type: TenancyType;
    startDate: Date;
    residents: Resident[];
    tagRef: string;
    uprn: string;
  };
}

export interface Resident {
  presentationName: string;
  role: string;
  dateOfBirth: Date;
  mobileNumber?: string;
  homePhoneNumber?: string;
  workPhoneNumber?: string;
  email?: string;
  contactCrmId: string;
}

export enum TenancyType {
  Undefined,
  Secure,
  Introductory,
}

export enum Stage {
  unstarted,
  started,
  validating,
  completed,
}

export enum DueState {
  imminent,
  overdue,
}
