require('dotenv').config();

import { Bot } from './bot/index';
import { Server } from './server/index';


Bot.start({
  secret: process.env.SECRET
});

if (!process.env.NO_WEBSERVER)
  Server.start({
    port: process.env.PORT,
    host: process.env.HOST
  })
