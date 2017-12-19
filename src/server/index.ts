import { Router, IServerConfig } from './Router';
import { keepAlive } from './keepAlive';
import { ILoggerService } from '../core/service/LoggerService';



export class Server {
  public static start(config: IServerConfig, logger: ILoggerService) {

    const router = new Router();
    router.startServer(config, logger);


    if (config.host) {
      keepAlive(`${config.host}/ping`, logger)
    } else {
      console.error('[Server] keepAlive failed, missing [host]')
    }

  }
}