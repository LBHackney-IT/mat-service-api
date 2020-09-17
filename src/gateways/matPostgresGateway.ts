export interface MatPostgresGatewayInterface {
  getTrasByPatchId(patchId: string): Promise<GetTRAPatchMappingResponse>;
  getUserMapping(emailAddress: string): Promise<GetUserMappingResponse>;
  createUserMapping(
    userMapping: UserMappingTable
  ): Promise<CreateUserMappingResponse>;
}

interface GetUserMappingResponse {
  body: UserMappingTable | undefined;
  error: number | undefined;
}

export interface CreateUserMappingResponse {
  body: UserMappingTable[];
  error: number | undefined;
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

interface PostgresOptions {
  user: string;
  password: string;
  host: string;
  port: string;
  database: string;
}

class MatPostgresGateway {
  instance: any;
  constructor() {
    this.instance;
  }

  async setupInstance() {
    if (
      !process.env.DB_HOST ||
      !process.env.DB_PASSWORD ||
      !process.env.DB_USER ||
      !process.env.DB_NAME
    ) {
      return;
    }

    let db = this.instance;
    if (!db) {
      const { default: pgp } = await import('pg-promise');
      let options = {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
        database: process.env.DB_NAME,
      };

      this.instance = pgp()(options);
      delete this.instance.constructor;
    }
  }

  public async getTrasByPatchId(
    patchId: string
  ): Promise<GetTRAPatchMappingResponse> {
    await this.setupInstance();

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
    await this.setupInstance();

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
    await this.setupInstance();

    try {
      const results = await this.instance.none(
        'INSERT INTO usermappings(emailaddress, usercrmid, googleid, username) VALUES(${emailAddress}, ${usercrmid}, ${googleId}, ${username})',
        userMapping
      );

      return Promise.resolve({
        body: results,
        error: undefined,
      });
    } catch (error) {
      console.log('Error:', error.message);
      return Promise.resolve({
        body: error,
        error: 500,
      });
    }
  }
}

export default MatPostgresGateway;
