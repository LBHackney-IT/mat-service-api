import { NextApiRequest, NextApiResponse } from 'next';
import GetTask from '../../../usecases/getTask';
import { Task } from '../../../interfaces/task';

type Data = Task | undefined;

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const id = req.query.id
    ? Array.isArray(req.query.id)
      ? req.query.id[0]
      : req.query.id
    : undefined;

  if (id !== undefined) {

    const getTask = new GetTask(id);
    const response = await getTask.execute();

    if (response.error === undefined) {
      res.status(200).json(response.body);
    } else {
      res.status(response.error).json(response.body);
    }
  } else {
    res.status(400).end();
  }
};
