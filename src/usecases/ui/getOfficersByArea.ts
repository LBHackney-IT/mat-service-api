import axios from 'axios';

const getOfficersByArea = async (areaId: number) => {
  if (process.env.NEXT_PUBLIC_API_PATH === undefined) return null;

  let output;

  return await axios
    .get(`${process.env.NEXT_PUBLIC_API_PATH}/users?managerAreaId=${areaId}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
};

export default getOfficersByArea;
