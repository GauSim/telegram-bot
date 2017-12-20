import { Container } from 'inversify';
import { TYPES } from './types';
import { Connection, IConnection } from './dal/Connection';
import { UserTransactionDAO, IUserTransactionDAO } from './dal/UserTransactionDAO';
import { UserTransactionService, IUserTransactionService } from './service/UserTransactionService';
import { IErrorService, ErrorService } from './service/ErrorService';
import { LoggerService, ILoggerService } from './service/LoggerService';
import { IUserIntegrationDAO, UserIntegrationDAO } from './dal/UserIntegrationDAO';
import { UserIntegrationService, IUserIntegrationService } from './service/UserIntegrationService';

const DI = new Container();


DI.bind<IUserTransactionDAO>(TYPES.UserTransactionDAO).to(UserTransactionDAO);
DI.bind<IUserIntegrationDAO>(TYPES.UserIntegrationDAO).to(UserIntegrationDAO);
DI.bind<IUserTransactionService>(TYPES.UserTransactionService).to(UserTransactionService);
DI.bind<IUserIntegrationService>(TYPES.UserIntegrationService).to(UserIntegrationService);
DI.bind<IErrorService>(TYPES.ErrorService).to(ErrorService);
DI.bind<ILoggerService>(TYPES.LoggerService).to(LoggerService);

const connection = new Connection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
}, DI.get<ILoggerService>(TYPES.LoggerService));

DI.bind<IConnection>(TYPES.Connection).toDynamicValue(_ => {
  // don't create new one
  return connection;
})

export { DI };