import CrmGateway, { CrmGatewayInterface } from '../../gateways/crmGateway';

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
    this.tasksGateway = new CrmGateway();
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
