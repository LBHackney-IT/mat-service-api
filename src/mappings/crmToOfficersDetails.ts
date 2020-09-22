import { CrmResponse } from '../gateways/crmGateway';

export interface Officer {
  name: string;
  id: string;
  patchid: string;
}

interface CrmOfficerValue {
  'estateOfficerId@OData.Community.Display.V1.FormattedValue': string;
  estateOfficerId: string;
  estateOfficerPatchId: string;
}

export interface CrmOfficers {
  '@odata.context': string;
  value: CrmOfficerValue[];
}

export const crmToOfficersDetails = (data: CrmResponse): Officer[] => {
  const crmOfficers = data as CrmOfficers;

  const officers: Officer[] = crmOfficers.value
    .map((officer: CrmOfficerValue) => convertCrmOfficerToOfficer(officer))
    .sort((a, b) => (a.name > b.name ? 1 : -1));

  return officers;
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
