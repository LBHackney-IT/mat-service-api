import axios from 'axios';

export interface SendTaskToOfficerInterface {
  taskId: string;
  housingOfficerId: string;
}

const sendTaskToOfficer = async (
  selectedTaskAndOfficer: SendTaskToOfficerInterface
): Promise<boolean> => {
  if (process.env.NEXT_PUBLIC_API_PATH === undefined) return false;

  const response = await axios
    .post(
      `${process.env.NEXT_PUBLIC_API_PATH}/tasks/[taskId]/sendToOfficer`,
      selectedTaskAndOfficer
    )
    .then((response) => {
      return true;
    })
    .catch((error) => {
      return false;
    });

  return response;
};

export default sendTaskToOfficer;
