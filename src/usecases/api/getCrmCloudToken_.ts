import CrmTokenGateway, { CrmTokenGatewayInterface } from "../../gateways/crmTokenGateway_";

interface GetCrmCouldTokenResponse {
  token: string | undefined
}

interface GetCrmCloudTokenInterface {
  execute(): Promise<GetCrmCouldTokenResponse>
}

class GetCrmCloudToken implements GetCrmCloudTokenInterface {
  crmTokenGateway: CrmTokenGatewayInterface;
  constructor() {
    this.crmTokenGateway = new CrmTokenGateway();
  }
  public async execute() :Promise<GetCrmCouldTokenResponse> {
    const response = await this.crmTokenGateway.getCloudToken();

    switch(response.error) {
      case undefined:
        return  {
          token: response.token
        }
      default:
        return {
          token: undefined
        }
    }
  }
}

export default GetCrmCloudToken;
