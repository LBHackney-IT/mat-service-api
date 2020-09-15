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

    if (userDetails.body && userDetails.body.usercrmid) {
      officerPatch = await this.crmGateway.getPatchByOfficerId(
        userDetails.body.usercrmid
      );
    } else {
      return {
        body: undefined,
        error: 404,
      };
    }

    const OfficerPatchDetails: PatchDetailsInterface = officerPatch.body;
    return {
      body: OfficerPatchDetails,
      error: undefined,
    };
  }
}

export default GetOfficerPatch;
