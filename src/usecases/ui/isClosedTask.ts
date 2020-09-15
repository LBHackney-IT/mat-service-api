import axios from 'axios';

export default (taskId: string) => {
  const gateway = new v1MatAPIGateway();
  return axios.put(`/api/tasks/${taskId}/closeTask`);
};
