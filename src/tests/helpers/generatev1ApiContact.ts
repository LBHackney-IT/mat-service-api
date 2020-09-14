import V1ApiContact from '../../interfaces/v1ApiContact';

export default (): V1ApiContact => {
  return {
    contactId: 'contactId',
    emailAddress: 'me@mail.com',
    uprn: '100000000000',
    addressLine1: '12',
    addressLine2: 'STREET CLOSE',
    addressLine3: 'HACKNEY',
    firstName: 'David',
    lastName: 'Jones',
    fullName: 'David Jones',
    larn: 'LARN12345678',
    telephone1: '12345678',
    telephone2: null,
    telephone3: null,
    cautionaryAlert: false,
    propertyCautionaryAlert: false,
    houseRef: null,
    title: 'Mr',
    fullAddressDisplay: '12\r\nSTREET CLOSE\r\nHACKNEY\r\nLONDON E8 9XX',
    fullAddressSearch: '12streetclose',
    postCode: 'E8 9XX',
    dateOfBirth: '1990-01-01',
    hackneyHomesId: '123456',
    disabled: false,
    relationship: null,
    extendedrelationship: null,
    responsible: true,
    age: '20',
  };
};
