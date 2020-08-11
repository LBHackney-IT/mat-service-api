import { NextApiRequest, NextApiResponse } from 'next'
import GetTasks from "../../usecases/api/getTasks";
import { Task } from '../../interfaces/task';

type Data = Task[] | undefined;

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const patchId = req.query.patchId
    ? Array.isArray(req.query.patchId)
      ? req.query.patchId[0]
      : req.query.patchId
    : undefined;
  
  if(patchId != undefined){
    const getTasks = new GetTasks(patchId);
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
  else{
    res.status(400).end();
  }
}
