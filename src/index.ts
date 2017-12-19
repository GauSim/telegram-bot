require('dotenv').config();
import 'reflect-metadata';

import { Bot } from './bot/index';
import { Server } from './server/index';

import { DI } from './core/inversify.config';
import { TYPES } from './core/types';
import { IConnection } from './core/dal/Connection';
import { ILoggerService } from './core/service/LoggerService';

const logger = DI.get<ILoggerService>(TYPES.LoggerService);

function start() {
  Bot.start({ secret: process.env.SECRET }, logger);

  if (!process.env.NO_WEBSERVER)
    Server.start({
      port: process.env.PORT,
      host: process.env.HOST
    }, logger);
}

// test connection
const connection = DI.get<IConnection>(TYPES.Connection);
connection.query('SELECT 1 + 1 AS solution')
  .then(d => start())
  .catch(e => logger.error(e)); // exit -1
