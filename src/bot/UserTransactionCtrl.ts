import { UserTransactionDAO } from "../core/dal/UserTransactionDAO";
import { BotAPI, CommandController, Reply } from "./models/index";
import { ErrorService } from "./ErrorService";


export class UserTransactionCtrl<TCommand> {
  constructor(
    private readonly dao: UserTransactionDAO,
    private readonly errorService: ErrorService
  ) {

  }

  add: CommandController<BotAPI<TCommand>, TCommand> = (msg, reply) => {
    
    this.dao.add(msg.user.id, 1)
      .then(e => {
        reply.text('ok')
      })
      .catch(e => this.errorService.handle(reply, e))
  }

  remove: CommandController<BotAPI<TCommand>, TCommand> = (msg, reply) => {
    
    this.dao.remove(msg.user.id, 1)
      .then(e => {
        reply.text('ok')
      })
      .catch(e => this.errorService.handle(reply, e))
  }

}