import { NextApiRequest, NextApiResponse } from 'next';
import { Task } from '../../../interfaces/task';
import GetTasksForAPatch from '../../../usecases/api/getTasksForAPatch';
import GetTasksForTagRef from '../../../usecases/api/getTasksForTagRef';
import MatPostgresGateway from '../../../gateways/matPostgresGateway';
import CrmGateway from '../../../gateways/crmGateway';
import GetOfficerPatch from '../../../usecases/api/getOfficerPatch';
import setupUser from '../../../usecases/api/setupUser';
import v1MatAPIGateway from '../../../gateways/v1MatAPIGateway';
import CreateManualTaskUseCase from '../../../usecases/api/createManualTask';
import { PatchDetailsInterface } from '../../../mappings/crmToPatchDetails';
const { getTokenPayload } = require('node-lambda-authorizer')({
  jwtSecret: process.env.JWT_SECRET,
});

type Data = Task[] | { error: string } | undefined;

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

  const result = await createTask.execute({
    process: req.body.process,
    subProcess: <number>req.body.subProcess,
    tagRef: req.body.tag_ref,
    uprn: req.body.uprn,
    officerEmail: userToken.email,
    officerName: userToken.name,
  });

  if (result.body) {
    res.status(204).end();
  } else {
    res.status(500).json(<Data>result);
  }
};

const getHandler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const crmGateway = new CrmGateway();
  const tag_ref = Array.isArray(req.query.tag_ref)
    ? req.query.tag_ref[0]
    : req.query.tag_ref;

  if (req.query.tag_ref) {
    console.log('Searching for tasks with tag_ref: ' + tag_ref);
    const getTasks = new GetTasksForTagRef({
      crmGateway,
    });

    const response = await getTasks.execute(tag_ref.replace('-', '/'));
    if (response && response.error === undefined) {
      res.status(200).json(response.body);
    } else if (response && response.error) {
      res.status(response.error).end();
    }
  } else {
    // Ensure the user is correctly set up
    const setupUserResult = await setupUser(<string>req.cookies.hackneyToken);
    if (setupUserResult.error) {
      console.log(setupUserResult.error);
      return res.status(400).end();
    }
    const emailAddress = req.query.emailAddress
      ? Array.isArray(req.query.emailAddress)
        ? req.query.emailAddress[0]
        : req.query.emailAddress
      : undefined;

    let officerPatch;
    const matPostgresGateway = new MatPostgresGateway();

    if (emailAddress !== undefined) {
      const getOfficerPatch = new GetOfficerPatch({
        emailAddress,
        crmGateway,
        matPostgresGateway,
      });
      officerPatch = await getOfficerPatch.execute();
    }
    if (officerPatch !== undefined && officerPatch.body !== undefined) {
      const officerPatchDetails: PatchDetailsInterface = officerPatch.body;
      let patchId = officerPatchDetails.patchId;
      const officerId = officerPatchDetails.officerId;
      const isManager = officerPatchDetails.isManager;
      const areaManagerId =
        officerPatchDetails.areaManagerId !== undefined
          ? officerPatchDetails.areaManagerId
          : ''; //crm query will handle officer/manager queries
      let getTasks;
      let response;

      getTasks = new GetTasksForAPatch({
        patchId,
        officerId,
        isManager,
        areaManagerId,
        crmGateway,
      });

      response = await getTasks.execute();

      if (response && response.error === undefined) {
        res.status(200).json(response.body);
      } else if (response && response.error) {
        res.status(response.error).end();
      }
    } else {
      console.log(officerPatch);
      res.status(400).json({ error: 'No user patch found' });
    }
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
