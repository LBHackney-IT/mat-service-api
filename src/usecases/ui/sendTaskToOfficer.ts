import axios from 'axios';

export interface SendTaskToOfficerInterface {
  taskId: string;
  housingOfficerId: string;
}

const sendTaskToOfficer = async (
  selectedTaskAndOfficer: SendTaskToOfficerInterface
) => {
  if (process.env.NEXT_PUBLIC_API_PATH === undefined) return null;

  const update = {
    taskId: selectedTaskAndOfficer.taskId,
    housingOfficerId: selectedTaskAndOfficer.housingOfficerId,
  };

  return await axios
    .post(
      `${process.env.NEXT_PUBLIC_API_PATH}/tasks/[taskId]/sendTaskToOfficer`,
      update
    )
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
};

export default sendTaskToOfficer;
