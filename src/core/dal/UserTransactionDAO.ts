import mysql = require('mysql');
import { IConnection } from './Connection';


const INVALID_REQUEST_INPUT = 'INVALID_REQUEST_INPUT';
const UNEXPECTED_RESULTSET = 'UNEXPECTED_RESULTSET';
const OPERATION_NOT_ALLOWED = 'OPERATION_NOT_ALLOWED';

// userid
// amount
// timestamp
export class UserTransactionDAO {

  private TABLE_NAME = 'user_transaction';
  private FIELD_USERID = 'userid';
  private FIELD_AMOUNT = 'amount';

  constructor(private readonly con: IConnection) {

  }

  add(userid: number, amount: number) {
    if (!userid || !amount || amount <= 0) {
      return Promise.reject(new Error(INVALID_REQUEST_INPUT + JSON.stringify({ userid, amount })))
    }

    const sql = `INSERT INTO ${this.TABLE_NAME} SET ?`

    const payload = {
      [this.FIELD_USERID]: userid,
      amount
    }

    return this.con.query(sql, payload);
  }

  remove(userid: number, amount: number) {
    if (!userid || !amount || amount <= 0) {
      return Promise.reject(new Error(INVALID_REQUEST_INPUT + JSON.stringify({ userid, amount })))
    }

    return this.getAmountSum(userid)
      .then(currentAmount => {

        const rest = currentAmount - amount;
        if (rest < 0) {
          throw new Error(OPERATION_NOT_ALLOWED + JSON.stringify({ userid, amount }))
        }

      })
      .then(_ => {

        const sql = `INSERT INTO ${this.TABLE_NAME} SET ?`
        const payload = {
          [this.FIELD_USERID]: userid,
          amount: (amount * -1)
        };

        return this.con.query(sql, payload);
      });
  }

  getAmountSum(userid: number): Promise<number> {
    if (!userid) {
      return Promise.reject(new Error(INVALID_REQUEST_INPUT + JSON.stringify({ userid })))
    }

    const sql = mysql.format(
      "SELECT sum( ?? ) as amount FROM ?? WHERE ?? = ?",
      [this.FIELD_AMOUNT, this.TABLE_NAME, this.FIELD_USERID, userid]
    );

    return this.con.query(sql).then(r => {

      if (Array.isArray(r.results) && r.results.length != 1) {
        throw new Error(UNEXPECTED_RESULTSET + JSON.stringify(r))
      }

      return r.results[0][this.FIELD_AMOUNT] as number;
    });
  }

}