import UserMapping from '../../interfaces/userMapping';
import jwt from 'jsonwebtoken';
import { MatPostgresGatewayInterface } from '../../gateways/matPostgresGateway';
import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { Result, isError } from '../../lib/utils';

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
  execute(hackneyTokenString: string): Promise<Result<boolean>>;
}

export default class SetupUser implements SetupUserInterface {
  matPostgresGateway: MatPostgresGatewayInterface;
  crmGateway: CrmGatewayInterface;

  constructor(
    matPostgresGateway: MatPostgresGatewayInterface,
    crmGateway: CrmGatewayInterface
  ) {
    this.matPostgresGateway = matPostgresGateway;
    this.crmGateway = crmGateway;
  }

  async execute(hackneyTokenString: string): Promise<Result<boolean>> {
    try {
      // Extract the user details
      const hackneyToken = jwt.decode(hackneyTokenString) as HackneyToken;
      if (!hackneyToken || !hackneyToken.email)
        return new Error('Invalid token');

      // Check if we already have a mapping for this user
      const userMappingExists = await this.matPostgresGateway.getUserMapping(
        hackneyToken.email
      );
      if (isError(userMappingExists)) return userMappingExists;

      if (userMappingExists) {
        return true;
      } else {
        // Fetch the CRM user
        let crmUserGuid = await this.crmGateway.getUserId(hackneyToken.email);

        // Create a new CRM user if they don't exist
        if (isError(crmUserGuid)) {
          if (crmUserGuid.message === 'Could not find user in crm') {
            const splitName = hackneyToken.name.split(' ');
            const crmCreateResponse = await this.crmGateway.createUser(
              hackneyToken.email,
              hackneyToken.name,
              splitName[0],
              splitName[splitName.length - 1]
            );
            if (crmCreateResponse.error || !crmCreateResponse.body) {
              return new Error('Error creating CRM user');
            }
            crmUserGuid = crmCreateResponse.body;
          } else {
            return crmUserGuid;
          }
        }

        // Create the mapping in postgres
        const userMapping: UserMapping = {
          username: hackneyToken.name,
          emailAddress: hackneyToken.email,
          googleId: hackneyToken.sub.toString(),
          usercrmid: crmUserGuid,
        };
        const createResponse = await this.matPostgresGateway.createUserMapping(
          userMapping
        );

        if (isError(createResponse)) {
          return new Error('Error creating user mapping');
        }

        return true;
      }
    } catch (e) {
      return e;
    }
  }
}
