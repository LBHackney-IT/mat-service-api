import axios from 'axios';

export interface updateHousingOfficer {
  taskId: string;
  housingOfficer: string;
}

const updateOfficerForTask = async (update: updateHousingOfficer) => {
  if (process.env.NEXT_PUBLIC_API_PATH === undefined) return null;

  return await axios
    .post(
      `${process.env.NEXT_PUBLIC_API_PATH}/tasks/[taskId]/sendToOfficer`,
      update
    )
    .then((response) => {
      return response;
    });
};

export default updateOfficerForTask;
