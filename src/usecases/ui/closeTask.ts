import axios from 'axios';

export default (taskId: string) => {
  return axios.post(`/api/tasks/${taskId}/close`);
};
