export interface Task {
  id: string;
  createdTime: Date;
  category: string;
  type: string;
  resident: {
    presentationName: string;
    role: string;
    dateOfBirth: Date;
    mobileNumber?: string;
    homePhoneNumber?: string;
    workPhoneNumber?: string;
    email?: string;
  };
  address: {
    presentationShort: string;
  };
  dueTime: Date;
  dueState: string;
  completedTime: Date;
  stage: Stage;
  children?: Task[];
  parent?: Task;
  referenceNumber: string;
}

export enum Stage {
  unstarted,
  started,
  validating,
  completed,
}
