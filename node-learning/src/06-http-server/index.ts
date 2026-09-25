// TOPIC: HTTP Server (built-in `http` module)
//
// Before reaching for a framework like Express, it's worth seeing what Node
// gives you out of the box: `http.createServer` takes a callback that runs
// for every incoming request.

import * as http from 'http';

export function createServer(): http.Server {
  return http.createServer((req, res) => {
    if (req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok' }));
      return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  });
}

if (require.main === module) {
  const port = 3001;
  createServer().listen(port, () => {
    console.log(`Plain http server listening on http://localhost:${port}`);
  });
}
