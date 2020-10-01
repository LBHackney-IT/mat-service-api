import { NextApiRequest, NextApiResponse } from 'next';
import CrmGateway from '../../gateways/crmGateway';
import CrmTokenGateway from '../../gateways/crmTokenGateway';
import MatPostgresGateway from '../../gateways/matPostgresGateway';
import GetTRAs from '../../usecases/api/getTRAs';
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
      const crmTokenGateway = new CrmTokenGateway();
      const crmGateway = new CrmGateway(
        `${process.env.CRM_API_URL}`,
        crmTokenGateway
      );
      const matPostgresGateway = new MatPostgresGateway();
      const getTRAs = new GetTRAs({ crmGateway, matPostgresGateway });

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
