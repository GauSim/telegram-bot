require('dotenv').config();
import "reflect-metadata";

import { Bot } from './bot/index';
import { Server } from './server/index';

import { DI } from "./core/inversify.config";
import { TYPES } from "./core/types";
import { IConnection } from './core/dal/Connection';



function start() {

  Bot.start({ secret: process.env.SECRET });

  if (!process.env.NO_WEBSERVER)
    Server.start({
      port: process.env.PORT,
      host: process.env.HOST
    })

}

// test connection
const connection = DI.get<IConnection>(TYPES.Connection);
connection.query('SELECT 1 + 1 AS solution')
  .then(d => start())
  .catch(e => console.error(e)); // exit -1
