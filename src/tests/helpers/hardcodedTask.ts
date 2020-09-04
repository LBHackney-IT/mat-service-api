import { Task, Stage, DueState, TenancyType } from '../../interfaces/task';

const HardcodedTask = (): Task => {
  return {
    id: '123',
    createdTime: new Date(Date.parse('2020-09-03T')),
    category: 'CategoryA',
    type: 'Sec',
    resident: {
      presentationName: 'Mr Adam Fisher',
      role: 'Head Tenant',
      dateOfBirth: new Date(Date.parse('1956-04-30T')),
      mobileNumber: '07707088123',
      homePhoneNumber: '0200708812',
      workPhoneNumber: '0200708999',
      email: 'the1stMan@email.com',
    },
    address: {
      presentationShort: '99 Mare Street E8 1DY',
    },
    dueTime: new Date(Date.parse('2020-10-01T')),
    stage: Stage.started,
    dueState: DueState.imminent,
    completedTime: new Date(Date.parse('2020-10-01T')),
    referenceNumber: '24680999',
    tenancy: {
      type: TenancyType.Secure,
      startDate: new Date(Date.parse('1999-12-31T')),
      residents: [
        {
          presentationName: 'Mr Adam Fisher',
          role: 'Head Tenant',
          dateOfBirth: new Date(Date.parse('1956-04-30T')),
          mobileNumber: '07707088123',
          homePhoneNumber: '0200708812',
          workPhoneNumber: '0200708999',
          email: 'the1stMan@email.com',
        },
        {
          presentationName: 'Mrs Jane Fisher',
          role: 'Tenant',
          dateOfBirth: new Date(Date.parse('1960-06-25T')),
          mobileNumber: '077070888888',
          homePhoneNumber: '0200708812',
          workPhoneNumber: '',
          email: 'jfisher@email.com',
        },
      ],
    },
  };
};

export default HardcodedTask;
