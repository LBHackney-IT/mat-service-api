import { NextApiRequest, NextApiResponse } from 'next';
import { Task } from '../../interfaces/task';
import GetTasksForAPatch from '../../usecases/api/getTasksForAPatch';
import MatPostgresGateway from '../../gateways/matPostgresGateway';
import CrmGateway from '../../gateways/crmGateway';
import GetOfficerPatch from '../../usecases/api/getOfficerPatch';
import v1MatAPIGateway from '../../gateways/v1MatAPIGateway';
import CreateManualTaskUseCase from '../../usecases/api/createManualTask';
const { getTokenPayload } = require('node-lambda-authorizer')({
  jwtSecret: process.env.JWT_SECRET,
});

type Data = Task[] | undefined;

const postHandler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (!process.env.V1_MAT_API_URL || !process.env.V1_MAT_API_TOKEN) {
    return res.status(500).end();
  }

  const gateway: v1MatAPIGateway = new v1MatAPIGateway({
    v1MatApiUrl: process.env.V1_MAT_API_URL,
    v1MatApiToken: process.env.V1_MAT_API_TOKEN,
  });

  const createTask = new CreateManualTaskUseCase({ gateway });

  const userToken = getTokenPayload(req);

  createTask
    .execute({
      process: req.body.process,
      subProcess: <number>req.body.subProcess,
      tagRef: req.body.tag_ref,
      uprn: req.body.uprn,
      officerEmail: userToken.email,
      officerName: userToken.name,
    })
    .then(() => {
      res.status(204).end();
    })
    .catch(() => {
      res.status(500).end();
    });
};

const getHandler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const emailAddress = req.query.emailAddress
    ? Array.isArray(req.query.emailAddress)
      ? req.query.emailAddress[0]
      : req.query.emailAddress
    : undefined;

  let userPatch;
  const crmGateway = new CrmGateway();
  const matPostgresGateway = new MatPostgresGateway();

  if (emailAddress !== undefined) {
    const getUserPatch = new GetOfficerPatch({
      emailAddress,
      crmGateway,
      matPostgresGateway,
    });
    userPatch = await getUserPatch.execute();
  }

  if (userPatch !== undefined && userPatch.body !== undefined) {
    const officerPatchDetails = userPatch.body;
    const patchId = officerPatchDetails.patchId;
    const officerId = officerPatchDetails.officerCrmId;
    const isManager = false; //TODO: agree on the logic to determine whether the logged in officer is a manager

    const getTasks = new GetTasksForAPatch({
      patchId,
      officerId,
      isManager,
      crmGateway,
    });

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
