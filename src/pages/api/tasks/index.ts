import { NextApiRequest, NextApiResponse } from 'next';
import { Task } from '../../../interfaces/task';
import GetTasksForAPatch from '../../../usecases/api/getTasksForAPatch';
import GetTasksForTagRef from '../../../usecases/api/getTasksForTagRef';
import MatPostgresGateway from '../../../gateways/matPostgresGateway';
import CrmGateway from '../../../gateways/crmGateway';
import GetOfficerPatch from '../../../usecases/api/getOfficerPatch';
import setupUser from '../../../usecases/api/setupUser';
import V1MatAPIGateway from '../../../gateways/v1MatAPIGateway';
import CreateManualTaskUseCase from '../../../usecases/api/createManualTask';
import { PatchDetailsInterface } from '../../../mappings/crmToPatchDetails';
import { getTokenPayloadFromRequest } from '../../../usecases/api/getTokenPayload';

type Data = Task[] | { error: string } | undefined;

const postHandler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (!process.env.V1_MAT_API_URL || !process.env.V1_MAT_API_TOKEN) {
    return res.status(500).end();
  }

  const v1MatAPIGateway = new V1MatAPIGateway({
    v1MatApiUrl: process.env.V1_MAT_API_URL,
    v1MatApiToken: process.env.V1_MAT_API_TOKEN,
  });

  const crmGateway = new CrmGateway();
  const matPostgresGateway = new MatPostgresGateway();

  const createTask = new CreateManualTaskUseCase({
    v1MatAPIGateway,
    crmGateway,
    matPostgresGateway,
  });

  const userToken = getTokenPayloadFromRequest(req);
  if (!userToken) {
    return res.status(500).json({ error: 'could not find user token' });
  }

  const result = await createTask.execute({
    process: req.body.process,
    subProcess: <number>req.body.subProcess,
    tagRef: req.body.tagRef,
    officerEmail: userToken.email,
    officerName: userToken.name,
  });

  if (result.body) {
    res
      .status(303)
      .setHeader('Location', `/api/tasks/${result.body.interactionId}`);
    res.end();
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
    if (
      officerPatch &&
      officerPatch.body &&
      officerPatch.body.patchId !== undefined
    ) {
      const officerPatchDetails: PatchDetailsInterface = officerPatch.body;
      let patchId = officerPatchDetails.patchId;
      const isManager = officerPatchDetails.isManager;
      const areaManagerId =
        officerPatchDetails.areaManagerId !== undefined
          ? officerPatchDetails.areaManagerId
          : ''; //crm query will handle officer/manager queries

      const getTasks = new GetTasksForAPatch({
        crmGateway,
      });
      const response = await getTasks.execute(
        isManager,
        areaManagerId,
        patchId
      );

      if (response.body) {
        res.status(200).json(response.body);
      } else if (response.error) {
        if (response.error === 'NotAuthorised') {
          return res.status(401).json({ error: 'Not authorised' });
        }
        return res
          .status(500)
          .json({ error: `Unknown error: ${response.error}` });
      }
    } else {
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
