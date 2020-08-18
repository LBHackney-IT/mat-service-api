import MaTDatabaseGateway, { MaTDatabaseGatewayInterface } from '../../gateways/matDatabaseGateway'
import { TRA } from '../../interfaces/tra'

interface GetTRAsResponse{
    body: TRA[] | undefined
    error: number | undefined
}

interface GetTRAsInterface{
    execute(): Promise<GetTRAsResponse>
}

class GetTRAsByPatchId implements GetTRAsInterface{
    trasGateway: MaTDatabaseGatewayInterface;
    patchId: string;

    constructor(patchId: string){
        this.trasGateway = new MaTDatabaseGateway();
        this.patchId = patchId;
    }

    public async execute() :Promise<GetTRAsResponse>{
        const response = await this.trasGateway.getTRAsByPatchId(this.patchId);

        switch(response.error){
            case undefined:
                return{
                    body: response.body,
                    error: undefined
                }   
            case "NotAuthorised":
                return{
                    body: undefined,
                    error: 401
                }
            default:
                return{
                    body: undefined,
                    error: 500
                }             
        }
    }
}

export default GetTRAsByPatchId;