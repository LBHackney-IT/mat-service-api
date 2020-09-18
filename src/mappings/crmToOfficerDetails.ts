import { OfficerInterface, CrmResponse } from '../gateways/crmGateway';

// interface crmResponseInterface {
//   '@odata.context': string;
//   value: {
//     'hackney_estateofficerpropertypatchid.hackney_patchid': string;
//     'hackney_estateofficerpropertypatchid.hackney_estateofficerpatchid': string;
//   }[];
// }

export const crmResponseToTasks = (data: CrmResponse): OfficerInterface[] => {
  const crmOfficers = data.value; // as CrmTasks

  const officerArray: any = [];
  crmOfficers.forEach((element: any) => {
    const officer = {
      name: element.hackney_estateofficerpropertypatchid.hackney_patchid,
      patchid:
        hackney_estateofficerpropertypatchid.hackney_estateofficerpatchid,
    };
    officerArray.push(officer);
  });

  return officerArray;
};
