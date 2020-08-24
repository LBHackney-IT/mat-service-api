import { NextApiRequest, NextApiResponse } from "next"
import CheckUserMappingExists, { CheckUserMappingExistsResponse } from "../../usecases/api/checkUserMappingExists";

type Data = CheckUserMappingExistsResponse;

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const emailAddress = req.query.emailAddress
    ? Array.isArray(req.query.emailAddress)
      ? req.query.emailAddress[0]
      : req.query.emailAddress
    : undefined;

  if (emailAddress !== undefined) {
    const checkUserMappingExists = new CheckUserMappingExists(emailAddress);
    switch (req.method) {
      case 'GET':
        const response = await checkUserMappingExists.execute();
        if (response.error === undefined) {
          res.status(200).json(response)

          break
        }
        res.status(response.error);

        break
      default:
        res.setHeader('Allow', ['GET'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  }
}
