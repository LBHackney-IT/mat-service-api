import axios from 'axios';
import { Task, Stage } from "../../interfaces/task"
import { Status } from 'lbh-frontend-react';
import { Row } from '../../components/worktray';
import apiTaskToUiTask from '../../mappings/apiTaskToUiTask';

const getTasks = async () => {
  const tasks: any = await axios
    .get(`http://localhost:3000/api/tasks`)
    .then((response => {
      console.log(response);
      return response;
    }))

  return apiTaskToUiTask(tasks.data);
}

export default getTasks
