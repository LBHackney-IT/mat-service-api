export interface PatchDetailsInterface {
  patchId?: string;
  patchName?: string;
  officerName: string;
  officerId: string;
  isManager: boolean;
  areaManagerId?: string;
  areaId?: number;
}

export interface CrmPatchDetailsInterface {
  '@odata.context': string;
  value: {
    hackney_name: string;
    hackney_estateofficerid: string;
    'officermanagerId@OData.Community.Display.V1.FormattedValue'?: string;
    officerManagerId?: string;
    officerPatchId?: string;
    'officerAreaId@OData.Community.Display.V1.FormattedValue'?: string;
    officerAreaId?: number; //populated for officers and used for areaId
    areaId?: number; //populated for managers and used for areaId
    officerPatchName?: string;
    managerId?: string;
  }[];
}

const crmToPatchDetails = (
  crmResponse: CrmPatchDetailsInterface
): PatchDetailsInterface => {
  const patchDetails: PatchDetailsInterface = {
    patchId: crmResponse.value[0].officerPatchId,
    patchName: crmResponse.value[0].officerPatchName,
    officerName: crmResponse.value[0].hackney_name,
    officerId: crmResponse.value[0].hackney_estateofficerid,
    isManager: crmResponse.value[0].managerId !== undefined ? true : false,
    areaManagerId: getAreaManagerId(crmResponse),
    areaId: getAreaId(crmResponse),
  };

  return patchDetails;
};

const getAreaManagerId = (crmResponse: CrmPatchDetailsInterface) => {
  let areaManagerId = undefined;

  if (crmResponse.value[0].managerId != undefined) {
    areaManagerId = crmResponse.value[0].managerId;
  } else if (crmResponse.value[0]['officerManagerId'] != undefined) {
    areaManagerId = crmResponse.value[0]['officerManagerId'];
  }
  return areaManagerId;
};

const getAreaId = (crmResponse: CrmPatchDetailsInterface) => {
  let areaId = undefined;
  if (crmResponse.value[0].officerAreaId != undefined) {
    areaId = crmResponse.value[0].officerAreaId;
  } else if (crmResponse.value[0].areaId != undefined) {
    areaId = crmResponse.value[0].areaId;
  }
  return areaId;
};

export default crmToPatchDetails;
