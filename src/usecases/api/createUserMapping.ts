import { MatPostgresGatewayInterface } from '../../gateways/matPostgresGateway';
import UserMapping from '../../interfaces/userMapping';

interface CreateUserMappingResponse {
  error: number | undefined;
}

export interface CreateUserMappingInterface {
  execute(userMapping: UserMapping): Promise<CreateUserMappingResponse>;
}

class CreateUserMapping implements CreateUserMappingInterface {
  gateway: MatPostgresGatewayInterface;

  constructor(gateway: MatPostgresGatewayInterface) {
    this.gateway = gateway;
  }

  public async execute(
    userMapping: UserMapping
  ): Promise<CreateUserMappingResponse> {
    const result = await this.gateway.createUserMapping(userMapping);

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
