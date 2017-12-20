import express = require('express');
import { injectable, inject } from 'inversify';
import { TYPES } from '../../core/types';
import { IUserIntegrationService } from '../../core/service/UserIntegrationService';


class Render {
  public static register(res: express.Response, vm: { token: string }) {
    res.render('register', vm);
  }
  public static error(res: express.Response, e: Error) {
    res.render('error');
  }
}



@injectable()
export class UserIntegrationCtrl {
  private _userIntegrationService: IUserIntegrationService;
  constructor( @inject(TYPES.UserIntegrationService) userIntegrationService: IUserIntegrationService) {
    this._userIntegrationService = userIntegrationService;
  }

  public regster = (req: express.Request, res: express.Response) => {
    const token = req.param('token');

    if (!token) {
      return Render.error(res, new Error(`missing token`));
    }

    return this._userIntegrationService.updateByToken(token, 'some-payload')
      .then(r => {
        return Render.register(res, { token });
      })
      .catch(e => Render.error(res, e))
  }
}