import { MatPostgresGatewayInterface } from '../../gateways/matPostgresGateway';
import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { PatchDetailsInterface } from '../../mappings/crmToPatchDetails';

interface GetOfficerPatchResponse {
  body?: PatchDetailsInterface;
  error?: number;
}

interface GetOfficerPatchOptions {
  emailAddress: string;
  crmGateway: CrmGatewayInterface;
  matPostgresGateway: MatPostgresGatewayInterface;
}

interface GetOfficerPatchInterface {
  execute(): Promise<GetOfficerPatchResponse>;
}

class GetOfficerPatch implements GetOfficerPatchInterface {
  emailAddress: string;
  crmGateway: CrmGatewayInterface;
  matPostgresGateway: MatPostgresGatewayInterface;

  constructor(options: GetOfficerPatchOptions) {
    this.emailAddress = options.emailAddress;
    this.crmGateway = options.crmGateway;
    this.matPostgresGateway = options.matPostgresGateway;
  }

  public async execute(): Promise<GetOfficerPatchResponse> {
    let officerPatch;

    const userDetails = await this.matPostgresGateway.getUserMapping(
      this.emailAddress
    );
    if (!userDetails.body || !userDetails.body.usercrmid) return { error: 404 };

    officerPatch = await this.crmGateway.getPatchByOfficerId(
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
