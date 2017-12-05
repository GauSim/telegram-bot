import mysql = require('mysql');

export interface IDBConfig {
  host: string | undefined;
  port: string | undefined;
  user: string | undefined;
  password: string | undefined;
  database: string | undefined;
}

export interface IConnection {
  query: (sql: string, payload?: { [key: string]: number | string }) => Promise<{ results: { [key: string]: any }[] | { insertId: number }, fields: any }>
}

export class Connection implements IConnection {

  private pool: mysql.Pool

  constructor(config: IDBConfig) {

    this.pool = mysql.createPool({
      connectionLimit: 10,
      host: config.host,
      user: config.user,
      password: config.password,
      database: config.database,
      charset: 'UTF8_GENERAL_CI'
    });

  }

  query = (sql: string, payload?: { [key: string]: number | string }): Promise<{ results: { [key: string]: any }[] | { insertId: number }, fields: any }> => {

    console.log('[SQL]', sql, payload);

    return new Promise((ok, fail) => {

      const cb = (error, results, fields) => {

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