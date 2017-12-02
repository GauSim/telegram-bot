export interface User {
  firstname: string;
  id: number;
  lastname: string;
  name: string;
  type: 'user'
  username: string;
}

export interface Message<TCommand> {
  id: number;
  args: { raw: string; } | undefined
  type: 'text';
  user: User;
  form: User;
  chat: User;
  queued: boolean;
  mine: boolean;
  exclusive: boolean;
  entities: { length: number; offset: number; type: "bot_command" }[]
  command: TCommand;
  date: Date;
}


interface Chat {
  setChatTitle(s: string): void;
  setChatDescription(s: string): void;
}

export interface Reply<TBot> {
  parameters: undefined;
  id: number;
  bot: TBot;
  text(txt: string);
}

export type CommandController<TBot, TCommand> = (msg: Message<TCommand>, reply: Reply<TBot>) => void;


type BotEvent = 'ready'
type BotPorp = 'firstname';

export interface BotAPI<TCommand> {
  command(command: TCommand | undefined, help: string | undefined, cb: CommandController<BotAPI<TCommand>, TCommand>)
  command(command: TCommand | undefined, cb: CommandController<BotAPI<TCommand>, TCommand>)
  command(cb: CommandController<BotAPI<TCommand>, TCommand>)

  on: (e: BotEvent, cb: () => void) => void;

  get<T>(e:BotPorp): T

  link(): string;

  getChat(): Chat;
}