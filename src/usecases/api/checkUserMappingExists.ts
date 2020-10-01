import { MatPostgresGatewayInterface } from '../../gateways/matPostgresGateway';

export interface CheckUserMappingExistsResponse {
  body: boolean;
  error: number | undefined;
}

export interface CheckUserMappingExistsInterface {
  execute(emailAddress: string): Promise<CheckUserMappingExistsResponse>;
}

class CheckUserMappingExists implements CheckUserMappingExistsInterface {
  matPostgresGateway: MatPostgresGatewayInterface;

  constructor(matPostgresGateway: MatPostgresGatewayInterface) {
    this.matPostgresGateway = matPostgresGateway;
  }

  public async execute(
    emailAddress: string
  ): Promise<CheckUserMappingExistsResponse> {
    const result = await this.matPostgresGateway.getUserMapping(emailAddress);

    if (result.error !== undefined) {
      return Promise.resolve({
        body: false,
        error: result.error,
      });
    }
    if (!result.body) {
      return Promise.resolve({
        body: false,
        error: undefined,
      });
    }
    return Promise.resolve({
      body: true,
      error: undefined,
    });
  }
}

export default CheckUserMappingExists;
