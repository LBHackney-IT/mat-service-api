import { MatPostgresGatewayInterface } from '../../gateways/matPostgresGateway';
import { CrmGatewayInterface } from '../../gateways/crmGateway';

interface OfficerPatchInterface {
  officerCrmId: string;
  patchId: string;
}

interface GetOfficerPatchResponse {
  body?: OfficerPatchInterface;
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
    let userPatch;

    const userDetails = await this.matPostgresGateway.getUserMapping(
      this.emailAddress
    );

    if (userDetails.body && userDetails.body.usercrmid) {
      userPatch = await this.crmGateway.getPatchByOfficerId(
        userDetails.body.usercrmid
      );
    } else {
      return {
        body: undefined,
        error: 404,
      };
    }

    const OfficerPatchDetails: OfficerPatchInterface = {
      officerCrmId: userDetails.body.usercrmid,
      patchId: userPatch.body.patchid,
    };

    return {
      body: OfficerPatchDetails,
      error: undefined,
    };
  }
}

export default GetOfficerPatch;
