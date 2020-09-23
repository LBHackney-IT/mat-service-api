import axios from 'axios';

export interface SendTaskToOfficerInterface {
  taskId: string;
  housingOfficerId: string;
}

const sendTaskToOfficer = async (
  selectedTaskAndOfficer: SendTaskToOfficerInterface
): Promise<boolean> => {
  if (process.env.NEXT_PUBLIC_API_PATH === undefined) return false;

  return axios.post(
    `/api/tasks/${selectedTaskAndOfficer.taskId}/sendToOfficer`,
    selectedTaskAndOfficer
  );
};

export default sendTaskToOfficer;
