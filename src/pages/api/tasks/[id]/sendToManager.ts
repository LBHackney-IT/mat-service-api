import { NextApiRequest, NextApiResponse } from 'next';
import SendTaskToManager from '../../../../usecases/api/sendTaskToManager';
import v1MatAPIGateway from '../../../../gateways/v1MatAPIGateway';

export default async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const id = req.query.id
    ? Array.isArray(req.query.id)
      ? req.query.id[0]
      : req.query.id
    : undefined;

  if (!id) return res.status(400).json({ error: 'task id missing' });
  if (req.method !== 'POST') return res.status(405).end();
  if (!process.env.V1_MAT_API_URL || !process.env.V1_MAT_API_TOKEN) {
    return res.status(500).end();
  }

  const gateway: v1MatAPIGateway = new v1MatAPIGateway({
    v1MatApiUrl: process.env.V1_MAT_API_URL,
    v1MatApiToken: process.env.V1_MAT_API_TOKEN,
  });
  const sendTaskToManager = new SendTaskToManager({ gateway });
  const response = await sendTaskToManager.execute(id);

  if (response.body) {
    res.status(204).end();
  } else {
    res
      .status(response.error || 500)
      .json({ error: 'Could not send task to manager' });
  }
};
