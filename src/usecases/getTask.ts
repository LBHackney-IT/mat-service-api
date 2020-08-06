import { Task } from "../interfaces/task";

interface GetTaskResponse {
  body: Task | undefined;
  error: number | undefined;
}

interface GetTaskInterface {
  execute(): GetTaskResponse;
}

class GetTask implements GetTaskInterface {
  taskId: string;
  constructor(taskId: string) {
    this.taskId = taskId;
  }

  public execute(): GetTaskResponse {
    if (this.taskId == '5956eb7f-9edb-4e05-8934-8f2ee414cd81') {
      const task = {
        id: '5956eb7f-9edb-4e05-8934-8f2ee414cd81',
        createdTime: '2007-03-01T13:00:00Z',
        category: 'Tenancy Audit And Visits',
        type: 'Tenancy & Household Check',
        resident: {
          presentationName: 'Mr John Smith',
          role: 'tenant',
          dateOfBirth: '2007-03-01',
          mobileNumber: '07707188934',
          homePhoneNumber: '0201234567',
          workPhoneNumber: '01301234567',
          email: 'johnDoe@email.com',
        },
        address: {
          presentationShort: 'Flat 9, Made Up Court, 7 Fake Road',
        },
        dueTime: '2007-03-01T13:00:00Z',
        dueState: 'string',
        completedTime: '2007-03-01T13:00:00Z',
        stage: 'string',
        children: [],
        referenceNumber: 'string',
      };

      return {
        body: task,
        error: undefined,
      };
    }

    return {
      body: '',
      error: undefined,
    };
  }
}

export default GetTask;
