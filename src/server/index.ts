import express = require('express');
import morgan = require('morgan');

import { keepAlive } from './keepAlive';

export interface IServerConfig {
  port: string | undefined;
  host: string | undefined;
}

export class Server {
  public static start(config: IServerConfig) {

    console.log('[Server] start');

    const app = express();

    app.use(morgan('combined'));
    
    app.get('/ping', (req, res) => res.send('ping'));
    app.get('/', (req, res) => res.send('ok'));

    app.listen(config.port, () => {
      console.log(`[Server] listening on ${config.port}`);
    });


    if (config.host) {
      keepAlive(`${config.host}/ping`)
    } else {
      console.error('[Server] keepAlive failed, missing [host]')
    }
  }
}