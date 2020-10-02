import { getExternalProcessUrl } from '../../../../usecases/api';
import { getTokenPayloadFromRequest } from '../../../../usecases/api/getTokenPayload';
import HackneyToken from '../../../../interfaces/hackneyToken';
import { NextApiRequest } from 'next';
import { ApiResponse } from '../../../../interfaces/apiResponses';
import { isError } from '../../../../lib/utils';

export default async (
  req: NextApiRequest,
  res: ApiResponse<void>
): Promise<void> => {
  if (!process.env.PROCESS_TOKEN_ENCRYPTION_KEY) return res.status(500).end();

  const id = req.query.id
    ? Array.isArray(req.query.id)
      ? req.query.id[0]
      : req.query.id
    : undefined;
  if (!id) return res.status(500).end();

  const tokenPayload: HackneyToken | null = getTokenPayloadFromRequest(req);
  if (!tokenPayload) return res.status(500).end();

  const url = await getExternalProcessUrl.execute(id, tokenPayload.email);
  if (isError(url)) return res.status(500).end();

  res.writeHead(302, { Location: url });
  res.end();
};
