import CrmGateway, { CrmGatewayInterface } from '../../gateways/crmGateway';
import CrmTokenGateway from '../../gateways/crmTokenGateway';

interface GetUserResponse {
  body?: string;
  error?: number;
}

interface GetUserInterface {
  execute(): Promise<GetUserResponse>;
}

class GetUser implements GetUserInterface {
  tasksGateway: CrmGatewayInterface;
  emailAddress: string;

  constructor(emailAddress: string) {
    const crmTokenGateway = new CrmTokenGateway(
      `${process.env.CRM_TOKEN_API_URL}`,
      `${process.env.CRM_TOKEN_API_KEY}`
    );
    const crmGateway = new CrmGateway(
      `${process.env.CRM_API_URL}`,
      crmTokenGateway
    );
    this.tasksGateway = crmGateway;
    this.emailAddress = emailAddress;
  }

  public async execute(): Promise<GetUserResponse> {
    const response = await this.tasksGateway.getUserId(this.emailAddress);

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
