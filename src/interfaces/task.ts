export interface Task {
  id: string;
  createdTime: Date;
  category: string;
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
  tenancy: {
    type: TenancyType;
    startDate: Date;
    residents: Resident[];
  }
}

export interface Resident {
  presentationName: string;
  role: string;
  dateOfBirth: Date;
  mobileNumber?: string;
  homePhoneNumber?: string;
  workPhoneNumber?: string;
  email?: string;
}

export enum TenancyType {
  Undefined,
  Secure
}

export enum Stage {
  unstarted,
  started,
  validating,
  completed,
}

export enum DueState {
  imminent,
  overdue
}
