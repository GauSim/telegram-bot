require('dotenv').config();

import { Bot } from './bot/index';
import { Server } from './server/index';
import { Connection } from './core/dal/Connection';

const connection = new Connection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});


function start() {

  Bot.start({ secret: process.env.SECRET }, connection);

  if (!process.env.NO_WEBSERVER)
    Server.start({
      port: process.env.PORT,
      host: process.env.HOST
    })

}

// test connection
connection.query('SELECT 1 + 1 AS solution')
  .then(d => start())
  .catch(e => console.error(e)); // exit -1
