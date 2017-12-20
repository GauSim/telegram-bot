import { injectable, inject } from 'inversify';
import mysql = require('mysql');
import { IConnection } from './Connection';
import { TYPES } from '../types';
import * as assert from 'assert';

export interface IUserIntegrationDAO {
  read(userid: number): Promise<Integration | undefined>;
  saveToken(userid: number, token: string): Promise<string>;
  saveAuthData(userid: number, data: string): Promise<any>;
}

interface Integration {
  userId: number,
  type: string,
  data: string,
  token: string
}

const INTEGRATION_TYPE = {
  TEST: 'TEST'
}

@injectable()
export class UserIntegrationDAO implements IUserIntegrationDAO {

  private TABLE_NAME = 'user_integration_auth';
  private FIELD_USERID = 'userid';
  private FIELD_TYPE = 'type';
  private FIELD_DATA = 'data';
  private FIELD_TOKEN = 'token';

  private _con: IConnection

  constructor( @inject(TYPES.Connection) con: IConnection) {
    assert(con);
    this._con = con;
  }

  saveAuthData(userid: number, data: string) {
    const sql = mysql.format(`UPDATE ${this.TABLE_NAME} SET ?? = ? WHERE ?? = ?`,
      [
        this.FIELD_DATA, data,
        this.FIELD_USERID, userid
      ]
    );
    return this._con.query(sql);
  }

  saveToken(userid: number, token: string): Promise<string> {
    const sql = `INSERT INTO ${this.TABLE_NAME} SET ?`
    const payload = {
      [this.FIELD_USERID]: userid,
      [this.FIELD_TYPE]: INTEGRATION_TYPE.TEST,
      [this.FIELD_DATA]: '',
      [this.FIELD_TOKEN]: token
    }

    return this._con.query(sql, payload)
      .then(_ => {
        return token
      });
  }

  read(userid: number) {
    const sql = mysql.format(
      "SELECT ?? as amount FROM ?? WHERE ?? = ? AND ?? = ?",
      [
        [this.FIELD_TYPE, this.FIELD_DATA, this.FIELD_TOKEN],
        this.TABLE_NAME,
        this.FIELD_USERID, userid,
        this.FIELD_TYPE, INTEGRATION_TYPE.TEST
      ]
    );

    return this._con.query(sql)
      .then(data => data.results.map(it => ({
        userId: it[this.FIELD_USERID] as number,
        type: it[this.FIELD_TYPE] as string,
        data: it[this.FIELD_DATA] as string,
        token: it[this.FIELD_TOKEN] as string
      } as Integration))[0]
      )
  }
}