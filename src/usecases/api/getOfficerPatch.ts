import { MatPostgresGatewayInterface } from '../../gateways/matPostgresGateway';
import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { PatchDetailsInterface } from '../../mappings/crmToPatchDetails';

interface GetOfficerPatchResponse {
  body?: PatchDetailsInterface;
  error?: number;
}

interface GetOfficerPatchInterface {
  execute(emailAddress: string): Promise<GetOfficerPatchResponse>;
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

  public async execute(emailAddress: string): Promise<GetOfficerPatchResponse> {
    const userDetails = await this.matPostgresGateway.getUserMapping(
      emailAddress
    );
    if (!userDetails.body || !userDetails.body.usercrmid) return { error: 404 };

    const officerPatch = await this.crmGateway.getPatchByOfficerId(
      userDetails.body.usercrmid
    );
    if (!officerPatch.body) return { error: 404 };

    return {
      body: officerPatch.body,
      error: undefined,
    };
  }
}

export default GetOfficerPatch;
