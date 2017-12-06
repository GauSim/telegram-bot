import { CommandHandler } from '../models/index';
import { TYPES } from '../../core/types';
import { IUserTransactionService } from '../../core/service/UserTransactionService';
import { IErrorService } from '../../core/service/ErrorService';
import { inject, injectable } from 'inversify';


@injectable()
export class UserTransactionCtrl {

  private _userTransactionService: IUserTransactionService;
  private _errorService: IErrorService;

  constructor(
    @inject(TYPES.UserTransactionService) u: IUserTransactionService,
    @inject(TYPES.ErrorService) e: IErrorService) {
    this._userTransactionService = u;
    this._errorService = e;
  }

  add: CommandHandler<'add'> = (msg, reply) => {
    
    this._userTransactionService.add(msg.user.id, 1)
      .then(it => {
        return 'ok => ' + it;

      })
      .catch(e => this._errorService.handle(e))
      .then(msg => reply.text(msg))
  }

  remove: CommandHandler<'remove'> = (msg, reply) => {

    this._userTransactionService.remove(msg.user.id, 1)
      .then(it => {
        return 'ok => ' + it;
      })
      .catch(e => this._errorService.handle(e))
      .then(msg => reply.text(msg))
  }
}