export interface Contact {
  contactId: string;
  responsible: boolean;
  title: string;
  firstName: string;
  lastName: string;
}

export interface Tenancy {
  accountId: string;
  officerId: string;
  officerName: string;
  accountCreatedOn: Date;
  housingTenure: string;
  patchId: string;
  areaId: number;
  managerId: string;
  householdId: string;
  tagReference: string;
  neighbourhoodOffice: string;
  estateAddress: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  postCode: string;
  fullAddress: string;
  contacts: Contact[];
}
