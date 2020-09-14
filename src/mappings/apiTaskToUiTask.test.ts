import mockApiTaskResponse from '../tests/helpers/generateApiTaskResponse';
import apiTaskToUiTask from './apiTaskToUiTask';
import { Row } from '../components/worktray';
import { Stage } from '../interfaces/task';
import { Status } from 'lbh-frontend-react';

describe('apiTaskToUiTask', () => {
  it('returns a valid task when given an apiResponse', () => {
    const apiResponse = mockApiTaskResponse();

    const convertedTask: Row[] = apiTaskToUiTask(apiResponse.data);

    let taskIndex = 0;
    convertedTask.forEach((task: Row) => {
      const taskValue = apiResponse.data[taskIndex];

      expect(task.workItemId).toEqual(taskValue.id);
      expect(task.workItemStatus).toEqual(
        taskValue.stage == Stage.completed ? Status.complete : Status.inProgress
      );
      expect(task.cells[0].value).toEqual(new Date(taskValue.createdTime));
      taskIndex += 1;
      expect(task.cells[1].value).toEqual(taskValue.type);
      expect(task.cells[2].value).toEqual(taskValue.resident.presentationName);
      expect(task.cells[3].value).toEqual(taskValue.address.presentationShort);
      expect(task.cells[4].value).toEqual(new Date(taskValue.dueTime));
    });
  });

  it('gives an empty array when response data is empty', () => {
    const apiResponse = {data: []}

    const convertedTask: Row[] = apiTaskToUiTask(apiResponse.data);

    expect(convertedTask).toEqual([]);
  })
});
