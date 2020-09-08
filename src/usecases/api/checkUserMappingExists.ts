import MatPostgresGateway from '../../gateways/matPostgresGateway'

export interface CheckUserMappingExistsResponse {
  body: boolean,
  error: number | undefined
}

interface CheckUserMappingExistsInterface {
  execute(): Promise<CheckUserMappingExistsResponse>
}

class CheckUserMappingExists implements CheckUserMappingExistsInterface {
  emailAddress: string;

  constructor(emailAddress: string) {
    this.emailAddress = emailAddress;
  }
  public async execute(): Promise<CheckUserMappingExistsResponse> {
    const gateway = new MatPostgresGateway();

    const result = await gateway.getUserMapping(this.emailAddress);

    if (result.error !== undefined) {
      return Promise.resolve({
        body: false,
        error: result.error
      })
    }
    if (result.body) {
      return Promise.resolve({
        body: false,
        error: undefined
      })
    }
    return Promise.resolve({
      body: true,
      error: undefined
    })
  }
}

export default CheckUserMappingExists;
