
const botgram = require('botgram');
import { BotAPI } from './models';
import { Router, Commands } from './Router';
import { ILoggerService } from '../core/service/LoggerService';


interface IBotConfig {
  secret: string | undefined
}

export class Bot {
  public static start(
    logger: ILoggerService,
    config: IBotConfig
  ) {

    logger.info('bot:start');

    if (!config.secret) {
      logger.error('[SECRET] missing')
    }

    const bot = botgram(config.secret) as BotAPI<Commands>;

    bot.on('ready', () => {
      logger.info(`bot: (${bot.get('firstname')}) starting to process messages.`);
      logger.info(`bot: talk to me: ${bot.link()}`);

      return new Router().register(bot);
    });

  }
}