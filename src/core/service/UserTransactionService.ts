import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import * as assert from 'assert';
import { IUserTransactionDAO } from '../dal/UserTransactionDAO';

export const ERROR_INVALID_REQUEST_INPUT = 'INVALID_REQUEST_INPUT';
export const ERROR_UNEXPECTED_RESULTSET = 'UNEXPECTED_RESULTSET';
export const ERROR_OPERATION_NOT_ALLOWED = 'OPERATION_NOT_ALLOWED';

export interface IUserTransactionService {
  add(userid: number, amount: number): Promise<number>;
  remove(userid: number, amount: number): Promise<number>;
}

@injectable()
export class UserTransactionService {
  private _dao: IUserTransactionDAO
  constructor( @inject(TYPES.UserTransactionDAO) dao: IUserTransactionDAO) {
    assert(dao)
    this._dao = dao;
  }

  add(userid: number, amount: number): Promise<number> {
    if (!userid || !amount || amount <= 0) {
      return Promise.reject(new Error(ERROR_INVALID_REQUEST_INPUT + JSON.stringify({ userid, amount })))
    }

    return this._dao.add(userid, amount)
      .then(_ => this._dao.getAmountSum(userid))
  }

  remove(userid: number, amount: number): Promise<number> {
    if (!userid || !amount || amount <= 0) {
      return Promise.reject(new Error(ERROR_INVALID_REQUEST_INPUT + JSON.stringify({ userid, amount })))
    }

    return this._dao.getAmountSum(userid)
      .then(currentAmount => {
        const rest = currentAmount - amount;
        if (rest < 0) {
          throw new Error(ERROR_OPERATION_NOT_ALLOWED + JSON.stringify({ userid, amount }))
        }
      })
      .then(_ => this._dao.remove(userid, amount))
      .then(_ => this._dao.getAmountSum(userid))
  }

}