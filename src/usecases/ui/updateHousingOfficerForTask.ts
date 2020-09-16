import axios from 'axios';

export interface updateHousingOfficer {
  taskId: string;
  housingOfficer: string;
}

const updateOfficerForTask = async (
  updateHousingOfficer: updateHousingOfficer
) => {
  if (process.env.NEXT_PUBLIC_API_PATH === undefined) return null;

  const update = {
    taskId: updateHousingOfficer.taskId,
    housingOfficer: updateHousingOfficer.housingOfficer,
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
