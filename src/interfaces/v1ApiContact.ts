export default interface V1ApiContact {
  contactId: string;
  emailAddress: string | null;
  uprn: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  firstName: string;
  lastName: string;
  fullName: string;
  larn: string;
  telephone1: string | null;
  telephone2: string | null;
  telephone3: string | null;
  cautionaryAlert: boolean;
  propertyCautionaryAlert: boolean;
  houseRef: string | null;
  title: string | null | undefined;
  fullAddressDisplay?: string;
  fullAddressSearch: string;
  postCode: string;
  dateOfBirth: string;
  hackneyHomesId: string;
  disabled: boolean;
  relationship: string | null;
  extendedrelationship: string | null;
  responsible: boolean;
  age?: string;
}
