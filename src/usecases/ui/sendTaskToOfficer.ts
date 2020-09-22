import axios from 'axios';

export interface SendTaskToOfficerInterface {
  taskId: string;
  housingOfficerId: string;
}

const sendTaskToOfficer = async (
  selectedTaskAndOfficer: SendTaskToOfficerInterface
) => {
  if (process.env.NEXT_PUBLIC_API_PATH === undefined) return null;

  return axios.post(
    `${process.env.NEXT_PUBLIC_API_PATH}/tasks/[taskId]/sendToOfficer`,
    selectedTaskAndOfficer
  );
};

export default sendTaskToOfficer;
