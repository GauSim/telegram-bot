import http = require('http');
import { ILoggerService } from '../core/service/LoggerService';

export function keepAlive(pingUrl: string, logger:ILoggerService) {

  logger.info(`[keepAlive] starting loop ${Date.now()} ${pingUrl}`);
  setInterval(() => {
    logger.info(`[keepAlive] sending ping ${Date.now()} ${pingUrl}`);
    http.get(pingUrl, (res) => {

    });
  }, 300000); // every 5 minutes (300000)


}

