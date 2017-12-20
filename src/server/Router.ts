import express = require('express');
import bodyParser = require('body-parser');
import path = require('path');
import morgan = require('morgan');
import { Express } from 'express';
import { ILoggerService } from '../core/service/LoggerService';
import { UserIntegrationCtrl } from './ctrl/UserIntegrationCtrl';
import { DI } from '../core/inversify.config';

export interface IServerConfig {
  port: string | undefined;
  host: string | undefined;
}

DI.bind<UserIntegrationCtrl>(UserIntegrationCtrl).toSelf();

export class Router {

  private app: Express;

  constructor(
    private readonly config: IServerConfig,
    private readonly logger: ILoggerService
  ) {

    this.app = express();
    this.app.use(morgan('combined'));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.set('views', path.join(__dirname, 'views'));
    this.app.set('view engine', 'hbs');


    this.app.get('/user/integration/register/:token', DI.get(UserIntegrationCtrl).regster)
    this.app.get('/ping', (req, res) => res.send('ping'));
    this.app.use((req, res, next) => {
      res.status(404);
      next(new Error('Not Found'));
    });

  }

  start() {
    this.logger.info('[Server] start');
    this.app.listen(this.config.port, () => {
      this.logger.info(`[Server] listening on ${this.config.port}`);
    });
  }
}