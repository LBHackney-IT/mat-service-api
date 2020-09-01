import MatPostgresGateway from '../../gateways/matPostgresGateway'
import CRMGateway from '../../gateways/crmGateway'
import { TRAPatchMappingResponseInterface } from '../../mappings/apiTRAToUiTRA'


export interface officerPatchAssociationInterface{
    patchname: string,
    tras: TRAPatchMappingResponseInterface[],
    officername: string
}

interface GetTRAsResponseInterface{
    body: officerPatchAssociationInterface | undefined
    error: number | undefined
}

interface GetTRAsInterface{
    execute(): Promise<GetTRAsResponseInterface>
}

class GetTRAs implements GetTRAsInterface{
    emailAddress: string;

    constructor(emailAddress: string){
        this.emailAddress = emailAddress;
    }

    public async execute(): Promise<GetTRAsResponseInterface>
    {
        if(this.emailAddress === undefined){
            return Promise.resolve({
                body: undefined,
                error: 400
            })
        }
        try
        {
            const matGateway = new MatPostgresGateway();
            const crmGateway = new CRMGateway();
            
            const userDetails = await matGateway.getUserMapping(this.emailAddress);
            const userPatch = await crmGateway.getPatchByOfficerId(userDetails.body.usercrmid)

            let tras;

            if(userPatch !== undefined && userPatch.body !== undefined && userPatch.body.patchid !== undefined){ 
                tras = await matGateway.getTrasByPatchId(userPatch.body.patchid);
            }
            else{
                return Promise.resolve({
                    body:  {
                        patchname: "",
                        tras: [],
                        officername: "" 
                    },
                    error: undefined
                })
            }

            const traDetails = {
                patchname: userPatch.body.patchname,
                tras: tras.body,
                officername: userPatch.body.officername                 
            }

            return Promise.resolve({
                body: traDetails,
                error: undefined
            })
        }
        catch(error){
            return Promise.resolve({
                body: undefined,
                error: 500
            })
        }
    }
}

export default GetTRAs;
