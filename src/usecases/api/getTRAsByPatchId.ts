import MatPostgresGateway from '../../gateways/matPostgresGateway'
import { TRA } from '../../interfaces/tra'

interface GetTRAsResponse{
    body: TRA[] | undefined
    error: number | undefined
}

interface GetTRAsInterface{
    execute(): Promise<GetTRAsResponse>
}

class GetTRAsByPatchId implements GetTRAsInterface{
    trasGateway: undefined;
    patchId: string;

    constructor(patchId: string){
        this.patchId = patchId;
    }

    public async execute() :Promise<GetTRAsResponse>{
        try
        {
            const gateway = new MatPostgresGateway();
            const result = await gateway.getTrasByPatchId(this.patchId);
            
            return Promise.resolve({
                body: result.body,
                error: result.error
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

export default GetTRAsByPatchId;
