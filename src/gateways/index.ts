import CrmTokenGateway from './crmTokenGateway';
import CrmGateway from './crmGateway';
import MatPostgresGateway from './matPostgresGateway';
import V1MatAPIGateway from './v1MatAPIGateway';
import PostgresConnection, { PostgresOptions } from '../lib/postgresConnection';

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

const options: PostgresOptions = {
  user: `${process.env.DB_USER}`,
  password: `${process.env.DB_PASSWORD}`,
  host: `${process.env.DB_HOST}`,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  database: `${process.env.DB_NAME}`,
};
const pgConn = new PostgresConnection(options);
const connection = pgConn.getConnection();

export const matPostgresGateway = new MatPostgresGateway(connection);

export const v1MatAPIGateway: V1MatAPIGateway = new V1MatAPIGateway(
  `${process.env.V1_MAT_API_URL}`,
  `${process.env.V1_MAT_API_TOKEN}`
);
