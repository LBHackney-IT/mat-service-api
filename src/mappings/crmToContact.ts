import Contact from '../interfaces/contact';

export const convertCrmContactToContact = (crmContact: CrmContact): Contact => {
  return {
    crmContactId: crmContact.contactid,
    crmHouseholdId: crmContact.hackney_household1_x002e_hackney_householdid,
    uhPersonNo: parseInt(crmContact.hackney_personno),
    title: crmContact.hackney_title,
    firstName: crmContact.firstname,
    lastName: crmContact.lastname,
    dateOfBirth: crmContact.birthdate
      ? new Date(Date.parse(crmContact.birthdate))
      : undefined,
    emailAddress: crmContact.emailaddress1,
    addressLine1: crmContact.address1_line1,
    addressLine2: crmContact.address1_line2,
    addressLine3: crmContact.address1_line3,
    postCode: crmContact.address1_postalcode,
    telephone1: crmContact.telephone1,
    telephone2: crmContact.telephone2,
    telephone3: crmContact.telephone3,
    disabled: crmContact.hackney_disabled,
    relationship: crmContact.hackney_relationship,
    responsible: crmContact.hackney_responsible,
  };
};

export const crmResponseToContacts = (data: CrmContacts): Contact[] => {
  return data.value.map(convertCrmContactToContact);
};

export interface CrmContacts {
  '@odata.context': string;
  value: CrmContact[];
}

export interface CrmContact {
  contactid: string;
  hackney_title: string;
  firstname: string;
  lastname: string;
  hackney_household1_x002e_hackney_householdid: string;
  hackney_responsible: boolean;
  hackney_disabled: boolean;
  address1_line1?: string;
  address1_line2?: string;
  address1_line3?: string;
  address1_postalcode: string;
  hackney_personno: string;
  emailaddress1?: string;
  birthdate: string;
  telephone1: string;
  telephone2: string;
  telephone3: string;
  hackney_relationship: string;
}
