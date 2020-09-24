export default interface Contact {
  crmContactId: string;
  crmHouseholdId?: string;
  uhPersonNo?: number;
  emailAddress?: string | null;
  addressLine1?: string;
  addressLine2?: string;
  addressLine3?: string;
  firstName: string;
  lastName: string;
  telephone1?: string | null;
  telephone2?: string | null;
  telephone3?: string | null;
  title: string | null | undefined;
  postCode: string;
  dateOfBirth?: Date | undefined;
  disabled?: boolean;
  relationship?: string | null;
  extendedrelationship?: string | null;
  responsible: boolean;
}
