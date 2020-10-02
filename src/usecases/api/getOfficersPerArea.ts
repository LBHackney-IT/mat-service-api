import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { Officer } from '../../mappings/crmToOfficersDetails';

interface GetOfficersPerAreaResponse {
  body?: Officer[];
  error?: number;
}

interface GetOfficersPerAreaInterface {
  execute(areaId: number): Promise<GetOfficersPerAreaResponse>;
}

export default class GetOfficersPerArea implements GetOfficersPerAreaInterface {
  crmGateway: CrmGatewayInterface;

  constructor(crmGateway: CrmGatewayInterface) {
    this.crmGateway = crmGateway;
  }

  public async execute(areaId: number): Promise<GetOfficersPerAreaResponse> {
    const officersResponse = await this.crmGateway.getOfficersByAreaId(areaId);

    switch (officersResponse.error) {
      case undefined:
        return {
          body: officersResponse.body,
          error: undefined,
        };
      case 'NotAuthorised':
        return {
          body: undefined,
          error: 401,
        };
      default:
        return {
          body: undefined,
          error: 500,
        };
    }
  }
}
