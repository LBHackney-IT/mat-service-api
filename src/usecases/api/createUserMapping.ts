import MatPostgresGateway from '../../gateways/matPostgresGateway';
import UserMapping from '../../interfaces/userMapping';

interface CreateUserMappingResponse {
  error: number | undefined;
}

interface CreateUserMappingInterface {
  execute(): Promise<CreateUserMappingResponse>;
}

class CreateUserMapping implements CreateUserMappingInterface {
  userMapping: UserMapping;

  constructor(userMapping: UserMapping) {
    this.userMapping = userMapping;
  }

  public async execute() {
    const gateway = new MatPostgresGateway();

    const result = await gateway.createUserMapping(this.userMapping);

    if (result.error === undefined) {
      return Promise.resolve({
        error: undefined,
      });
    }

    return Promise.resolve({
      error: 500,
    });
  }
}

export default CreateUserMapping;
