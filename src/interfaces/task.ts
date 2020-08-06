export interface Task {
  id: string,
  createdTime: Date,
  category: string
  type: string
  resident: {
    presentationName: string,
    role: string,
  },
  address: {
    presentationShort: string
  },
  dueTime: Date,
  stage: Stage,
  children?: Task[],
  parent?: Task
}

export enum Stage {
  inProgress,
  completed
}
