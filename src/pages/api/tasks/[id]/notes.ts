import { NextApiRequest } from 'next';
import { v1MatAPIGateway } from '../../../../gateways';
import { ApiResponse, NoteList } from '../../../../interfaces/apiResponses';
import { NewNote } from '../../../../interfaces/note';
import CreateTaskNote from '../../../../usecases/api/createNote';
import getNotesForTask from '../../../../usecases/api/getNotesForTask';

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
      const response = await getNotesForTask(id);

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
    const createTaskNote = new CreateTaskNote({ gateway: v1MatAPIGateway });

    const response = await createTaskNote.execute(note);

    if (response) {
      res.status(204).end();
    } else {
      res.status(500).end();
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
