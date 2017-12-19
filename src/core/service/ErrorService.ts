import { injectable, inject } from 'inversify';
import { ILoggerService } from './LoggerService';
import { TYPES } from '../types';

export interface IErrorService {
  handle(error: any | Error): string;
}

@injectable()
export class ErrorService implements IErrorService {
  private logger: ILoggerService;

  constructor( @inject(TYPES.LoggerService) l: ILoggerService ) {
    this.logger = l;
  }
  public handle(error: any | Error): string {
    this.logger.error(error);
    return `nope, ...`;
  }
}