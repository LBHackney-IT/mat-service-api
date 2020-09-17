import CrmGateway, {
  CrmGatewayInterface,
  GetOfficersByAreaIdResponse,
  OfficerInterface,
} from '../../gateways/crmGateway';

interface GetUsersResponse {
  body?: OfficerInterface[];
  error?: number;
}

interface GetUsersInterface {
  execute(): Promise<GetUsersResponse>;
}

class GetUsers implements GetUsersInterface {
  crmGateway: CrmGatewayInterface;
  areaId: number;

  constructor(areaId: number) {
    this.crmGateway = new CrmGateway();
    this.areaId = areaId;
  }

  public async execute(): Promise<GetUsersResponse> {
    const response: GetOfficersByAreaIdResponse = await this.crmGateway.getOfficersByAreaId(
      this.areaId
    );

    [{ name: 'dds', patchid: '' }];

    switch (response.error) {
      case undefined:
        if (response.body === undefined || response.body[0] === undefined) {
          return { body: undefined, error: 404 };
        }
        return {
          body: response,
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

export default GetUsers;
