import { Row } from '../components/worktray';
import { Stage, Task } from '../interfaces/task';
import { Status } from 'lbh-frontend-react';

const apiTaskToUiTask = (apiTasks: Task[]): Row[] => {
  const mappedTasks: Row[] = [];

  apiTasks.map((element: Task) => {
    mappedTasks.push({
      cells: [
        {
          key: 'created',
          value: new Date(element.createdTime),
        },
        {
          key: 'processAction',
          value: element.type,
        },
        {
          key: 'name',
          value: element.resident.presentationName,
        },
        { key: 'address', value: element.address.presentationShort },
        {
          key: 'dueCompletion',
          value: element.dueTime ? new Date(element.dueTime) : 'Unknown',
        },
      ],
      workItemStatus:
        element.stage == Stage.completed ? Status.complete : Status.inProgress,
      workItemId: element.id,
      workItemLink: `/tasks/${element.id}`,
    });
  });

  return mappedTasks;
};

export default apiTaskToUiTask;
