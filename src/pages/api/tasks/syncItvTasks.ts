import { NextApiRequest, NextApiResponse } from 'next';
import CreateITVTasks from '../../../usecases/api/createITVTasks';
import V1MatAPIGateway from '../../../gateways/v1MatAPIGateway';
import CrmGateway from '../../../gateways/crmGateway';
import MatPostgresGateway from '../../../gateways/matPostgresGateway';
import { isSuccess } from '../../../lib/utils';

type Data = {
  result: string;
  message?: string;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
): Promise<void> => {
  if (req.method === 'POST') {
    if (!process.env.V1_MAT_API_URL || !process.env.V1_MAT_API_TOKEN) {
      return res
        .status(500)
        .json({ result: 'failure', message: 'Missing env vars' });
    }
    const v1MatAPIGateway: V1MatAPIGateway = new V1MatAPIGateway({
      v1MatApiUrl: process.env.V1_MAT_API_URL,
      v1MatApiToken: process.env.V1_MAT_API_TOKEN,
    });
    const crmGateway = new CrmGateway();
    const matPostgresGateway = new MatPostgresGateway();
    const usecase = new CreateITVTasks({
      v1MatAPIGateway,
      crmGateway,
      matPostgresGateway,
    });

    const result = await usecase.execute();

    if (isSuccess(result)) {
      res.status(200).json({ result: 'success' });
    } else {
      res.status(500).json({ result: 'failure', message: result.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
