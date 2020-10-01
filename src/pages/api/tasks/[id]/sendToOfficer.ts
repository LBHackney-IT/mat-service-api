import { NextApiRequest } from 'next';
import SendTaskToOfficerUseCase from '../../../../usecases/api/sendTaskToOfficer';
import v1MatAPIGateway from '../../../../gateways/v1MatAPIGateway';
import CrmGateway from '../../../../gateways/crmGateway';
import MatPostgresGateway from '../../../../gateways/matPostgresGateway';
import { getTokenPayloadFromRequest } from '../../../../usecases/api/getTokenPayload';
import { ApiResponse } from '../../../../interfaces/apiResponses';
import CrmTokenGateway from '../../../../gateways/crmTokenGateway';

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

  const v1ApiGateway: v1MatAPIGateway = new v1MatAPIGateway({
    v1MatApiUrl: process.env.V1_MAT_API_URL,
    v1MatApiToken: process.env.V1_MAT_API_TOKEN,
  });
  const crmTokenGateway = new CrmTokenGateway(
    `${process.env.CRM_TOKEN_API_URL}`,
    `${process.env.CRM_TOKEN_API_KEY}`
  );
  const crmGateway = new CrmGateway(
    `${process.env.CRM_API_URL}`,
    crmTokenGateway
  );
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
