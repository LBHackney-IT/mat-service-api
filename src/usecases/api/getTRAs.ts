import { MatPostgresGatewayInterface } from '../../gateways/matPostgresGateway';
import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { TRAPatchMappingResponseInterface } from '../../mappings/apiTRAToUiTRA';
import { Result } from '../../lib/utils';

export interface officerPatchAssociationInterface {
  patchname?: string;
  tras: TRAPatchMappingResponseInterface[];
  officername: string;
}

interface GetTRAsInterface {
  execute(
    emailAddress: string
  ): Promise<Result<officerPatchAssociationInterface>>;
}

export default class GetTRAs implements GetTRAsInterface {
  matPostgresGateway: MatPostgresGatewayInterface;
  crmGateway: CrmGatewayInterface;

  constructor(
    matPostgresGateway: MatPostgresGatewayInterface,
    crmGateway: CrmGatewayInterface
  ) {
    this.matPostgresGateway = matPostgresGateway;
    this.crmGateway = crmGateway;
  }

  public async execute(
    emailAddress: string
  ): Promise<Result<officerPatchAssociationInterface>> {
    if (emailAddress === undefined) {
      return new Error('Error: email address missing');
    }

    const userDetails = await this.matPostgresGateway.getUserMapping(
      emailAddress
    );

    if (!userDetails.body) throw new Error('User not found');

    const userPatch = await this.crmGateway.getPatchByOfficerId(
      userDetails.body.usercrmid
    );

    if (!userPatch || !userPatch.body || !userPatch.body.patchId) {
      return {
        patchname: '',
        tras: [],
        officername: '',
      };
    }
    const tras = await this.matPostgresGateway.getTrasByPatchId(
      userPatch.body.patchId
    );

    const traDetails: officerPatchAssociationInterface = {
      patchname: userPatch.body.patchName,
      tras: tras.body || [],
      officername: userPatch.body.officerName,
    };

    return traDetails;
  }
}
