import { NextApiRequest, NextApiResponse } from 'next'
import { Task } from '../../interfaces/task';
import GetTasksForAPatch from '../../usecases/api/getTasksForAPatch';
import MatPostgresGateway from '../../gateways/matPostgresGateway';
import CrmGateway from '../../gateways/crmGateway';
import GetOfficerPatch from '../../usecases/api/getOfficerPatch';

type Data = Task[] | undefined;

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const emailAddress = req.query.emailAddress
    ? Array.isArray(req.query.emailAddress)
      ? req.query.emailAddress[0]
      : req.query.emailAddress
    : undefined;
  
    let userPatch;
    const crmGateway = new CrmGateway();
    const matPostgresGateway = new MatPostgresGateway();

    if(emailAddress !== undefined){
      const getUserPatch = new GetOfficerPatch({emailAddress, crmGateway, matPostgresGateway});
      userPatch = await getUserPatch.execute();
    }

    if(userPatch !== undefined && userPatch.body !== undefined){ 
      
      const officerPatchDetails = userPatch.body;
      const patchId =  officerPatchDetails.patchId
      const officerId = officerPatchDetails.officerCrmId;
      const isManager = false; //TODO: agree on the logic to determine whether the logged in officer is a manager

      const getTasks = new GetTasksForAPatch({patchId, officerId, isManager, crmGateway}); 
         
      switch (req.method) {
        case 'GET':
          const response = await getTasks.execute();
          if(response.error === undefined) {
            res.status(200).json(response.body)
          } else {
            res.status(response.error).end()
          }
          break
        default:
          res.setHeader('Allow', ['GET'])
          res.status(405).end(`Method ${req.method} Not Allowed`)
      }
    }
    else{
      res.status(400).end();
    }
}
