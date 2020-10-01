import CrmTokenGateway from './crmTokenGateway';
import CrmGateway from './crmGateway';

// if (!process.env.CRM_TOKEN_API_URL) {
//   throw new Error('Error: CRM_TOKEN_API_URL environment variable missing');
// }

// if (!process.env.CRM_TOKEN_API_KEY) {
//   throw new Error('Error: CRM_TOKEN_API_KEY environment variable missing');
// }

export const crmTokenGateway = new CrmTokenGateway(
  `${process.env.CRM_TOKEN_API_URL}`,
  `${process.env.CRM_TOKEN_API_KEY}`
);

// if (!process.env.CRM_API_URL) {
//   throw new Error('Error: CRM_API_URL environment variable missing');
// }

export const crmGateway = new CrmGateway(
  `${process.env.CRM_API_URL}`,
  crmTokenGateway
);
