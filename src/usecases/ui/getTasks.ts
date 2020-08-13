import axios from 'axios';
import apiTaskToUiTask from '../../mappings/apiTaskToUiTask';
import { Row } from '../../components/worktray';

const getTasks = async (): Promise<Row[]> => {
  if(process.env.NEXT_PUBLIC_API_PATH === undefined) {
    return [];
  }

  const tasks: any = await axios
    .get(`${process.env.NEXT_PUBLIC_API_PATH}/tasks?patchId=hardcoded`)
    .then((response => {
      return response;
    }))

  return apiTaskToUiTask(tasks.data);
}

export default getTasks
