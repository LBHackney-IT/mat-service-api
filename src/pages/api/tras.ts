import { NextApiRequest, NextApiResponse } from 'next';
import { getTRAs } from '../../usecases/api';
import { officerPatchAssociationInterface } from '../../usecases/api/getTRAs';

type Data = officerPatchAssociationInterface | undefined;

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
): Promise<void> => {
  if (req.method === 'GET') {
    const emailAddress = req.query.emailAddress
      ? Array.isArray(req.query.emailAddress)
        ? req.query.emailAddress[0]
        : req.query.emailAddress
      : undefined;

    if (emailAddress != undefined) {
      const response = await getTRAs.execute(emailAddress);
      if (response.error === undefined) {
        res.status(200).json(response.body);
      } else {
        res.status(response.error).end();
      }
    } else {
      res.status(400).end();
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Methoid ${req.method} Not Allowed`);
  }
};
