import { NextApiRequest, NextApiResponse } from 'next';
import GetTask from '../../../../usecases/api/getTask';
import { Task } from '../../../../interfaces/task';

interface ErrorResponse {
  error: string;
}

type Data = Task | ErrorResponse;

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
): Promise<void> => {
  const id = req.query.id
    ? Array.isArray(req.query.id)
      ? req.query.id[0]
      : req.query.id
    : undefined;

  if (id !== undefined) {
    const getTask = new GetTask(id);
    const response = await getTask.execute();

    if (response.body) {
      res.status(200).json(response.body);
    } else {
      res
        .status(response.error || 500)
        .json({ error: 'could not retrieve task' });
    }
  } else {
    res.status(400).json({ error: 'task id missing' });
  }
};
