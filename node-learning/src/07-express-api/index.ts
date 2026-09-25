// TOPIC: Express API
//
// Express is the most widely used Node web framework. It adds routing,
// middleware, and request/response helpers on top of the raw `http` module
// from the 06-http-server topic.

import express, { Express, Request, Response, NextFunction } from 'express';

export function createApp(): Express {
  const app = express();

  app.use(express.json()); // middleware: parses JSON request bodies into req.body

  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok' });
  });

  // In-memory "database" just for this demo.
  const items: { id: number; name: string }[] = [];
  let nextId = 1;

  app.get('/items', (_req: Request, res: Response) => {
    res.json(items);
  });

  app.post('/items', (req: Request, res: Response) => {
    const { name } = req.body;
    if (typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'name is required' });
    }
    const item = { id: nextId++, name };
    items.push(item);
    res.status(201).json(item);
  });

  // Error-handling middleware — Express recognizes it by its 4-argument signature.
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({ error: 'internal server error' });
  });

  return app;
}

if (require.main === module) {
  const port = 3002;
  createApp().listen(port, () => {
    console.log(`Express API listening on http://localhost:${port}`);
  });
}
