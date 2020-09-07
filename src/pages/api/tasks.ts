import { NextApiRequest, NextApiResponse } from 'next';
import { Task } from '../../interfaces/task';
import GetTasksByPatchId from '../../usecases/api/getTasksByPatchId';
import CreateManualTaskUseCase from '../../usecases/api/createManualTask';
import v1MatAPIGateway from '../../gateways/v1MatAPIGateway';

type Data = Task[] | undefined;

const postHandler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (!process.env.V1_MAT_API_URL || !process.env.V1_MAT_API_TOKEN) {
    return res.status(204).end();
  }

  const gateway: v1MatAPIGateway = new v1MatAPIGateway({
    v1MatApiUrl: process.env.V1_MAT_API_URL,
    v1MatApiToken: process.env.V1_MAT_API_TOKEN,
  });

  const createTask = new CreateManualTaskUseCase({ gateway });

  createTask
    .execute({
      process: req.body.process,
      subProcess: <number>req.body.subProcess,
      tagRef: req.body.tag_ref,
      uprn: req.body.uprn,
    })
    .then((response) => {})
    .catch((error) => {});

  console.log(req.body);

  res.status(204).end();
};

const getHandler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const patchId = req.query.patchId
    ? Array.isArray(req.query.patchId)
      ? req.query.patchId[0]
      : req.query.patchId
    : undefined;

  if (patchId != undefined) {
    const getTasks = new GetTasksByPatchId(patchId);
    const response = await getTasks.execute();

    if (response.error === undefined) {
      res.status(200).json(response.body);
    } else {
      res.status(response.error).end();
    }
  } else {
    res.status(400).end();
  }
};

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  switch (req.method) {
    case 'GET':
      return await getHandler(req, res);
    case 'POST':
      return await postHandler(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
