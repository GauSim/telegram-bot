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
  Bot.start(logger, { secret: process.env.SECRET });
  Server.start(logger, { port: process.env.PORT, host: process.env.HOST });
}

// test connection
const connection = DI.get<IConnection>(TYPES.Connection);
connection.query('SELECT 1 + 1 AS solution')
  .then(d => start())
  .catch(e => logger.error(e)); // exit -1
