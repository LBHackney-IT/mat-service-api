import { crmResponseToTasks, mapResponseToStage } from './crmToTask';
import MockCrmTaskResponse from '../tests/helpers/generateCrmTaskResponse';
import { Task } from '../interfaces/task';
import faker from 'faker';

describe('crmResponseToTask', () => {
  it('returns a valid task when given a crmResponse', () => {
    const crmResponse = MockCrmTaskResponse();

    const convertedTask: Task[] = crmResponseToTasks(crmResponse);

    let index = 0;
    convertedTask.forEach((task) => {
      const crmValue = crmResponse.value[index];

      expect(task.id).toEqual(crmValue.hackney_tenancymanagementinteractionsid);
      expect(task.createdTime).toEqual(new Date(crmValue.createdon));
      expect(task.category).toEqual(
        crmValue[
          'hackney_processtype@OData.Community.Display.V1.FormattedValue'
        ]
      );
      expect(task.type).toEqual(
        crmValue[
          'hackney_enquirysubject@OData.Community.Display.V1.FormattedValue'
        ]
      );
      expect(task.resident.presentationName).toEqual(crmValue.name);
      expect(task.resident.role).toEqual('Tenant');
      expect(task.address.presentationShort).toEqual(
        `${crmValue.contact1_x002e_address1_line1}, ${crmValue.contact1_x002e_address1_line2}`
      );
      expect(task.completedTime).toEqual(new Date(crmValue.completionDate));
      expect(task.dueTime).toEqual(new Date(crmValue.dueDate));
      expect(task.stage).toEqual(
        mapResponseToStage(crmValue.hackney_process_stage)
      );
      expect(task.assignedToManager).toBe(false);
      index += 1;
    });
  });

  it('returns a task assigned to manager', () => {
    const crmResponse = MockCrmTaskResponse();
    crmResponse.value[0]._hackney_estateofficerpatchid_value = undefined;
    crmResponse.value[0]._hackney_managerpropertypatchid_value = faker.random.uuid();
    const convertedTask: Task[] = crmResponseToTasks(crmResponse);
    expect(convertedTask[0].assignedToManager).toBe(true);
  });
});
