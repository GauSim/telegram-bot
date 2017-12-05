import { Reply, BotAPI } from "./models/index";


export class ErrorService {
  public handle<TCommand>(reply: Reply<BotAPI<TCommand>>, error: any | Error) {


    let log = '';

    if (error instanceof Error) {
      log = error.message;
    } else {
      log = JSON.stringify(error, null, 2);
    }

    console.error(log)

    reply.text(`nope, ...`);
  }
}