export interface CrmResponseInterface {
  '@odata.context': string;
  value: [
    {
      '@odata.etag': string;
      '_hackney_estateofficerpropertypatchid_value@OData.Community.Display.V1.FormattedValue': string;
      hackney_estateofficerpropertypatchid_value: string;
      hackney_propertyareapatchid: string;
      'hackney_areaname@OData.Community.Display.V1.FormattedValue': string;
      hackney_areaname: number;
      'hackney_ward@OData.Community.Display.V1.FormattedValue': string;
      hackney_ward: number;
      ManagerFullName: string;
      OfficerFullName: string;
    }
  ];
}

export interface PropertyPatchDetailsInterface {
  patchCode: string;
  areaName: string;
  ward: string;
  officerFullName: string;
  original: CrmResponseInterface;
}

const crmToPropertyPatch = (
  crmData: CrmResponseInterface
): PropertyPatchDetailsInterface => {
  const patchData = crmData.value[0];
  return {
    patchCode:
      patchData[
        '_hackney_estateofficerpropertypatchid_value@OData.Community.Display.V1.FormattedValue'
      ],
    areaName:
      patchData['hackney_areaname@OData.Community.Display.V1.FormattedValue'],
    ward: patchData['hackney_ward@OData.Community.Display.V1.FormattedValue'],
    officerFullName: patchData['OfficerFullName'],
    original: crmData,
  };
};

export default crmToPropertyPatch;
