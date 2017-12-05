import { Router, IServerConfig } from './Router';
import { keepAlive } from './keepAlive';



export class Server {
  public static start(config: IServerConfig) {

    const router = new Router();
    router.startServer(config);


    if (config.host) {
      keepAlive(`${config.host}/ping`)
    } else {
      console.error('[Server] keepAlive failed, missing [host]')
    }
    
  }
}