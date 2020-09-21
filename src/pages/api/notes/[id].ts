import { NextApiRequest, NextApiResponse } from 'next';
import { Note } from '../../../interfaces/note';
import getNotesForTask from '../../../usecases/api/getNotesForTask';

interface Error {
  error: string;
}

type Data = Note[] | Error;

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const id = req.query.id
    ? Array.isArray(req.query.id)
      ? req.query.id[0]
      : req.query.id
    : undefined;

  if (id !== undefined) {
    const response = await getNotesForTask(id);

    if (response.body) {
      res.status(200).json(response.body);
    } else {
      res
        .status(response.error || 500)
        .json({ error: 'could not retrieve notes' });
    }
  } else {
    res.status(400).json({ error: 'task id missing' });
  }
};
