import axios from 'axios';

export interface updateHousingOfficer {
  taskId: string;
  housingOfficerName: string;
}

const updateOfficerForTask = async (
  selectedHousingOfficer: updateHousingOfficer
) => {
  if (process.env.NEXT_PUBLIC_API_PATH === undefined) return null;

  const update = {
    taskId: selectedHousingOfficer.taskId,
    housingOfficerName: selectedHousingOfficer.housingOfficerName,
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
