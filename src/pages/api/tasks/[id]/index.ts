import { NextApiRequest } from 'next';
import { Task } from '../../../../interfaces/task';
import { ApiResponse } from '../../../../interfaces/apiResponses';
import { getTask } from '../../../../usecases/api';

export default async (
  req: NextApiRequest,
  res: ApiResponse<Task>
): Promise<void> => {
  const id = req.query.id
    ? Array.isArray(req.query.id)
      ? req.query.id[0]
      : req.query.id
    : undefined;

  if (id !== undefined) {
    const response = await getTask.execute(id);

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
