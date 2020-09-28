import { CrmResponse, GenericCrmResponse } from '../gateways/crmGateway';
import { Tenancy } from '../interfaces/tenancy';

export interface CrmTenancy {
  accountid: string;
  createdon: string;
  estateOfficerId: string;
  OfficerFullName: string;
  housing_tenure: string;
  hackney_estateofficerpatch3_x002e_hackney_estateofficerpatchid: string;
  hackney_propertyareapatch2_x002e_hackney_areaname: number;
  hackney_propertyareapatch2_x002e_hackney_managerpropertypatchid: string;
  _hackney_household_accountid_value: string;
  housing_tag_ref: string;
  hackney_propertyareapatch2_x002e_hackney_neighbourhoodofficedesc: string;
  hackney_propertyareapatch2_x002e_hackney_estateaddress: string;
  contact1_x002e_address1_line1: string;
  contact1_x002e_address1_line2: string;
  contact1_x002e_address1_line3: string;
  contact1_x002e_address1_postalcode: string;
  contact1_x002e_address1_composite: string;
  contact1_x002e_firstname: string;
  contact1_x002e_lastname: string;
  contact1_x002e_hackney_responsible: boolean;
  contact1_x002e_hackney_title: string;
  contact1_x002e_contactid: string;
}

export function crmResponseToTenancies(
  crmResponse: GenericCrmResponse<CrmTenancy[]>
): Tenancy[] {
  return Object.values(
    crmResponse.value.reduce((acc, t) => {
      const tenancy = crmTenancyToTenancy(t);
      const key = `${tenancy.accountId}-${tenancy.housingTenure}-${tenancy.fullAddress}`;
      if (!acc[key]) {
        acc[key] = tenancy;
      } else {
        const matching = acc[key].contacts.filter(
          (c) => c.contactId === tenancy.contacts[0].contactId
        );
        if (matching.length === 0) {
          acc[key].contacts.push(tenancy.contacts[0]);
          acc[key].contacts.sort().reverse();
        }
      }
      return acc;
    }, {} as { [key: string]: Tenancy })
  );
}

export function crmTenancyToTenancy(crmTenancy: CrmTenancy): Tenancy {
  return {
    accountId: crmTenancy.accountid,
    officerId: crmTenancy.estateOfficerId,
    officerName: crmTenancy.OfficerFullName,
    accountCreatedOn: new Date(Date.parse(crmTenancy.createdon)),
    housingTenure: crmTenancy.housing_tenure,
    patchId:
      crmTenancy.hackney_estateofficerpatch3_x002e_hackney_estateofficerpatchid,
    areaId: crmTenancy.hackney_propertyareapatch2_x002e_hackney_areaname,
    managerId:
      crmTenancy.hackney_propertyareapatch2_x002e_hackney_managerpropertypatchid,
    householdId: crmTenancy._hackney_household_accountid_value,
    tagReference: crmTenancy.housing_tag_ref,
    neighbourhoodOffice:
      crmTenancy.hackney_propertyareapatch2_x002e_hackney_neighbourhoodofficedesc,
    estateAddress:
      crmTenancy.hackney_propertyareapatch2_x002e_hackney_estateaddress,
    addressLine1: crmTenancy.contact1_x002e_address1_line1,
    addressLine2: crmTenancy.contact1_x002e_address1_line2,
    addressLine3: crmTenancy.contact1_x002e_address1_line3,
    postCode: crmTenancy.contact1_x002e_address1_postalcode,
    fullAddress: crmTenancy.contact1_x002e_address1_composite,
    contacts: [
      {
        contactId: crmTenancy.contact1_x002e_contactid,
        title: crmTenancy.contact1_x002e_hackney_title,
        firstName: crmTenancy.contact1_x002e_firstname,
        lastName: crmTenancy.contact1_x002e_lastname,
        responsible: crmTenancy.contact1_x002e_hackney_responsible,
      },
    ],
  };
}
