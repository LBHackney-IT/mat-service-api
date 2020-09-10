import v1ApiContactToContact from './v1ApiContactToContact';
import Mockv1ApiContact from '../tests/helpers/generatev1ApiContact';
import { Contact } from '../interfaces/contact';

describe('tenancyToITVTask', () => {
  it('returns a valid Contact when given a V1ApiContact', () => {
    const v1Contact = Mockv1ApiContact(true);

    const contact: Contact = v1ApiContactToContact(v1Contact);

    expect(contact).toEqual({
      addressLine1: '12',
      addressLine2: 'STREET CLOSE',
      addressLine3: 'HACKNEY',
      crmContactId: 'contactId',
      dateOfBirth: '1990-01-01',
      disabled: false,
      emailAddress: 'me@mail.com',
      extendedrelationship: null,
      firstName: 'David',
      lastName: 'Jones',
      postCode: 'E8 9XX',
      relationship: null,
      responsible: true,
      telephone1: '12345678',
      telephone2: null,
      telephone3: null,
      title: 'Mr',
    });
  });
});
