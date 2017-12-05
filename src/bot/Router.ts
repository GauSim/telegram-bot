import { Message, BotAPI, CommandController } from "./models";
import { Logger } from './Logger';
import { IConnection } from "../core/dal/Connection";
import { UserTransactionCtrl } from "./UserTransactionCtrl";
import { ErrorService } from "./ErrorService";
import { UserTransactionDAO } from "../core/dal/UserTransactionDAO";
export type Commands = 'ping' | 'echo' | 'start' | 'add' | 'remove';

export type Route<TCommands> = {
  cmd: TCommands;
  help: string;
  withArgs: string[];
  ctrl: CommandController<BotAPI<TCommands>, TCommands>;
};


export class Router {

  constructor(
    private readonly bot: BotAPI<Commands>,
    private readonly con: IConnection,
  ) {

    const errorService = new ErrorService();
    const userTransactionCtrl = new UserTransactionCtrl(new UserTransactionDAO(con), errorService);

    const routes: Route<Commands>[] = [
      {
        cmd: 'ping',
        help: "bot will send you a 'pong'",
        withArgs: [],
        ctrl: (msg, reply) => reply.text('pong')
      },
      {
        cmd: 'echo',
        help: "bot will echo back at you",
        withArgs: ['[text]'],
        ctrl: (msg, reply) => {

          if (!msg.args || (msg.args && !msg.args.raw)) {
            reply.text('send me some text... '); // todo wrap text => so we dont reply empty
            return;
          }

          reply.text(msg.args.raw ? msg.args.raw : 'send me some text... ')
        }
      },
      {
        cmd: 'add',
        help: 'add one',
        withArgs: [],
        ctrl: userTransactionCtrl.add
      },
      {
        cmd: 'remove',
        help: 'remove one',
        withArgs: [],
        ctrl: userTransactionCtrl.remove
      }
    ]

    routes.forEach(it => bot.command(it.cmd, it.help, Logger.register(it)));

    const welcome = `
    Hi, 
    commands:
    ${routes.map(it => `/${it.cmd} ${it.withArgs.length ? it.withArgs.join(' ') : ''} : ${it.help}`).join('\n')}
    `
    // start 
    bot.command('start', 'help', (msg, reply) => reply.text(welcome))

    // default
    bot.command((msg, reply) => reply.text("Invalid command."))
  }

}
