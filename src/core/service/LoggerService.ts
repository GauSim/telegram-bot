import { injectable } from "inversify";

export interface ILoggerService {
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
}

@injectable()
export class LoggerService implements ILoggerService {

  private readonly _logger = console;

  constructor() {

  }

  private getCallerFileAndLine() {
    try {
      const line = (new Error() as any).stack.split('\n')[4] as string;
      return '[' + line.substring(line.lastIndexOf('/') + 1, line.lastIndexOf(':')).trim() + ']';
    } catch (error) {
      return '';
    }
  }

  private log(type: 'info' | 'warn' | 'debug' | 'error' | 'log', ...args: any[]) {
    const fileInfo = this.getCallerFileAndLine();
    this._logger[type](type.toUpperCase(), fileInfo, ...args);
  }

  public info(...args: any[]) {
    this.log('info', ...args);
  }

  public warn(...args: any[]) {
    this.log('warn', ...args);
  }

  public error(...args: any[]) {
    this.log('error', ...args);
  }
}