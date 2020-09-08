import CrmGateway, {
  CrmGatewayInterface,
  CrmGatewayGetUserResponse,
} from '../../gateways/crmGateway';

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
    const response: CrmGatewayGetUserResponse = await this.tasksGateway.getUser(
      this.emailAddress
    );

    switch (response.error) {
      case undefined:
        if (response.body === undefined || response.body[0] === undefined) {
          return { body: undefined, error: 404 };
        }
        return {
          body: response.body[0]['hackney_estateofficerid'],
          error: undefined,
        };
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
