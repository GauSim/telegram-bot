import { injectable, inject } from "inversify";
import mysql = require('mysql');
import { ERROR_UNEXPECTED_RESULTSET } from '../service/UserTransactionService';

import { TYPES } from '../types';
import * as assert from 'assert';
import { IQueryResultEnvelope, IConnection } from './Connection';

export interface IUserTransactionDAO {
  add(userid: number, amount: number): Promise<IQueryResultEnvelope>;
  remove(userid: number, amount: number): Promise<IQueryResultEnvelope>;
  getAmountSum(userid: number): Promise<number>;
}


// userid
// amount
// timestamp

@injectable()
export class UserTransactionDAO implements IUserTransactionDAO {

  private TABLE_NAME = 'user_transaction';
  private FIELD_USERID = 'userid';
  private FIELD_AMOUNT = 'amount';
  private _con: IConnection

  constructor( @inject(TYPES.Connection) con: IConnection) {
    assert(con);
    this._con = con;
  }

  add(userid: number, amount: number) {
    const sql = `INSERT INTO ${this.TABLE_NAME} SET ?`
    const payload = {
      [this.FIELD_USERID]: userid,
      amount
    }
    return this._con.query(sql, payload);
  }

  remove(userid: number, amount: number) {
    const sql = `INSERT INTO ${this.TABLE_NAME} SET ?`
    const payload = {
      [this.FIELD_USERID]: userid,
      amount: (amount * -1)
    };
    return this._con.query(sql, payload);
  }

  getAmountSum(userid: number) {
    const sql = mysql.format(
      "SELECT sum( ?? ) as amount FROM ?? WHERE ?? = ?",
      [this.FIELD_AMOUNT, this.TABLE_NAME, this.FIELD_USERID, userid]
    );

    return this._con.query(sql).then(r => {

      if (Array.isArray(r.results) && r.results.length != 1) {
        throw new Error(ERROR_UNEXPECTED_RESULTSET + JSON.stringify(r))
      }

      return r.results[0][this.FIELD_AMOUNT] as number;
    });
  }

}