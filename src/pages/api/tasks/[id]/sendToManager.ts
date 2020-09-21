import { NextApiRequest, NextApiResponse } from 'next';
import SendTaskToManager from '../../../../usecases/api/sendTaskToManager';
import V1MatAPIGateway from '../../../../gateways/v1MatAPIGateway';
import CrmGateway from '../../../../gateways/crmGateway';
import MatPostgresGateway from '../../../../gateways/matPostgresGateway';
import { getTokenPayloadFromRequest } from '../../../../usecases/api/getTokenPayload';

export default async (req: NextApiRequest, res: NextApiResponse<any>) => {
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

  const v1ApiGateway: V1MatAPIGateway = new V1MatAPIGateway({
    v1MatApiUrl: process.env.V1_MAT_API_URL,
    v1MatApiToken: process.env.V1_MAT_API_TOKEN,
  });
  const crmGateway = new CrmGateway();
  const matPostgresGateway = new MatPostgresGateway();

  const sendTaskToManager = new SendTaskToManager({
    v1ApiGateway,
    crmGateway,
    matPostgresGateway,
  });
  const response = await sendTaskToManager.execute(id, loggedInUser.email);

  if (response.body) {
    res.status(204).end();
  } else {
    res.status(500).json({ error: 'Could not send task to manager' });
  }
};
