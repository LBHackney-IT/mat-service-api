import axios from 'axios';

export default (): void => {
  axios.post(`/api/tasks/sync-itv-tasks`).catch((e) => console.log(e));
};
