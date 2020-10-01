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
