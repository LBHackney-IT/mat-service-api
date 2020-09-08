export interface MatPostgresGatewayInterface{
  getTrasByPatchId(patchId: string): Promise<GetTRAPatchMappingResponse>,
  getUserMapping(emailAddress: string): Promise<GetUserMappingResponse>,
  createUserMapping(userMapping: UserMappingTable): Promise<CreateUserMappingResponse>
}

interface GetUserMappingResponse {
  body: UserMappingTable[],
  error: number | undefined
}

export interface CreateUserMappingResponse {
  body: UserMappingTable[],
  error: number | undefined
}

interface UserMappingTable {
  name: string,
  emailAddress: string,
  usercrmid: string,
  googleId: string,
}

interface GetTRAPatchMappingResponse{
  body: TRAPatchMapping[],
  error: number | undefined
}

interface TRAPatchMapping {
  name: string,
  traid: number,
  patchcrmid: string
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
        connectionString: process.env.DATABASE_URL
      };
      this.instance = pgp()(options);
      delete this.instance.constructor;
    }
  }

  public async getTrasByPatchId(patchId: string): Promise<GetTRAPatchMappingResponse> {
    await this.setupInstance();
    
    try {
      const results: TRAPatchMapping[] = await this.instance.many('SELECT  TRA.Name, TRA.TraId, TRAPatchAssociation.PatchCRMId FROM	TRA INNER JOIN TRAPatchAssociation ON TRA.TRAId = TRAPatchAssociation.TRAId WHERE TRAPatchAssociation.PatchCRMId = ${id}', { id: patchId } );

      return Promise.resolve({
        body: results,
        error: undefined
      })
    }
    catch(error) {
      return Promise.resolve({
        body: [],
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
        body: [],
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
