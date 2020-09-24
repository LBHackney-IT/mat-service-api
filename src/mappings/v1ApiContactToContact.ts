import Contact from '../interfaces/contact';
import V1ApiContact from '../interfaces/v1ApiContact';

export default (v1ApiContact: V1ApiContact): Contact => {
  return {
    crmContactId: v1ApiContact.contactId,
    emailAddress: v1ApiContact.emailAddress,
    addressLine1: v1ApiContact.addressLine1,
    addressLine2: v1ApiContact.addressLine2,
    addressLine3: v1ApiContact.addressLine3,
    firstName: v1ApiContact.firstName,
    lastName: v1ApiContact.lastName,
    telephone1: v1ApiContact.telephone1,
    telephone2: v1ApiContact.telephone2,
    telephone3: v1ApiContact.telephone3,
    title: v1ApiContact.title,
    postCode: v1ApiContact.postCode,
    dateOfBirth: new Date(Date.parse(v1ApiContact.dateOfBirth)),
    disabled: v1ApiContact.disabled,
    relationship: v1ApiContact.relationship,
    extendedrelationship: v1ApiContact.extendedrelationship,
    responsible: v1ApiContact.responsible,
  };
};
