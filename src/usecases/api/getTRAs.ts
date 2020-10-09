import { MatPostgresGatewayInterface } from '../../gateways/matPostgresGateway';
import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { TRAPatchMappingResponseInterface } from '../../mappings/apiTRAToUiTRA';
import { isError, Result } from '../../lib/utils';

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

    if (isError(userDetails) || !userDetails) {
      return new Error('User not found');
    }

    const userPatch = await this.crmGateway.getPatchByOfficerId(
      userDetails.usercrmid
    );

    if (isError(userPatch) || !userPatch.patchId) {
      return {
        patchname: '',
        tras: [],
        officername: '',
      };
    }
    const tras = await this.matPostgresGateway.getTrasByPatchId(
      userPatch.patchId
    );
    if (isError(tras)) return tras;

    const traDetails: officerPatchAssociationInterface = {
      patchname: userPatch.patchName,
      tras: tras,
      officername: userPatch.officerName,
    };

    return traDetails;
  }
}
