import { NextApiRequest } from 'next';
import { ApiResponse } from '../../interfaces/apiResponses';
import { isSuccess } from '../../lib/utils';
import { getTRAs } from '../../usecases/api';
import { officerPatchAssociationInterface } from '../../usecases/api/getTRAs';

export default async (
  req: NextApiRequest,
  res: ApiResponse<officerPatchAssociationInterface>
): Promise<void> => {
  if (req.method === 'GET') {
    const emailAddress = req.query.emailAddress
      ? Array.isArray(req.query.emailAddress)
        ? req.query.emailAddress[0]
        : req.query.emailAddress
      : undefined;

    if (emailAddress != undefined) {
      const response = await getTRAs.execute(emailAddress);
      if (isSuccess(response)) {
        res.status(200).json(response);
      } else {
        res.status(500).json({ error: response.message });
      }
    } else {
      res.status(400).end();
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Methoid ${req.method} Not Allowed`);
  }
};
