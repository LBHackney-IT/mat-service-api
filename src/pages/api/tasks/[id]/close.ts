import { NextApiRequest } from 'next';
import CloseTask from '../../../../usecases/api/closeTask';
import { getTokenPayloadFromRequest } from '../../../../usecases/api/getTokenPayload';
import { ApiResponse } from '../../../../interfaces/apiResponses';
import {
  v1MatAPIGateway,
  crmGateway,
  matPostgresGateway,
} from '../../../../gateways';

export default async (
  req: NextApiRequest,
  res: ApiResponse<void>
): Promise<void> => {
  const id = req.query.id
    ? Array.isArray(req.query.id)
      ? req.query.id[0]
      : req.query.id
    : undefined;

  const loggedInUser = getTokenPayloadFromRequest(req);
  if (!loggedInUser) return res.status(500).end();

  if (!id) return res.status(400).json({ error: 'task id missing' });
  if (req.method !== 'POST') return res.status(405).end();
  if (!process.env.V1_MAT_API_URL || !process.env.V1_MAT_API_TOKEN) {
    return res.status(500).end();
  }

  const closeTask = new CloseTask({
    crmGateway,
    v1ApiGateway: v1MatAPIGateway,
    matPostgresGateway,
  });
  const response = await closeTask.execute(id, loggedInUser.email);

  if (response.body) {
    res.status(204).end();
  } else {
    res.status(500).json({ error: 'Could not close task' });
  }
};
