import { CommandHandler } from '../models/index';
import { injectable } from 'inversify';
import { Route, Commands } from '../Router';


@injectable()
export class WelcomeCtrl {

  buildStart = (routes: Route<Commands>[]): CommandHandler<'start'> => (msg, reply) => {

    const welcome = `
    Hi, 
    commands:
    ${routes.map(it => `/${it.cmd} ${it.withArgs.length ? it.withArgs.join(' ') : ''} : ${it.help}`).join('\n')}
    `

    reply.text(welcome);
  }

  echo: CommandHandler<'start'> = (msg, reply) => {

    if (!msg.args || (msg.args && !msg.args.raw)) {
      reply.text('send me some text... '); // todo wrap text => so we dont reply empty
      return;
    }

    reply.text(msg.args.raw ? msg.args.raw : 'send me some text... ')
  }

  ping: CommandHandler<'ping'> = (msg, reply) => reply.text('pong')
}