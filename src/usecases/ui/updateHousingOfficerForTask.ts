import axios from 'axios';

export interface updateTaskWithHousingOfficer {
  taskId: string;
  housingOfficerId: string;
}

const updateOfficerForTask = async (
  selectedHousingOfficerAndTask: updateTaskWithHousingOfficer
) => {
  if (process.env.NEXT_PUBLIC_API_PATH === undefined) return null;

  const update = {
    taskId: selectedHousingOfficerAndTask.taskId,
    housingOfficerId: selectedHousingOfficerAndTask.housingOfficerId,
  };

  return await axios
    .post(
      `${process.env.NEXT_PUBLIC_API_PATH}/tasks/[taskId]/sendToOfficer`,
      update
    )
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
};

export default updateOfficerForTask;
