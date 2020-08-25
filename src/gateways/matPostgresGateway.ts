interface GetUserMappingResponse {
  body: UserMappingTable[],
  error: number | undefined
}

export interface CreateUserMappingResponse {
  body: any,
  error: number | undefined
}

interface UserMappingTable {
  name: string,
  emailAddress: string,
  usercrmid: string,
  googleId: string,
}

class MatPostgresGateway {
  instance: any;
  constructor() {
    this.instance;
  }

  async setupInstance() {
    let db = this.instance;
    if (!db) {
      const { default: pgp } = await import('pg-promise');
      let options = {
        connectionString: process.env.TEST_DATABASE_URL //TODO: update this to prod value
      };
      if (process.env.NODE_ENV === 'test') { //TODO: add dev!?
        options.connectionString = process.env.TEST_DATABASE_URL;
      }
      if (process.env.NODE_ENV === 'production') {
        delete options.connectionString;
        options.host = process.env.HOST;
        options.user = process.env.USERNAME;
        options.password = process.env.PASSWORD;
        options.database = process.env.DATABASE;
      }
      this.instance = pgp()(options);
      delete this.instance.constructor;
    }
  }

  public async getTrasByPatchId() {
    await this.setupInstance();
    try {
      const results = await this.instance.many('SELECT * FROM tra')

      return Promise.resolve({
        body: results,
        error: undefined
      })
    }
    catch (error) {
      return Promise.resolve({
        body: undefined,
        error: 500
      })
    }
  }

  public async getUserMapping(emailAddress: string): Promise<GetUserMappingResponse> {
    await this.setupInstance();

    try {
      const results: UserMappingTable[] = await this.instance.one('SELECT * FROM usermappings WHERE emailaddress = $1', emailAddress)

      return Promise.resolve({
        body: results,
        error: undefined
      })
    }
    catch (error) {
      if (error.message == "No data returned from the query.") {
        return Promise.resolve({
          body: [],
          error: undefined
        })
      }
      return Promise.resolve({
        body: error,
        error: 500
      })
    }
  }

  public async createUserMapping(userMapping: UserMappingTable): Promise<CreateUserMappingResponse> {
    await this.setupInstance();

    try {
      const results = await this.instance.none('INSERT INTO usermappings(emailaddress, usercrmid, googleid, username) VALUES(${emailAddress}, ${usercrmid}, ${googleId}, ${name})', userMapping)

      return Promise.resolve({
        body: results,
        error: undefined
      })
    }
    catch(error) {
      return Promise.resolve({
        body: error,
        error: 500
      })
    }
  }
}

export default MatPostgresGateway;
