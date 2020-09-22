import GetUsers from '../../../../usecases/api/getUsers';
import { NextApiRequest, NextApiResponse } from 'next';
import SendTaskToOfficerUseCase from '../../../../usecases/api/sendTaskToOfficer';
import v1MatAPIGateway from '../../../../gateways/v1MatAPIGateway';
import CrmGateway from '../../../../gateways/crmGateway';
import MatPostgresGateway from '../../../../gateways/matPostgresGateway';
import { getTokenPayloadFromRequest } from '../../../../usecases/api/getTokenPayload';

export default async (req: NextApiRequest, res: NextApiResponse<any>) => {
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

  const v1ApiGateway: v1MatAPIGateway = new v1MatAPIGateway({
    v1MatApiUrl: process.env.V1_MAT_API_URL,
    v1MatApiToken: process.env.V1_MAT_API_TOKEN,
  });
  const crmGateway = new CrmGateway();
  const matPostgresGateway = new MatPostgresGateway();

  const sendTaskToOfficer = new SendTaskToOfficerUseCase({
    v1ApiGateway,
    crmGateway,
    matPostgresGateway,
  });
  const response = await sendTaskToOfficer.execute(
    taskId,
    loggedInUser,
    newOfficerId
  );

  if (response.body) {
    res.status(204).end();
  } else {
    res.status(500).json({ error: 'Could not send task to officer' });
  }
};
