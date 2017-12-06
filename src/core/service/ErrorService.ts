import { injectable } from 'inversify';

export interface IErrorService {
  handle(error: any | Error): string;
}

@injectable()
export class ErrorService implements IErrorService {
  public handle(error: any | Error): string {


    let log = '';

    if (error instanceof Error) {
      log = error.message;
    } else {
      log = JSON.stringify(error, null, 2);
    }

    console.error(log)

    return `nope, ...`;
  }
}