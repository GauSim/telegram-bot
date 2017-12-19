import { Route, Commands } from "./Router";
import { Reply, BotAPI, Message } from "./models/index";
import { ILoggerService } from "../core/service/LoggerService";

export class BotRouteLogger {


  public static register = (logger: ILoggerService, it: Route<Commands>) => (m: Message<Commands>, r: Reply<BotAPI<Commands>>) => {

    // incomming 
    logger.info(`[BOT:IN] /${it.cmd} `, JSON.stringify(m));
    
    const ctrl = it.getCtrl();

    if (!ctrl) {
      const e = new Error(`fatal error getting ctrl for command [${it.cmd}]`);;
      logger.error(e);
      throw e;
    }

    return ctrl(m, r);
  }

}