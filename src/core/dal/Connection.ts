import mysql = require('mysql');
import { injectable } from "inversify";
import { ILoggerService } from '../service/LoggerService';

export interface IDBConfig {
  host: string | undefined;
  port: string | undefined;
  user: string | undefined;
  password: string | undefined;
  database: string | undefined;
}

export type IQueryResult = { [key: string]: any }[] & { insertId?: number };

export interface IQueryResultEnvelope {
  results: IQueryResult,
  fields: any
}

export interface IConnection {
  query: (sql: string, payload?: { [key: string]: number | string }) => Promise<IQueryResultEnvelope>
}

@injectable()
export class Connection implements IConnection {

  private pool: mysql.Pool
  private logger: ILoggerService;

  constructor(config: IDBConfig, logger: ILoggerService) {
    this.logger = logger;
    this.pool = mysql.createPool({
      connectionLimit: 10,
      host: config.host,
      user: config.user,
      password: config.password,
      database: config.database,
      charset: 'UTF8_GENERAL_CI'
    });

  }

  query = (sql: string, payload?: { [key: string]: number | string }): Promise<IQueryResultEnvelope> => {

    this.logger.info('[SQL]', sql, payload);

    return new Promise((ok, fail) => {

      const cb = (error: any, results: IQueryResult, fields: any) => {

        if (error) {
          fail(error)
          return;
        }

        ok({ results, fields })
      }

      try {
        if (payload) {
          this.pool.query(sql, payload, cb);
        } else {
          this.pool.query(sql, cb);
        }
      } catch (ex) {
        fail(ex);
      }

    });
  }
}