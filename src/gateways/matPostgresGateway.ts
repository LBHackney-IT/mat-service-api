class MatPostgresGateway {
  public async getTrasByPatchId(patchId: string) {
    let instance;
    if (!instance) {
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
    
      const results = await instance.many(dbQuery);

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