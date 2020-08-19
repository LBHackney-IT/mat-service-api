import CrmGateway, { CrmGatewayInterface } from "../../gateways/crmGateway";

interface GetUserResponse {
  body: any | undefined
  error: number | undefined
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
    const response = await this.tasksGateway.getUser(this.emailAddress);

    switch(response.error) {
      case undefined:
        return {
          body: response.body,
          error: undefined
        }
      case "NotAuthorised":
        return {
          body: undefined,
          error: 401
        }
      default:
        return {
          body: undefined,
          error: 500
        }
    }
  }
}

export default GetUser
