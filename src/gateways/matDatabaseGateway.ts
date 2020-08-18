import { TRA } from '../interfaces/tra'

interface GetTRAsResponse{
    body: TRA[] | undefined;
    error: string | undefined;
}

export interface MaTDatabaseGatewayInterface{
    getTRAsByPatchId(patchId: string): any;
}

class MaTDatabaseGateway implements MaTDatabaseGatewayInterface{
    public async getTRAsByPatchId(patchId: string): Promise<GetTRAsResponse>{
        return Promise.resolve({
            body: [
                {
                    id: 1,
                    name: "Alden and Broadway TRA",
                    patchid: "700aa678-df4d-e811-8122-70106faa1531" 
                },
                {
                    id: 2,
                    name: "Blackstone Estate TRA",
                    patchid: "46a2d989-df4d-e811-8122-70106faa1531" 
                },
                {
                    id: 3,
                    name: "De Beauvoir TRA",
                    patchid: "083d7292-df4d-e811-8122-70106faa1531" 
                }         
            ],
            error: undefined
        })
    }
}

export default MaTDatabaseGateway;