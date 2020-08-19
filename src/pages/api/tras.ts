import { NextApiRequest, NextApiResponse } from "next"
import { TRA } from '../../interfaces/tra';
import GetTRAsByPatchId from '../../usecases/api/getTRAsByPatchId';

type Data = TRA[] | undefined;

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const patchId = req.query.patchId
        ? Array.isArray(req.query.patchId)
            ? req.query.patchId[0]
            : req.query.patchId
        : undefined;

    if(patchId != undefined){
        const getTRAs = new GetTRAsByPatchId(patchId);
        switch (req.method){
            case 'GET':
                const response = await getTRAs.execute();
                
                if(response.error === undefined){
                    res.status(200).json(response.body)
                }
                else{
                    res.status(response.error).end()
                }
                break
            default:
                res.setHeader('Allow', ['GET'])
                res.status(405).end(`Methoid ${req.method} Not Allowed`)
        }
    }
    else{
        res.status(400).end();
    }
}