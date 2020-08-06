import { Stage, Task } from "../interfaces/task";

interface GetTaskResponse {
  body: Task | undefined;
  error: number | undefined;
}

interface GetTaskInterface {
  execute(): Promise<GetTaskResponse>;
}

class GetTask implements GetTaskInterface {
  taskId: string;
  constructor(taskId: string) {
    this.taskId = taskId;
  }

  public async execute(): Promise<GetTaskResponse> {

    if (this.taskId && this.taskId === '5956eb7f-9edb-4e05-8934-8f2ee414cd81') {
      const task = {
        id: '5956eb7f-9edb-4e05-8934-8f2ee414cd81',
        createdTime: new Date('2007-03-01T13:00:00Z'),
        category: 'Tenancy Audit And Visits',
        type: 'Tenancy & Household Check',
        resident: {
          presentationName: 'Mr John Smith',
          role: 'tenant',
          dateOfBirth: new Date('2007-03-01'),
          mobileNumber: '07707188934',
          homePhoneNumber: '0201234567',
          workPhoneNumber: '01301234567',
          email: 'johnDoe@email.com',
        },
        address: {
          presentationShort: 'Flat 9, Made Up Court, 7 Fake Road',
        },
        dueTime: new Date('2007-03-01T13:00:00Z'),
        dueState: 'string',
        completedTime: new Date('2007-03-01T13:00:00Z'),
        stage: Stage.unstarted,
        children: [],
        referenceNumber: 'string',
      };

      return {
        body: task,
        error: undefined,
      };
    } else {
      return {
        body: undefined,
        error: 400,
      };
    }
  }
}

export default GetTask;
