import { Router, IServerConfig } from './Router';
import { keepAlive } from './keepAlive';
import { ILoggerService } from '../core/service/LoggerService';

export class Server {
  public static start(
    logger: ILoggerService,
    config: IServerConfig
  ) {

    const router = new Router(config, logger);
    router.start();


    if (config.host && config.host !== 'http://localhost') {
      keepAlive(`${config.host}/ping`, logger)
    } else {
      console.error('[Server] keepAlive failed, missing [host]')
    }

  }
}