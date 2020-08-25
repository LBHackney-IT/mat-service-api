import { TRAPatchMappingDBResponseInterface } from '../mappings/apiTRAToUiTRA'

class MatPostgresGateway {
  public async getTrasByPatchId(patchId: string) {
    let instance;
    if (!instance) {
      const { default: pgp } = await import('pg-promise');
      let options = {
        connectionString: process.env.TEST_DATABASE_URL 
      };
      if (process.env.NODE_ENV === 'production') {
        options.connectionString = process.env.DATABASE_URL;
      }
      instance = pgp()(options);
      delete instance.constructor;
    }

    try {
      const dbQuery = `
      SELECT	TRA.Name,
              TRA.TraId,
              TRAPatchAssociation.PatchCRMId
      FROM	TRA INNER JOIN
              TRAPatchAssociation ON TRA.TRAId = TRAPatchAssociation.TRAId
      WHERE TRAPatchAssociation.PatchCRMId ='${patchId}'
      `;
    
      const results = await instance.many(dbQuery) as TRAPatchMappingDBResponseInterface;

      return Promise.resolve({
        body: results,
        error: undefined
      })
    }
    catch(error) {
      return Promise.resolve({
        body: undefined,
        error: 500
      })
    }
  }
}

export default MatPostgresGateway;
