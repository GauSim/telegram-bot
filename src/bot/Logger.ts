import { Route, Commands } from "./Router";
import { Reply, BotAPI } from "./models/index";
import { Bot } from "./index";

export class Logger {

  public static register = (it: Route<Commands>) => (m, r: Reply<BotAPI<Commands>>) => {

    // incomming 
    console.log(`[BOT:IN] /${it.cmd} `, JSON.stringify(m));

    return it.ctrl(m, r);
  }

}