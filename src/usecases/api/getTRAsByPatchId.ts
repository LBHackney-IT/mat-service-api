import PostgresGateway from '../../gateways/matDatabaseGateway'
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
        //TODO: wrap this in try catch and build the response a below?
        try
        {
            const gateway = new PostgresGateway();
            const result = await gateway.getTrasByPatchId();
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

        //console.dir(response);
        // switch(response.error){
        //     case undefined:
        //         return{
        //             body: response.body,
        //             error: undefined
        //         }
        //     case "NotAuthorised":
        //         return{
        //             body: undefined,
        //             error: 401
        //         }
        //     default:
        //         return{
        //             body: undefined,
        //             error: 500
        //         }
        // }
    }
}

export default GetTRAsByPatchId;
