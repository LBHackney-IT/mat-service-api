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
import GetExternalProcessUrl from './getExternalProcessUrl';
import CloseTask from './closeTask';

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
