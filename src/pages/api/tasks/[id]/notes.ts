import { NextApiRequest } from 'next';
import { ApiResponse, NoteList } from '../../../../interfaces/apiResponses';
import { NewNote } from '../../../../interfaces/note';
import { isSuccess } from '../../../../lib/utils';
import { createNote } from '../../../../usecases/api';
import { getNotesForTask } from '../../../../usecases/api';

export default async (
  req: NextApiRequest,
  res: ApiResponse<NoteList>
): Promise<void> => {
  const getHandler = async (
    req: NextApiRequest,
    res: ApiResponse<NoteList>
  ) => {
    const id = req.query.id
      ? Array.isArray(req.query.id)
        ? req.query.id[0]
        : req.query.id
      : undefined;

    if (id !== undefined) {
      const response = await getNotesForTask.execute(id);

      if (response.body) {
        res.status(200).json({ notes: response.body });
      } else {
        res
          .status(response.error || 500)
          .json({ error: 'could not retrieve notes' });
      }
    } else {
      res.status(400).json({ error: 'task id missing' });
    }
  };

  const postHandler = async (req: NextApiRequest, res: ApiResponse<void>) => {
    if (!process.env.V1_MAT_API_URL || !process.env.V1_MAT_API_TOKEN) {
      return res.status(500).end();
    }

    const note = req.body as NewNote;

    const response = await createNote.execute(note);

    if (isSuccess(response)) {
      res.status(204).end();
    } else {
      res.status(500).end({ error: response.message });
    }
  };

  switch (req.method) {
    case 'GET':
      return await getHandler(req, res);
    case 'POST':
      return await postHandler(req, res as ApiResponse<void>);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
