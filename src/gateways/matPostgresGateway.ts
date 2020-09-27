import PostgresConnection, { PostgresOptions } from '../lib/postgresConnection';
import { CheckResult } from '../pages/api/healthcheck';
import pgPromise from 'pg-promise';
import { IClient } from 'pg-promise/typescript/pg-subset';

export interface MatPostgresGatewayInterface {
  getTrasByPatchId(patchId: string): Promise<GetTRAPatchMappingResponse>;
  getUserMapping(emailAddress: string): Promise<GetUserMappingResponse>;
  createUserMapping(
    userMapping: UserMappingTable
  ): Promise<CreateUserMappingResponse>;
  healthCheck(): Promise<CheckResult>;
}

interface GetUserMappingResponse {
  body: UserMappingTable | undefined;
  error: number | undefined;
}

export interface CreateUserMappingResponse {
  body?: boolean;
  error?: number;
}

interface UserMappingTable {
  username: string;
  emailAddress: string;
  usercrmid: string;
  googleId: string;
}

interface GetTRAPatchMappingResponse {
  body: TRAPatchMapping[];
  error: number | undefined;
}

interface TRAPatchMapping {
  name: string;
  traid: number;
  patchcrmid: string;
}

class MatPostgresGateway implements MatPostgresGatewayInterface {
  instance: pgPromise.IDatabase<{}, IClient>;

  constructor() {
    if (
      process.env.DB_HOST &&
      process.env.DB_PASSWORD &&
      process.env.DB_USER &&
      process.env.DB_NAME
    ) {
      const options: PostgresOptions = {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
        database: process.env.DB_NAME,
      };
      const pgConn = new PostgresConnection(options);
      this.instance = pgConn.getConnection();
    } else {
      throw new Error('Missing postgres configuration variables');
    }
  }

  public async getTrasByPatchId(
    patchId: string
  ): Promise<GetTRAPatchMappingResponse> {
    try {
      const results: TRAPatchMapping[] = await this.instance.many(
        'SELECT  TRA.Name, TRA.TraId, TRAPatchAssociation.PatchCRMId FROM	TRA INNER JOIN TRAPatchAssociation ON TRA.TRAId = TRAPatchAssociation.TRAId WHERE TRAPatchAssociation.PatchCRMId = ${id}',
        { id: patchId }
      );

      return Promise.resolve({
        body: results,
        error: undefined,
      });
    } catch (error) {
      console.log('Error:', error.message);
      return Promise.resolve({
        body: [],
        error: 500,
      });
    }
  }

  public async getUserMapping(
    emailAddress: string
  ): Promise<GetUserMappingResponse> {
    try {
      const result: UserMappingTable = await this.instance.one(
        'SELECT * FROM usermappings WHERE emailaddress = $1',
        emailAddress
      );

      return Promise.resolve({
        body: result,
        error: undefined,
      });
    } catch (error) {
      if (error.message == 'No data returned from the query.') {
        return Promise.resolve({
          body: undefined,
          error: undefined,
        });
      }
      console.log('Error:', error.message);
      return Promise.resolve({
        body: undefined,
        error: 500,
      });
    }
  }

  public async createUserMapping(
    userMapping: UserMappingTable
  ): Promise<CreateUserMappingResponse> {
    try {
      const results = await this.instance.none(
        'INSERT INTO usermappings(emailaddress, usercrmid, googleid, username) VALUES(${emailAddress}, ${usercrmid}, ${googleId}, ${username})',
        userMapping
      );

      return {
        body: true,
        error: undefined,
      };
    } catch (error) {
      console.log('Error:', error.message);
      return Promise.resolve({
        body: error,
        error: 500,
      });
    }
  }

  public async healthCheck(): Promise<CheckResult> {
    const error = { success: false, message: 'Could not connect to postgres' };
    try {
      const result = await this.instance.one('SELECT true as success');
      if (result.success) {
        return { success: true };
      } else {
        return error;
      }
    } catch (e) {
      return error;
    }
  }
}

export default MatPostgresGateway;
