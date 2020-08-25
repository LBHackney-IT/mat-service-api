import { NextApiRequest, NextApiResponse } from "next"
import CheckUserMappingExists, { CheckUserMappingExistsResponse } from "../../usecases/api/checkUserMappingExists";
import CreateUserMapping from "../../usecases/api/createUserMapping";
import { post } from "cypress/types/jquery";

type Data = CheckUserMappingExistsResponse;

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  switch (req.method) {
    case 'GET':
      const emailAddress = req.query.emailAddress
        ? Array.isArray(req.query.emailAddress)
          ? req.query.emailAddress[0]
          : req.query.emailAddress
        : undefined;

      if(emailAddress !== undefined) {
        const checkUserMappingExists = new CheckUserMappingExists(emailAddress);
        const getResponse = await checkUserMappingExists.execute();
        if (getResponse.error === undefined) {
          res.status(200).json(getResponse)

          break
        }
        res.status(getResponse.error).end();

        break
      }

      res.status(400).end();
      break

    case 'POST':
      const userMapping = {
        name: req.body.name,
        emailAddress: req.body.emailAddress,
        usercrmid: req.body.usercrmid,
        googleId: req.body.googleId,
      };

      const createUserMapping = new CreateUserMapping(userMapping);
      const postResponse = await createUserMapping.execute();
      if (postResponse.error === undefined) {
        res.status(201)

        break
      }
      res.status(postResponse.error).end();
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }

}
