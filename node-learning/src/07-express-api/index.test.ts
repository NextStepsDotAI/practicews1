import request from 'supertest';
import { createApp } from './index';

describe('07-express-api', () => {
  const app = createApp();

  it('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('POST /items creates an item, GET /items lists it', async () => {
    const created = await request(app).post('/items').send({ name: 'widget' });
    expect(created.status).toBe(201);
    expect(created.body).toMatchObject({ name: 'widget' });

    const list = await request(app).get('/items');
    expect(list.status).toBe(200);
    expect(list.body).toEqual(expect.arrayContaining([expect.objectContaining({ name: 'widget' })]));
  });

  it('POST /items without a name returns 400', async () => {
    const res = await request(app).post('/items').send({});
    expect(res.status).toBe(400);
  });
});
