import CrmGateway, { CrmGatewayInterface } from "../../gateways/crmGateway";

interface CreateUserResponse {
  body: any | undefined
  error: number | undefined
}

interface CreateUserInterface {
  execute(): Promise<CreateUserResponse>;
}

class CreateUser implements CreateUserInterface {
  tasksGateway: CrmGatewayInterface;
  emailAddress: string;

  constructor(emailAddress: string) {
    this.tasksGateway = new CrmGateway();
    this.emailAddress = emailAddress;
  }

  public async execute(): Promise<CreateUserResponse> {
    const response = await this.tasksGateway.createUser(this.emailAddress);

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

export default CreateUser
