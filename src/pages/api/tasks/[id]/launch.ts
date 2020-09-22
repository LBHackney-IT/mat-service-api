import GetExternalProcessUrlUseCase from '../../../../usecases/api/getExternalProcessUrl';
import CrmGateway from '../../../../gateways/crmGateway';
import { getTokenPayloadFromRequest } from '../../../../usecases/api/getTokenPayload';
import HackneyToken from '../../../../interfaces/hackneyToken';
import MatPostgresGateway from '../../../../gateways/matPostgresGateway';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse<any>) => {
  if (!process.env.PROCESS_TOKEN_ENCRYPTION_KEY) return res.status(500).end();

  const id = req.query.id
    ? Array.isArray(req.query.id)
      ? req.query.id[0]
      : req.query.id
    : undefined;
  if (!id) return res.status(500).end();

  const getTaskProcessUrl = new GetExternalProcessUrlUseCase({
    encryptionKey: process.env.PROCESS_TOKEN_ENCRYPTION_KEY,
    crmGateway: new CrmGateway(),
    matPostgresGateway: new MatPostgresGateway(),
  });

  const tokenPayload: HackneyToken | null = getTokenPayloadFromRequest(req);
  if (!tokenPayload) return res.status(500).end();

  const url = await getTaskProcessUrl.execute(id, tokenPayload.email);
  if (url.error) return res.status(500).end();

  return res.writeHead(301, { Location: url.body }).end();
};
