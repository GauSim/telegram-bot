import http = require('http');

export function keepAlive(pingUrl: string) {

  console.log(`[keepAlive] starting loop ${Date.now()} ${pingUrl}`);
  setInterval(() => {
    console.log(`[keepAlive] sending ping ${Date.now()} ${pingUrl}`);
    http.get(pingUrl);
  }, 300000); // every 5 minutes (300000)


}

