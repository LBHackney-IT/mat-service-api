import { CrmResponse } from '../gateways/crmGateway';
import { PropertyPatchDetails } from '../interfaces/propertyPatchDetails';

export interface ProperyPatchCrmValue {
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

const crmToPropertyPatch = (
  crmData: CrmResponse<ProperyPatchCrmValue[]>
): PropertyPatchDetails => {
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
  };
};

export default crmToPropertyPatch;
