import { BotAPI, CommandController } from './models';
import { BotRouteLogger } from './BotRouteLogger';
import { UserTransactionCtrl } from './ctrl/UserTransactionCtrl';
import { DI } from '../core/inversify.config';
import { WelcomeCtrl } from './ctrl/WelcomeCtrl';
import { TYPES } from '../core/types';
import { ILoggerService } from '../core/service/LoggerService';

export type Commands = 'ping' | 'echo' | 'start' | 'add' | 'remove';

export type Route<TCommands> = {
  cmd: TCommands;
  help: string;
  withArgs: string[];
  getCtrl: () => CommandController<BotAPI<TCommands>, TCommands> | undefined;
};


export class Router {

  constructor() { }

  private getRoutes(): Route<Commands>[] {
    return [
      {
        cmd: 'ping',
        help: 'bot will send you a pong',
        withArgs: [],
        getCtrl: () => DI.get(WelcomeCtrl).ping
      },
      {
        cmd: 'echo',
        help: 'bot will echo back at you',
        withArgs: ['[text]'],
        getCtrl: () => DI.get(WelcomeCtrl).echo
      },
      {
        cmd: 'add',
        help: 'add one',
        withArgs: [],
        getCtrl: () => DI.get(UserTransactionCtrl).add
      },
      {
        cmd: 'remove',
        help: 'remove one',
        withArgs: [],
        getCtrl: () => DI.get(UserTransactionCtrl).remove
      }
    ];
  }

  public register(bot: Readonly<BotAPI<Commands>>) {

    // bind ctrl to DI
    DI.bind<UserTransactionCtrl>(UserTransactionCtrl).toSelf();
    DI.bind<WelcomeCtrl>(WelcomeCtrl).toSelf();

    const logger = DI.get<ILoggerService>(TYPES.LoggerService);

    const routes = this.getRoutes();

    // dynamic
    routes.forEach(it => bot.command(it.cmd, it.help, BotRouteLogger.register(logger, it)));

    // start 
    bot.command('start', 'help', DI.get(WelcomeCtrl).buildStart(routes))

    // default
    bot.command((msg, reply) => reply.text('Invalid command.'));

    return this;
  }

}
