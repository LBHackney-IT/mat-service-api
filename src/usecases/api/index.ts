import {
  crmGateway,
  matPostgresGateway,
  v1MatAPIGateway,
} from '../../gateways';
import CreateUser from './createUser';
import CreateUserMapping from './createUserMapping';
import CheckUserMappingExists from './checkUserMappingExists';
import GetUser from './getUser';
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

export const createUser = new CreateUser(crmGateway);
export const creatUserMapping = new CreateUserMapping(matPostgresGateway);
export const getUser = new GetUser(crmGateway);
export const checkUserMappingExists = new CheckUserMappingExists(
  matPostgresGateway
);
export const setupUser = new SetupUser(
  creatUserMapping,
  checkUserMappingExists,
  createUser,
  getUser
);
export const sendTaskToOfficer = new SendTaskToOfficerUseCase(
  crmGateway,
  v1MatAPIGateway,
  matPostgresGateway
);
export const SendTaskToManager = new SendTaskToManagerUseCase(
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
export const createNote = new CreateNote(v1MatAPIGateway);
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
