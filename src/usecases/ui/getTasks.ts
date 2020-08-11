import axios from 'axios';
import apiTaskToUiTask from '../../mappings/apiTaskToUiTask';

const getTasks = async () => {
  const tasks: any = await axios
    .get(`http://localhost:3000/api/tasks?patchId=hardcoded`)
    .then((response => {
      console.log(response);
      return response;
    }))

  return apiTaskToUiTask(tasks.data);
}

export default getTasks
