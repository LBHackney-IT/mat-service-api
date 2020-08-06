import { NextApiRequest, NextApiResponse } from 'next'
import GetCrmCloudToken from "../../usecases/api/getCrmCloudToken";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const getCrmCloudToken = new GetCrmCloudToken();
  switch (req.method) {
    case 'GET':
      const response = await getCrmCloudToken.execute();
      res.status(200).json(response)

      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
