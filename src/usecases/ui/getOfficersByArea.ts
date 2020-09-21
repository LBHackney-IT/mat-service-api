import axios from 'axios';

const getOfficersByArea = async (areaId: string) => {
  if (process.env.NEXT_PUBLIC_API_PATH === undefined) return null;

  let output;

  return await axios
    .get(
      `${process.env.NEXT_PUBLIC_API_PATH}/tasks/[taskId]/users?areaId=${areaId}`
    )
    .then((response) => {
      output = response;
      console.log('LOOK', output);
      return response;
    })
    .catch((error) => {
      return error;
    });
};

export default getOfficersByArea;
