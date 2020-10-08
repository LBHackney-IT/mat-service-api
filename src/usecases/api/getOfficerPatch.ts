import { MatPostgresGatewayInterface } from '../../gateways/matPostgresGateway';
import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { PatchDetailsInterface } from '../../mappings/crmToPatchDetails';
import { isError, Result } from '../../lib/utils';

interface GetOfficerPatchInterface {
  execute(emailAddress: string): Promise<Result<PatchDetailsInterface>>;
}

class GetOfficerPatch implements GetOfficerPatchInterface {
  crmGateway: CrmGatewayInterface;
  matPostgresGateway: MatPostgresGatewayInterface;

  constructor(
    crmGateway: CrmGatewayInterface,
    matPostgresGateway: MatPostgresGatewayInterface
  ) {
    this.crmGateway = crmGateway;
    this.matPostgresGateway = matPostgresGateway;
  }

  public async execute(
    emailAddress: string
  ): Promise<Result<PatchDetailsInterface>> {
    const userDetails = await this.matPostgresGateway.getUserMapping(
      emailAddress
    );
    if (isError(userDetails) || !userDetails || !userDetails.usercrmid) {
      return new Error('Could not find officer in db');
    }

    const officerPatch = await this.crmGateway.getPatchByOfficerId(
      userDetails.usercrmid
    );
    if (!officerPatch.body) return new Error('Could not find officer in crm');

    return officerPatch.body;
  }
}

export default GetOfficerPatch;
