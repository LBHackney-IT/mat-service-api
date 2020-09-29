import axios, { AxiosResponse } from 'axios';

export default (taskId: string): Promise<AxiosResponse<void>> => {
  return axios.post(`/api/tasks/${taskId}/close`);
};
