export interface PatchDetails {
  patchid: string;
  patchname: string;
  officername: string;
}

interface cmrResponseInterface {
  '@odata.context': string;
  value: {
    hackney_estateofficerpatchid: string;
    hackney_name: string;
    '_hackney_patchid_value@OData.Community.Display.V1.FormattedValue': string;
  }[];
}

const crmToTaskDetails = (crmResponse: cmrResponseInterface): PatchDetails => {
  const patchDetails: PatchDetails = {
    officername:
      crmResponse.value[0][
        '_hackney_patchid_value@OData.Community.Display.V1.FormattedValue'
      ],
    patchname: crmResponse.value[0].hackney_name,
    patchid: crmResponse.value[0].hackney_estateofficerpatchid,
  };

  return patchDetails;
};

export default crmToTaskDetails;
