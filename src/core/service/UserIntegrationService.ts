import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import * as assert from 'assert';
import { IUserIntegrationDAO } from '../dal/UserIntegrationDAO';
import { ILoggerService } from './LoggerService';
import crypto = require('crypto');

export interface IUserIntegrationService {
  createRegisterLink(userid: number): Promise<string>;
  updateByToken(token: string, data: string): Promise<any>;
}

const SECRET = 'simons_mega_bot!%&/';
const ALGORITHM = 'aes-256-ctr';


@injectable()
export class UserIntegrationService implements IUserIntegrationService {
  private _dao: IUserIntegrationDAO;
  private _logger: ILoggerService;

  constructor(
    @inject(TYPES.UserIntegrationDAO) dao: IUserIntegrationDAO,
    @inject(TYPES.LoggerService) logger: ILoggerService
  ) {
    assert(dao)
    this._dao = dao;
    this._logger = logger;
  }

  private encrypt(text: string): string {
    const cipher = crypto.createCipher(ALGORITHM, SECRET)
    let crypted = cipher.update(text.toString(), 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
  }

  private decrypt(text: string): Promise<number> {
    const decipher = crypto.createDecipher(ALGORITHM, SECRET)
    let dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return Promise.resolve(parseInt(dec, 10));
  }

  public updateByToken(token: string, data: string) {
    return Promise.resolve().then(_ => this.decrypt(token))
      .then(userId => this._dao.read(userId)
        .then(_ => this._dao.saveAuthData(userId, data)));
  }

  public createRegisterLink(userid: number) {

    /*
        this._logger.info(
          `test => (${userid.toString() === this.decrypt(token)}) ${userid} === ${this.decrypt(token)}`
        )
    */
    return this._dao.read(userid)
      .then(
      it => it ? it.token : this._dao.saveToken(userid, this.encrypt(userid.toString()))
      )
      .then(token => {

        this._logger.info(token);

        return `URL-${token}`;
      })
  }
}