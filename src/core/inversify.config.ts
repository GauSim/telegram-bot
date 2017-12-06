import { Container } from 'inversify';
import { TYPES } from './types';
import { Connection, IConnection } from './dal/Connection';
import { UserTransactionDAO, IUserTransactionDAO } from './dal/UserTransactionDAO';
import { UserTransactionService, IUserTransactionService } from './service/UserTransactionService';
import { IErrorService, ErrorService } from './service/ErrorService';

const DI = new Container();

const connection = new Connection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

DI.bind<IConnection>(TYPES.Connection).toDynamicValue(_ => {
  // don't create new one
  return connection;
})

DI.bind<IUserTransactionDAO>(TYPES.UserTransactionDAO).to(UserTransactionDAO);
DI.bind<IUserTransactionService>(TYPES.UserTransactionService).to(UserTransactionService);
DI.bind<IErrorService>(TYPES.ErrorService).to(ErrorService);

export { DI };