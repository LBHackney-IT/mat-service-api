import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { Result } from '../../lib/utils';
import { Officer } from '../../mappings/crmToOfficersDetails';

interface GetOfficersPerAreaInterface {
  execute(areaId: number): Promise<Result<Officer[]>>;
}

export default class GetOfficersPerArea implements GetOfficersPerAreaInterface {
  crmGateway: CrmGatewayInterface;

  constructor(crmGateway: CrmGatewayInterface) {
    this.crmGateway = crmGateway;
  }

  public async execute(areaId: number): Promise<Result<Officer[]>> {
    return this.crmGateway.getOfficersByAreaId(areaId);
  }
}
