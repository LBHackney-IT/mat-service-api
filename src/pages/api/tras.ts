import { NextApiRequest, NextApiResponse } from "next"
import GetTRAs from "../../usecases/api/getTRAs";
import { officerPatchAssociationInterface } from '../../usecases/api/getTRAs'

type Data = officerPatchAssociationInterface | undefined

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const emailAddress = req.query.emailAddress
        ? Array.isArray(req.query.emailAddress)
            ? req.query.emailAddress[0]
            : req.query.emailAddress
        : undefined;

    if(emailAddress != undefined){
        const getTRAs = new GetTRAs(emailAddress)
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