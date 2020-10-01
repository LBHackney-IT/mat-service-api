import CrmGateway, { CrmGatewayInterface } from '../../gateways/crmGateway';
import CrmTokenGateway from '../../gateways/crmTokenGateway';

interface CreateUserResponse {
  body?: string;
  error?: number;
}

interface CreateUserInterface {
  execute(): Promise<CreateUserResponse>;
}

class CreateUser implements CreateUserInterface {
  tasksGateway: CrmGatewayInterface;
  user: {
    emailAddress: string;
    fullName: string;
    firstName: string;
    familyName: string;
  };

  constructor(user: {
    emailAddress: string;
    fullName: string;
    firstName: string;
    familyName: string;
  }) {
    const crmTokenGateway = new CrmTokenGateway(
      `${process.env.CRM_TOKEN_API_URL}`,
      `${process.env.CRM_TOKEN_API_KEY}`
    );
    const crmGateway = new CrmGateway(
      `${process.env.CRM_API_URL}`,
      crmTokenGateway
    );
    this.tasksGateway = crmGateway;
    this.user = user;
  }

  public async execute(): Promise<CreateUserResponse> {
    const response = await this.tasksGateway.createUser(
      this.user.emailAddress,
      this.user.fullName,
      this.user.firstName,
      this.user.familyName
    );

    switch (response.error) {
      case undefined:
        return {
          body: response.body,
        };
      case 'NotAuthorised':
        return {
          error: 401,
        };
      default:
        return {
          error: 500,
        };
    }
  }
}

export default CreateUser;
