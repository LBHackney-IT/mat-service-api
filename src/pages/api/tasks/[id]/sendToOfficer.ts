import { NextApiRequest } from 'next';
import { sendTaskToOfficer } from '../../../../usecases/api';
import { getTokenPayloadFromRequest } from '../../../../usecases/api/getTokenPayload';
import { ApiResponse } from '../../../../interfaces/apiResponses';
import { isSuccess } from '../../../../lib/utils';

export default async (
  req: NextApiRequest,
  res: ApiResponse<void>
): Promise<void> => {
  const taskId = req.query.id
    ? Array.isArray(req.query.id)
      ? req.query.id[0]
      : req.query.id
    : undefined;
  const newOfficerId = req.body.housingOfficerId;

  const loggedInUser = getTokenPayloadFromRequest(req);
  if (!loggedInUser) return res.status(500).end();

  if (!taskId) return res.status(400).json({ error: 'task id missing' });
  if (req.method !== 'POST') return res.status(405).end();
  if (!process.env.V1_MAT_API_URL || !process.env.V1_MAT_API_TOKEN) {
    return res.status(500).end();
  }

  const response = await sendTaskToOfficer.execute(
    taskId,
    loggedInUser,
    newOfficerId
  );

  if (isSuccess(response)) {
    res.status(204).end();
  } else {
    res.status(500).json({ error: 'Could not send task to officer' });
  }
};
