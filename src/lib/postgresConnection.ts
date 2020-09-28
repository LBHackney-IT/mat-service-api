import pgPromise from 'pg-promise';
import { IClient } from 'pg-promise/typescript/pg-subset';
const PG_CONN = Symbol.for('mat.db.pg');

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

    if (isSetup) return (global as any)[PG_CONN];

    (global as any)[PG_CONN] = pgPromise()(this.options);
    return (global as any)[PG_CONN];
  }
}
