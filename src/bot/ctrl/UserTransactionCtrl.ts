import { CommandHandler } from '../models/index';
import { TYPES } from '../../core/types';
import { IUserTransactionService } from '../../core/service/UserTransactionService';
import { IErrorService } from '../../core/service/ErrorService';
import { inject, injectable } from 'inversify';
import { IUserIntegrationService } from '../../core/service/UserIntegrationService';


@injectable()
export class UserTransactionCtrl {

  private _userTransactionService: IUserTransactionService;
  private _userIntegrationService: IUserIntegrationService;
  private _errorService: IErrorService;

  constructor(
    @inject(TYPES.UserTransactionService) userTransactionService: IUserTransactionService,
    @inject(TYPES.UserIntegrationService) userIntegrationService: IUserIntegrationService,
    @inject(TYPES.ErrorService) e: IErrorService) {
    this._userTransactionService = userTransactionService;
    this._userIntegrationService = userIntegrationService;
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

  register: CommandHandler<'register'> = (msg, reply) => {

    this._userIntegrationService.createRegisterLink(msg.user.id).then(url => {
      return url;
    })
      .catch(e => this._errorService.handle(e))
      .then(msg => reply.text(msg))
  }
}