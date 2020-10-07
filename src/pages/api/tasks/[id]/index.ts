import { NextApiRequest } from 'next';
import { Task } from '../../../../interfaces/task';
import { ApiResponse } from '../../../../interfaces/apiResponses';
import { getTask } from '../../../../usecases/api';
import { isSuccess } from '../../../../lib/utils';

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

    if (isSuccess(response)) {
      res.status(200).json(response);
    } else {
      res.status(500).json({ error: 'could not retrieve task' });
    }
  } else {
    res.status(400).json({ error: 'task id missing' });
  }
};
