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
  user: {
    emailAddress: string,
    fullName: string,
    firstName: string,
    familyName: string
  };

  constructor(user: {
    emailAddress: string,
    fullName: string,
    firstName: string,
    familyName: string
  }) {
    this.tasksGateway = new CrmGateway();
    this.user = user;
  }

  public async execute(): Promise<CreateUserResponse> {
    const response = await this.tasksGateway.createUser(this.user.emailAddress, this.user.fullName, this.user.firstName, this.user.familyName);

    switch (response.error) {
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
