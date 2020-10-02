import { GetUserInterface } from './getUser';
import { CreateUserMappingInterface } from './createUserMapping';
import UserMapping from '../../interfaces/userMapping';
import { CheckUserMappingExistsInterface } from './checkUserMappingExists';
import { createUser } from './';
import jwt from 'jsonwebtoken';
import { CreateUserInterface } from './createUser';
import { isError, isSuccess } from '../../lib/utils';

interface SetupUserResponse {
  body?: boolean;
  error?: string;
}

interface HackneyToken {
  sub: string;
  email: string;
  iss: string;
  name: string;
  groups: string[];
  iat: number;
}

// TODO: Add test for this file

interface SetupUserInterface {
  execute(hackneyTokenString: string): Promise<SetupUserResponse>;
}

export default class SetupUser implements SetupUserInterface {
  createUserMappingUsecase: CreateUserMappingInterface;
  checkUserMappingExistsUsecase: CheckUserMappingExistsInterface;
  createUserUsecase: CreateUserInterface;
  getUserUsecase: GetUserInterface;

  constructor(
    createUserMappingUsecase: CreateUserMappingInterface,
    checkUserMappingExistsUsecase: CheckUserMappingExistsInterface,
    createUserUsecase: CreateUserInterface,
    getUserUsecase: GetUserInterface
  ) {
    this.createUserMappingUsecase = createUserMappingUsecase;
    this.checkUserMappingExistsUsecase = checkUserMappingExistsUsecase;
    this.createUserUsecase = createUserUsecase;
    this.getUserUsecase = getUserUsecase;
  }

  async execute(hackneyTokenString: string): Promise<SetupUserResponse> {
    try {
      // Extract the user details
      const hackneyToken = jwt.decode(hackneyTokenString) as HackneyToken;
      if (!hackneyToken || !hackneyToken.email)
        return { error: 'Invalid token' };

      // Check if we already have a mapping for this user
      const existingUserMapping = await this.checkUserMappingExistsUsecase.execute(
        hackneyToken.email
      );

      if (isSuccess(existingUserMapping)) {
        return { body: undefined, error: undefined };
      } else {
        // Fetch the CRM user
        const response = await this.getUserUsecase.execute(hackneyToken.email);
        let crmUserGuid = response.body;

        // Create a new CRM user if they don't exist
        if (!crmUserGuid) {
          const splitName = hackneyToken.name.split(' ');
          const crmCreateResponse = await createUser.execute(
            hackneyToken.email,
            hackneyToken.name,
            splitName[0],
            splitName[splitName.length - 1]
          );
          if (isError(crmCreateResponse)) {
            return { error: 'Error creating CRM user' };
          }
          crmUserGuid = crmCreateResponse;
        }

        // Create the mapping in postgres
        const userMapping: UserMapping = {
          username: hackneyToken.name,
          emailAddress: hackneyToken.email,
          googleId: hackneyToken.sub.toString(),
          usercrmid: crmUserGuid,
        };
        const createResponse = await this.createUserMappingUsecase.execute(
          userMapping
        );
        if (createResponse.error)
          return { error: 'Error creating user mapping' };

        return { error: undefined };
      }
    } catch (e) {
      return { error: e.message };
    }
  }
}
