import { Contact } from '../interfaces/contact';

export interface CrmContactsResponseInterface {
  '@odata.context': string;
  value: CrmContact[];
}

export interface CrmContact {
  '@odata.etag': string;
  address1_line3: string;
  hackney_membersid: string;
  'hackney_propertycautionaryalert@OData.Community.Display.V1.FormattedValue': string;
  hackney_propertycautionaryalert: boolean;
  address1_addressid: string;
  hackney_personno: string;
  hackney_hackneyhomesid: string;
  lastname: string;
  address1_postalcode: string;
  address1_city: string;
  'hackney_cautionaryalert@OData.Community.Display.V1.FormattedValue': string;
  hackney_cautionaryalert: boolean;
  address1_composite: string;
  contactid: string;
  firstname: string;
  hackney_uprn: string;
  hackney_title: string;
  address1_name: string;
  hackney_larn: string;
  address2_addressid: string;
  address3_addressid: string;
  address1_line1: string;
  address1_line2: string;
  _hackney_household_contactid_value: string;
}

export default (crmResponse: CrmContact): Contact => {
  return {
    crmContactId: crmResponse.contactid,
    crmHouseholdId: crmResponse._hackney_household_contactid_value,
    emailAddress: '',
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    firstName: crmResponse.firstname,
    lastName: crmResponse.lastname,
    telephone1: '',
    telephone2: '',
    telephone3: '',
    title: crmResponse.hackney_title,
    postCode: crmResponse.address1_postalcode,
    dateOfBirth: '',
    disabled: false,
    relationship: '',
    extendedrelationship: '',
    responsible: false,
  };
};
