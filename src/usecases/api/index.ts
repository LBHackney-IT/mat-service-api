import {
  crmGateway,
  matPostgresGateway,
  v1MatAPIGateway,
} from '../../gateways';
import SetupUser from './setupUser';
import SendTaskToOfficerUseCase from './sendTaskToOfficer';
import SendTaskToManagerUseCase from './sendTaskToManager';
import GetExternalProcessUrl from './getExternalProcessUrl';
import CloseTask from './closeTask';
import CreateITVTasks from './createITVTasks';
import CreateNote from './createNote';
import GetTasksForTagRef from './getTasksForTagRef';
import GetOfficersPerArea from './getOfficersPerArea';
import GetTasksForAPatch from './getTasksForAPatch';
import GetTask from './getTask';
import GetTRAs from './getTRAs';
import CreateManualTaskUseCase from './createManualTask';
import GetNotesForTask from './getNotesForTask';
import GetOfficerPatch from './getOfficerPatch';

export const setupUser = new SetupUser(matPostgresGateway, crmGateway);
export const sendTaskToOfficer = new SendTaskToOfficerUseCase(
  crmGateway,
  v1MatAPIGateway,
  matPostgresGateway
);
export const sendTaskToManager = new SendTaskToManagerUseCase(
  crmGateway,
  v1MatAPIGateway,
  matPostgresGateway
);
export const getExternalProcessUrl = new GetExternalProcessUrl(
  `${process.env.PROCESS_TOKEN_ENCRYPTION_KEY}`,
  crmGateway,
  matPostgresGateway
);
export const closeTask = new CloseTask(
  crmGateway,
  v1MatAPIGateway,
  matPostgresGateway
);
export const createITVTasks = new CreateITVTasks(
  matPostgresGateway,
  v1MatAPIGateway,
  crmGateway
);
export const createNote = new CreateNote(v1MatAPIGateway, crmGateway);
export const getTasksForTagRef = new GetTasksForTagRef(crmGateway);
export const getOfficersPerArea = new GetOfficersPerArea(crmGateway);
export const getTasksForAPatch = new GetTasksForAPatch(crmGateway);
export const getTask = new GetTask(crmGateway);
export const getTRAs = new GetTRAs(matPostgresGateway, crmGateway);
export const createManualTask = new CreateManualTaskUseCase(
  crmGateway,
  v1MatAPIGateway,
  matPostgresGateway
);
export const getNotesForTask = new GetNotesForTask(crmGateway);
export const getOfficerPatch = new GetOfficerPatch(
  crmGateway,
  matPostgresGateway
);
