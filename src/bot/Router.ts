import { Message, BotAPI, CommandController } from "./models";
import { Logger } from './Logger';
export type Commands = 'ping' | 'echo' | 'start';

export type Route<TCommands> = {
  cmd: TCommands;
  help: string;
  withArgs: string[];
  ctrl: CommandController<BotAPI<TCommands>, TCommands>;
};


export class Router {
  private readonly routes: Route<Commands>[] = [
    {
      cmd: 'ping',
      help: "bot will send you a 'pong'",
      withArgs: [],
      ctrl: (msg, reply) => {
        reply.text('pong')
      }
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
    }
  ];

  constructor(private readonly bot: BotAPI<Commands>) {
    
    this.routes.forEach(it => bot.command(it.cmd, it.help, Logger.register(it)));

    const welcome = `
    Hi, 
    commands:
    ${this.routes.map(it => `/${it.cmd} ${it.withArgs.length ? it.withArgs.join(' ') : ''} : ${it.help}`).join('\n')}
    `
    // start 
    bot.command('start', 'help', (msg, reply) => reply.text(welcome))

    // default
    bot.command((msg, reply) => reply.text("Invalid command."))
  }

}
