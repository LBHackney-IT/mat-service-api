import { NextApiRequest, NextApiResponse } from 'next'
import GetUser from '../../usecases/api/getUser';
import CreateUser from '../../usecases/api/createUser';

interface Data { data: any | undefined };

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const emailAddress = req.query.emailAddress
    ? Array.isArray(req.query.emailAddress)
      ? req.query.emailAddress[0]
      : req.query.emailAddress
    : undefined;

  switch (req.method) {
    case 'GET':
      if (emailAddress !== undefined) {
        const getUser = new GetUser(emailAddress);

        const response = await getUser.execute();

        if (response.error === undefined) {
          res.status(200).json(response.body)
        } else {
          res.status(response.error).end()
        }
        break
      }
      res.status(400).end();
      break
    case 'POST':
      const user = {
        emailAddress: req.body.emailAddress,
        fullName: req.body.fullName,
        firstName: req.body.firstName,
        familyName: req.body.familyName
      };

      const createUser = new CreateUser(user);

      const postResponse = await createUser.execute();
      if (postResponse.error === undefined) {
        res.status(201).json(postResponse.body);

        break
      }
      res.status(postResponse.error).end();

    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
