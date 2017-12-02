
const botgram = require('botgram');
import { BotAPI } from './models';
import { Router, Commands } from './Router';
console.log('bot:start');


interface IBotConfig {
  secret: string | undefined
}

export class Bot {
  public static start(config: IBotConfig) {

    if (!config.secret) {
      console.error('[SECRET] missing')
    }

    const bot = botgram(config.secret) as BotAPI<Commands>;

    bot.on('ready', () => {

      console.log('Bot (%s) starting to process messages.', bot.get('firstname'));
      // bot.link() needs username to be set, so it also can't be called earlier

      console.log("Talk to me: %s", bot.link());

      const router = new Router(bot);

    });

  }
}


console.log('bot:running')