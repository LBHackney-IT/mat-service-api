import { CrmGatewayInterface } from '../../gateways/crmGateway';

interface CreateUserResponse {
  body?: string;
  error?: number;
}

export interface CreateUserInterface {
  execute(
    emailAddress: string,
    fullName: string,
    firstName: string,
    familyName: string
  ): Promise<CreateUserResponse>;
}

class CreateUser implements CreateUserInterface {
  crmGateway: CrmGatewayInterface;

  constructor(crmGateway: CrmGatewayInterface) {
    this.crmGateway = crmGateway;
  }

  public async execute(
    emailAddress: string,
    fullName: string,
    firstName: string,
    familyName: string
  ): Promise<CreateUserResponse> {
    const response = await this.crmGateway.createUser(
      emailAddress,
      fullName,
      firstName,
      familyName
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
