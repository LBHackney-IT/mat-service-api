import { CheckResult } from '../pages/api/healthcheck';
import pgPromise from 'pg-promise';
import { IClient } from 'pg-promise/typescript/pg-subset';
import { Result } from '../lib/utils';

export interface MatPostgresGatewayInterface {
  getTrasByPatchId(patchId: string): Promise<Result<TRAPatchMapping[]>>;
  getUserMapping(
    emailAddress: string
  ): Promise<Result<UserMappingTable | null>>;
  createUserMapping(userMapping: UserMappingTable): Promise<Result<void>>;
  getLatestItvTaskSyncDate(): Promise<Result<Date | null>>;
  createItvTask(task: ITVTaskTable): Promise<Result<boolean>>;
  healthCheck(): Promise<CheckResult>;
}

export interface UserMappingTable {
  username: string;
  emailAddress: string;
  usercrmid: string;
  googleId: string;
}

interface TRAPatchMapping {
  name: string;
  traid: number;
  patchcrmid: string;
}

interface ITVTaskTable {
  tag_ref: string;
  created: Date;
  crm_id: string;
}

class MatPostgresGateway implements MatPostgresGatewayInterface {
  connection: pgPromise.IDatabase<Record<string, unknown>, IClient>;

  constructor(
    connection: pgPromise.IDatabase<Record<string, unknown>, IClient>
  ) {
    this.connection = connection;
  }

  public async getTrasByPatchId(
    patchId: string
  ): Promise<Result<TRAPatchMapping[]>> {
    return this.connection
      .many<TRAPatchMapping>(
        'SELECT  TRA.Name, TRA.TraId, TRAPatchAssociation.PatchCRMId FROM	TRA INNER JOIN TRAPatchAssociation ON TRA.TRAId = TRAPatchAssociation.TRAId WHERE TRAPatchAssociation.PatchCRMId = ${id}',
        { id: patchId }
      )
      .then((result) => result)
      .catch((e) => e);
  }

  public async getUserMapping(
    emailAddress: string
  ): Promise<Result<UserMappingTable | null>> {
    return this.connection
      .one<UserMappingTable>(
        'SELECT * FROM usermappings WHERE emailaddress = $1',
        emailAddress
      )
      .then((result) => result)
      .catch((error) => {
        if (error.message == 'No data returned from the query.') {
          return null;
        }
        return error;
      });
  }

  public async createUserMapping(
    userMapping: UserMappingTable
  ): Promise<Result<void>> {
    return this.connection
      .none(
        'INSERT INTO usermappings(emailaddress, usercrmid, googleid, username) VALUES(${emailAddress}, ${usercrmid}, ${googleId}, ${username})',
        userMapping
      )
      .catch((e) => e);
  }

  public async getLatestItvTaskSyncDate(): Promise<Result<Date | null>> {
    try {
      const results = await this.connection.one(
        'SELECT MAX(created) FROM itv_tasks'
      );

      return Promise.resolve(results.max);
    } catch (error) {
      return new Error(error.message);
    }
  }

  async createItvTask(task: ITVTaskTable): Promise<Result<boolean>> {
    try {
      await this.connection.none(
        'INSERT INTO itv_tasks (tag_ref, created, crm_id) VALUES (${tag_ref}, ${created}, ${crm_id})',
        task
      );
      return true;
    } catch (error) {
      return new Error(error.message);
    }
  }

  public async healthCheck(): Promise<CheckResult> {
    const error = { success: false, message: 'Could not connect to postgres' };
    try {
      const result = await this.connection.one('SELECT true as success');
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
