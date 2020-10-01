import { NextApiRequest, NextApiResponse } from 'next';
import { createITVTasks } from '../../../usecases/api';
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

    const result = await createITVTasks.execute(1);

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
