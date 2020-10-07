import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { Result } from '../../lib/utils';

export interface GetUserInterface {
  execute(emailAddress: string): Promise<Result<string>>;
}

class GetUser implements GetUserInterface {
  crmGateway: CrmGatewayInterface;

  constructor(crmGateway: CrmGatewayInterface) {
    this.crmGateway = crmGateway;
  }

  public async execute(emailAddress: string): Promise<Result<string>> {
    const response = await this.crmGateway.getUserId(emailAddress);

    if (!response.body && !response.error) return new Error('User not found');
    if (response.body) return response.body;
    return new Error(response.error);
  }
}

export default GetUser;
