
const botgram = require('botgram');
import { BotAPI } from './models';
import { Router, Commands } from './Router';


interface IBotConfig {
  secret: string | undefined
}

export class Bot {
  public static start(config: IBotConfig) {

    console.log('bot:start');
    
    if (!config.secret) {
      console.error('[SECRET] missing')
    }

    const bot = botgram(config.secret) as BotAPI<Commands>;

    bot.on('ready', () => {
      console.log('bot: (%s) starting to process messages.', bot.get('firstname'));
      console.log("bot: talk to me: %s", bot.link());

      return new Router().register(bot);
    });

  }
}


console.log('bot:running')