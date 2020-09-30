/*  eslint-disable @typescript-eslint/no-namespace */
import pgPromise from 'pg-promise';
import { IClient } from 'pg-promise/typescript/pg-subset';
const PG_CONN = Symbol.for('mat.db.pg');

declare global {
  namespace NodeJS {
    interface Global {
      [PG_CONN]: pgPromise.IDatabase<Record<string, unknown>, IClient>;
    }
  }
}

export interface PostgresOptions {
  host: string;
  user: string;
  password: string;
  database: string;
  port: number;
}

export default class PostgresConnection {
  options: PostgresOptions;

  constructor(options: PostgresOptions) {
    this.options = options;
  }

  getConnection(): pgPromise.IDatabase<Record<string, unknown>, IClient> {
    const globalSymbols = Object.getOwnPropertySymbols(global);
    const isSetup = globalSymbols.indexOf(PG_CONN) > -1;

    if (!isSetup) global[PG_CONN] = pgPromise()(this.options);

    return global[PG_CONN];
  }
}
