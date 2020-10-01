import { CrmGatewayInterface } from '../../gateways/crmGateway';

interface GetUserResponse {
  body?: string;
  error?: number;
}

export interface GetUserInterface {
  execute(emailAddress: string): Promise<GetUserResponse>;
}

class GetUser implements GetUserInterface {
  crmGateway: CrmGatewayInterface;

  constructor(crmGateway: CrmGatewayInterface) {
    this.crmGateway = crmGateway;
  }

  public async execute(emailAddress: string): Promise<GetUserResponse> {
    const response = await this.crmGateway.getUserId(emailAddress);

    switch (response.error) {
      case undefined:
        if (!response.body) return { body: undefined, error: 404 };
        return response as GetUserResponse;
      case 'NotAuthorised':
        return {
          body: undefined,
          error: 401,
        };
      default:
        return {
          body: undefined,
          error: 500,
        };
    }
  }
}

export default GetUser;
