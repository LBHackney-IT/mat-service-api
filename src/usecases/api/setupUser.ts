import GetUser from './getUser';
import CreateUserMapping from './createUserMapping';
import UserMapping from '../../interfaces/userMapping';
import CheckUserMappingExists from './checkUserMappingExists';
import CreateUser from './createUser';
import jwt from 'jsonwebtoken';

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

export default async (
  hackneyTokenString: string
): Promise<SetupUserResponse> => {
  try {
    // Extract the user details
    const hackneyToken = jwt.decode(hackneyTokenString) as HackneyToken;
    if (!hackneyToken || !hackneyToken.email) return { error: 'Invalid token' };
    // Check if we already have a mapping for this user
    const checkUserMappingExists = new CheckUserMappingExists(
      hackneyToken.email
    );
    const existingUserMapping = await checkUserMappingExists.execute();

    if (existingUserMapping.body) {
      return { body: undefined, error: undefined };
    } else {
      // Fetch the CRM user
      const getUser = new GetUser(hackneyToken.email);
      const response = await getUser.execute();
      let crmUserGuid = response.body;

      // Create a new CRM user if they don't exist
      if (!crmUserGuid) {
        const splitName = hackneyToken.name.split(' ');
        const user = {
          fullName: hackneyToken.name,
          firstName: splitName[0],
          familyName: splitName[splitName.length - 1],
          emailAddress: hackneyToken.email,
        };
        const createUser = new CreateUser(user);
        const crmCreateResponse = await createUser.execute();
        crmUserGuid = crmCreateResponse.body;
        if (!crmUserGuid) return { error: 'Error creating CRM user' };
      }

      // Create the mapping in postgres
      const userMapping: UserMapping = {
        username: hackneyToken.name,
        emailAddress: hackneyToken.email,
        googleId: hackneyToken.sub.toString(),
        usercrmid: crmUserGuid,
      };
      const createUserMapping = new CreateUserMapping(userMapping);
      const createResponse = await createUserMapping.execute();
      if (createResponse.error) return { error: 'Error creating user mapping' };

      return { error: undefined };
    }
  } catch (e) {
    return { error: e.message };
  }
};
