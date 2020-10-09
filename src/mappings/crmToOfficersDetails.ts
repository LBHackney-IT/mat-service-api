import { CrmResponse } from '../gateways/crmGateway';

export interface Officer {
  name: string;
  id: string;
  patchid: string;
}

export type CrmOfficerValue = {
  'estateOfficerId@OData.Community.Display.V1.FormattedValue': string;
  estateOfficerId: string;
  estateOfficerPatchId: string;
};

export const crmToOfficersDetails = (
  crmOfficers: CrmResponse<CrmOfficerValue[]>
): Officer[] => {
  return crmOfficers.value
    .map(convertCrmOfficerToOfficer)
    .sort((a, b) => (a.name > b.name ? 1 : -1));
};

function convertCrmOfficerToOfficer(crmOfficer: CrmOfficerValue) {
  const officer: Officer = {
    name:
      crmOfficer['estateOfficerId@OData.Community.Display.V1.FormattedValue'],
    id: crmOfficer.estateOfficerId,
    patchid: crmOfficer.estateOfficerPatchId,
  };
  return officer;
}
