import { MatPostgresGatewayInterface } from '../../gateways/matPostgresGateway';
import { Result } from '../../lib/utils';

export interface CheckUserMappingExistsInterface {
  execute(emailAddress: string): Promise<Result<boolean>>;
}

class CheckUserMappingExists implements CheckUserMappingExistsInterface {
  matPostgresGateway: MatPostgresGatewayInterface;

  constructor(matPostgresGateway: MatPostgresGatewayInterface) {
    this.matPostgresGateway = matPostgresGateway;
  }

  public async execute(emailAddress: string): Promise<Result<boolean>> {
    const result = await this.matPostgresGateway.getUserMapping(emailAddress);
    //TODO: Should return an error instead
    if (result.error !== undefined) {
      console.log(result.error);
      return false;
    }
    if (!result.body) return false;
    return true;
  }
}

export default CheckUserMappingExists;
