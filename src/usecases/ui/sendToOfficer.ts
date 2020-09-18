import axios from 'axios';

export interface SendTaskToHousingOfficerInterface {
  taskId: string;
  housingOfficerId: string;
}

const sendTaskToHousingOfficer = async (
  selectedHousingOfficerAndTask: SendTaskToHousingOfficerInterface
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

export default sendTaskToHousingOfficer;
