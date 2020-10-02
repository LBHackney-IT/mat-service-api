import { MatPostgresGatewayInterface } from '../../gateways/matPostgresGateway';
import { CrmGatewayInterface } from '../../gateways/crmGateway';
import { TRAPatchMappingResponseInterface } from '../../mappings/apiTRAToUiTRA';

export interface officerPatchAssociationInterface {
  patchname?: string;
  tras: TRAPatchMappingResponseInterface[];
  officername: string;
}

interface GetTRAsResponseInterface {
  body?: officerPatchAssociationInterface;
  error?: number;
}

interface GetTRAsInterface {
  execute(emailAddress: string): Promise<GetTRAsResponseInterface>;
}

class GetTRAs implements GetTRAsInterface {
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
  ): Promise<GetTRAsResponseInterface> {
    if (emailAddress === undefined) return { error: 400 };

    try {
      const userDetails = await this.matPostgresGateway.getUserMapping(
        emailAddress
      );

      if (!userDetails.body) throw new Error('User not found');

      const userPatch = await this.crmGateway.getPatchByOfficerId(
        userDetails.body.usercrmid
      );

      let tras;

      if (
        userPatch !== undefined &&
        userPatch.body !== undefined &&
        userPatch.body.patchId !== undefined
      ) {
        tras = await this.matPostgresGateway.getTrasByPatchId(
          userPatch.body.patchId
        );
      } else {
        return {
          body: {
            patchname: '',
            tras: [],
            officername: '',
          },
        };
      }

      const traDetails: officerPatchAssociationInterface = {
        patchname: userPatch.body.patchName,
        tras: tras.body || [],
        officername: userPatch.body.officerName,
      };

      return { body: traDetails };
    } catch (error) {
      return { error: 500 };
    }
  }
}

export default GetTRAs;
