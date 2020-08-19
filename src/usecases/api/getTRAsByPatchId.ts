import MaTDatabaseGateway from '../../gateways/matDatabaseGateway'
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
            const dbInstance = await MaTDatabaseGateway.getInstance();
            const results = await dbInstance.many('SELECT * FROM tra');

            //TODO: map the db object to domain object
            //TODO: what to return?
            return Promise.resolve({
                body: results,
                error: undefined
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