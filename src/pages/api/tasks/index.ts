import { NextApiRequest } from 'next';
import GetTasksForAPatch from '../../../usecases/api/getTasksForAPatch';
import { getTasksForTagRef } from '../../../usecases/api';
import GetOfficerPatch from '../../../usecases/api/getOfficerPatch';
import { setupUser } from '../../../usecases/api';
import CreateManualTaskUseCase from '../../../usecases/api/createManualTask';
import { PatchDetailsInterface } from '../../../mappings/crmToPatchDetails';
import { getTokenPayloadFromRequest } from '../../../usecases/api/getTokenPayload';
import { CreateTaskRequest } from '../../../usecases/ui/createTask';
import { ApiResponse, TaskList } from '../../../interfaces/apiResponses';
import {
  crmGateway,
  matPostgresGateway,
  v1MatAPIGateway,
} from '../../../gateways';

const postHandler = async (
  req: NextApiRequest,
  res: ApiResponse<void>
): Promise<void> => {
  if (!process.env.V1_MAT_API_URL || !process.env.V1_MAT_API_TOKEN) {
    return res.status(500).end();
  }

  const createTask = new CreateManualTaskUseCase({
    v1MatAPIGateway,
    crmGateway,
    matPostgresGateway,
  });

  const userToken = getTokenPayloadFromRequest(req);
  if (!userToken) {
    return res.status(500).json({ error: 'could not find user token' });
  }
  const body = req.body as CreateTaskRequest;
  if (!body.processType || !body.tagRef) {
    return res.status(400).json({ error: 'invalid request' });
  }
  const result = await createTask.execute({
    process: body.processType,
    subProcess: body.subProcess,
    tagRef: body.tagRef,
    officerEmail: userToken.email,
    officerName: userToken.name,
  });

  if (result.body) {
    res
      .status(303)
      .setHeader('Location', `/api/tasks/${result.body.interactionId}`);
    res.end();
  } else {
    res.status(500).json({ error: result.error || 'unknown' });
  }
};

const getHandler = async (
  req: NextApiRequest,
  res: ApiResponse<TaskList>
): Promise<void> => {
  const tag_ref = Array.isArray(req.query.tag_ref)
    ? req.query.tag_ref[0]
    : req.query.tag_ref;

  if (req.query.tag_ref) {
    const response = await getTasksForTagRef.execute(tag_ref.replace('-', '/'));
    if (response && response.body) {
      res.status(200).json({ tasks: response.body });
    } else if (response && response.error) {
      res.status(response.error).end();
    }
  } else {
    // Ensure the user is correctly set up
    const setupUserResult = await setupUser.execute(
      <string>req.cookies.hackneyToken
    );
    if (setupUserResult.error) {
      return res.status(400).end();
    }

    const tokenPayload = getTokenPayloadFromRequest(req);
    if (!tokenPayload || !tokenPayload.email) return res.status(400).end();

    const emailAddress = tokenPayload.email;

    const getOfficerPatch = new GetOfficerPatch({
      emailAddress,
      crmGateway,
      matPostgresGateway,
    });

    const officerPatch = await getOfficerPatch.execute();

    if (!officerPatch || !officerPatch.body) return res.status(400).end();

    const officerPatchDetails: PatchDetailsInterface = officerPatch.body;

    if (
      (officerPatchDetails.patchId && !officerPatchDetails.isManager) ||
      (officerPatchDetails.isManager && officerPatchDetails.areaManagerId)
    ) {
      const patchId = officerPatchDetails.patchId;
      const isManager = officerPatchDetails.isManager;
      const areaManagerId = officerPatchDetails.areaManagerId || ''; //crm query will handle officer/manager queries

      const getTasks = new GetTasksForAPatch({
        crmGateway,
      });
      const response = await getTasks.execute(
        isManager,
        areaManagerId,
        patchId
      );

      if (response.body) {
        res.status(200).json({ tasks: response.body });
      } else if (response.error) {
        if (response.error === 'NotAuthorised') {
          return res.status(401).json({ error: 'Not authorised' });
        }
        return res
          .status(500)
          .json({ error: `Unknown error: ${response.error}` });
      }
    } else {
      res.status(400).json({ error: 'No user patch or area found' });
    }
  }
};

export default async (
  req: NextApiRequest,
  res: ApiResponse<unknown>
): Promise<void> => {
  switch (req.method) {
    case 'GET':
      return await getHandler(req, res as ApiResponse<TaskList>);
    case 'POST':
      return await postHandler(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
