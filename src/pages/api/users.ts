import { NextApiRequest, NextApiResponse } from 'next';
import GetUser from '../../usecases/api/getUser';
import GetOfficersPerArea from '../../usecases/api/getOfficersPerArea';
import CreateUser from '../../usecases/api/createUser';
import CrmGateway from '../../gateways/crmGateway';

interface Data {
  users: any | undefined;
}

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const emailAddress = req.query.emailAddress
    ? Array.isArray(req.query.emailAddress)
      ? req.query.emailAddress[0]
      : req.query.emailAddress
    : undefined;

  const managerAreaId = req.query.managerAreaId
    ? Array.isArray(req.query.managerAreaId)
      ? req.query.managerAreaId[0]
      : req.query.managerAreaId
    : undefined;

  switch (req.method) {
    case 'GET':
      if (emailAddress !== undefined) {
        const getUser = new GetUser(emailAddress);

        const response = await getUser.execute();

        if (response.error === undefined) {
          res.status(200).json({ users: response.body });
        } else {
          res.status(response.error).end();
        }
        break;
      }

      if (managerAreaId !== undefined) {
        const areaId = parseInt(managerAreaId);
        const crmGateway = new CrmGateway();

        const allOfficers = new GetOfficersPerArea({ areaId, crmGateway });
        const response = await allOfficers.execute();

        if (response.error === undefined) {
          res.status(200).json({ users: response.body });
        } else {
          res.status(response.error).end();
        }
        break;
      }

      res.status(400).end();
      break;
    case 'POST':
      const user = {
        emailAddress: req.body.emailAddress,
        fullName: req.body.fullName,
        firstName: req.body.firstName,
        familyName: req.body.familyName,
      };

      const createUser = new CreateUser(user);

      const postResponse = await createUser.execute();
      if (postResponse.error === undefined) {
        res.status(201).json(postResponse.body);

        break;
      }
      res.status(postResponse.error).end();

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
