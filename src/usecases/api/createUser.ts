import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { Result } from '../../lib/utils';

export interface CreateUserInterface {
  execute(
    emailAddress: string,
    fullName: string,
    firstName: string,
    familyName: string
  ): Promise<Result<string>>;
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
  ): Promise<Result<string>> {
    const response = await this.crmGateway.createUser(
      emailAddress,
      fullName,
      firstName,
      familyName
    );

    if (response.body) return response.body;
    return new Error(response.error);
  }
}

export default CreateUser;
