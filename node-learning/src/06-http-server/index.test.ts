import * as http from 'http';
import { AddressInfo } from 'net';
import { createServer } from './index';

describe('06-http-server', () => {
  let server: http.Server;
  let baseUrl: string;

  beforeAll((done) => {
    server = createServer().listen(0, () => {
      const { port } = server.address() as AddressInfo;
      baseUrl = `http://localhost:${port}`;
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  it('responds with 200 on /health', (done) => {
    http.get(`${baseUrl}/health`, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        expect(res.statusCode).toBe(200);
        expect(JSON.parse(body)).toEqual({ status: 'ok' });
        done();
      });
    });
  });

  it('responds with 404 for unknown routes', (done) => {
    http.get(`${baseUrl}/nope`, (res) => {
      expect(res.statusCode).toBe(404);
      done();
    });
  });
});
