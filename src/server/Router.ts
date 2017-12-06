import express = require('express');
import { Express } from 'express';

import morgan = require('morgan');

export interface IServerConfig {
  port: string | undefined;
  host: string | undefined;
}

export class Router {

  private app: Express;

  constructor() {
    this.app = express();
    this.app.use(morgan('combined'));
  }

  private registerRoutes() {
    this.app.get('/ping', (req, res) => res.send('ping'));
    this.app.use('/', (req, res) => res.send('ok'));
  }

  public startServer(config: IServerConfig) {

    console.log('[Server] start');
    
    this.registerRoutes();

    this.app.listen(config.port, () => {
      console.log(`[Server] listening on ${config.port}`);
    });
  }
}