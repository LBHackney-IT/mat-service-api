import { CrmGatewayInterface } from '../../gateways/crmGateway';

interface GetOfficersPerAreaResponse {
  body?: any;
  error?: number;
}

interface GetOfficersPerAreaOptions {
  areaId: number;
  crmGateway: CrmGatewayInterface;
}

interface OfficerInterface {
  name: string;
  id: string;
}

interface OfficersPerAreaInterface {
  officers: OfficerInterface[];
}

interface GetOfficersPerAreaInterface {
  execute(): Promise<GetOfficersPerAreaResponse>;
}

class GetOfficersPerArea implements GetOfficersPerAreaInterface {
  areaId?: number;
  crmGateway: CrmGatewayInterface;

  constructor(options: GetOfficersPerAreaOptions) {
    this.areaId = options.areaId;
    this.crmGateway = options.crmGateway;
  }

  public async execute(): Promise<GetOfficersPerAreaResponse> {
    let officersResponse;

    if (this.areaId !== undefined) {
      officersResponse = await this.crmGateway.getOfficersByAreaId(this.areaId);
    } else {
      return {
        body: undefined,
        error: 404,
      };
    }

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

export default GetOfficersPerArea;
