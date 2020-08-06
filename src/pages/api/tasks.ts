import { NextApiRequest, NextApiResponse } from 'next'
import GetTasks from "../../usecases/api/getTasks_";
import { Task } from '../../interfaces/task';

type Data = Task[] | undefined;

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const getTasks = new GetTasks();
  switch (req.method) {
    case 'GET':
      const response = await getTasks.execute();

      if(response.error === undefined) {
        res.status(200).json(response.body)
      } else {
        res.status(response.error).end()
      }
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
