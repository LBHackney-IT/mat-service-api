import { NextApiRequest, NextApiResponse } from 'next';
import GetUser from '../../usecases/api/getUser';
import GetOfficersPerArea from '../../usecases/api/getOfficersPerArea';
import CrmGateway from '../../gateways/crmGateway';
import GetOfficerPatch from '../../usecases/api/getOfficerPatch';
import MatPostgresGateway from '../../gateways/matPostgresGateway';
import CrmTokenGateway from '../../gateways/crmTokenGateway';
import { crmGateway } from '../../gateways';

interface Data {
  users?: any;
  error?: string;
}

const doGet = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
): Promise<void> => {
  const emailAddress = req.query.emailAddress
    ? Array.isArray(req.query.emailAddress)
      ? req.query.emailAddress[0]
      : req.query.emailAddress
    : undefined;

  const managerEmail = req.query.managerEmail
    ? Array.isArray(req.query.managerEmail)
      ? req.query.managerEmail[0]
      : req.query.managerEmail
    : undefined;

  if (emailAddress !== undefined) {
    const getUser = new GetUser(emailAddress);

    const response = await getUser.execute();

    if (response.error === undefined) {
      res.status(200).json({ users: response.body });
    } else {
      res.status(response.error).end();
    }
    return;
  }

  if (managerEmail !== undefined) {
    const matPostgresGateway = new MatPostgresGateway();
    const getOfficerPatch = new GetOfficerPatch({
      emailAddress: managerEmail,
      crmGateway,
      matPostgresGateway,
    });
    const officerPatch = await getOfficerPatch.execute();
    if (
      !officerPatch ||
      !officerPatch.body ||
      officerPatch.body.areaId === undefined
    ) {
      return res.status(500).json({ error: 'Error fetching officer patch id' });
    }

    const allOfficers = new GetOfficersPerArea({
      areaId: officerPatch.body.areaId,
      crmGateway,
    });
    const response = await allOfficers.execute();

    if (response.error === undefined) {
      return res.status(200).json({ users: response.body });
    } else {
      return res.status(response.error).end();
    }
  }

  res.status(400).end();
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
): Promise<void> => {
  if (req.method === 'GET') {
    await doGet(req, res);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
