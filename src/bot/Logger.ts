import { Route, Commands } from "./Router";
import { Reply, BotAPI, Message } from "./models/index";

export class Logger {

  public static register = (it: Route<Commands>) => (m: Message<Commands>, r: Reply<BotAPI<Commands>>) => {

    // incomming 
    console.log(`[BOT:IN] /${it.cmd} `, JSON.stringify(m));

    const ctrl = it.getCtrl();

    if (!ctrl) {
      throw new Error(`fatal error getting ctrl for command [${it.cmd}]`);
    }

    return ctrl(m, r);
  }

}