import MatPostgresGateway from "../../gateways/matPostgresGateway";

interface CreateUserMapping {
  error: number | undefined
}

interface UserMapping {
  name: any;
  emailAddress: any;
  usercrmid: any;
  googleId: any;
}

interface CreateUserMappingInterface {
  execute(): Promise<CreateUserMapping>
}

class CreateUserMapping implements CreateUserMappingInterface {
  userMapping: UserMapping;

  constructor(userMapping: UserMapping) {
    this.userMapping = userMapping
  }

  public async execute() {
    const gateway = new MatPostgresGateway();

    const result = await gateway.createUserMapping(this.userMapping);

    if (result.error === undefined) {
      return Promise.resolve({
        error: undefined
      })
    }

    return Promise.resolve({
      error: 500
    })
  }
}

export default CreateUserMapping;
