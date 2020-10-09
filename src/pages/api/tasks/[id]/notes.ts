import { NextApiRequest } from 'next';
import { ApiResponse, NoteList } from '../../../../interfaces/apiResponses';
import { IncomingNote } from '../../../../interfaces/note';
import { isSuccess } from '../../../../lib/utils';
import { createNote } from '../../../../usecases/api';
import { getNotesForTask } from '../../../../usecases/api';
import { getTokenPayloadFromRequest } from '../../../../usecases/api/getTokenPayload';

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

      if (isSuccess(response)) {
        res.status(200).json({ notes: response });
      } else {
        res.status(500).json({ error: response.message });
      }
    } else {
      res.status(400).json({ error: 'task id missing' });
    }
  };

  const postHandler = async (req: NextApiRequest, res: ApiResponse<void>) => {
    const id = req.query.id
      ? Array.isArray(req.query.id)
        ? req.query.id[0]
        : req.query.id
      : undefined;
    if (!id) return res.status(500).json({ error: 'Interaction ID missing' });

    const note = req.body as IncomingNote;
    const tokenPayload = getTokenPayloadFromRequest(req);
    if (!tokenPayload)
      return res.status(500).json({ error: 'Hackney token ID missing' });

    const response = await createNote.execute(id, tokenPayload, note.text);

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
