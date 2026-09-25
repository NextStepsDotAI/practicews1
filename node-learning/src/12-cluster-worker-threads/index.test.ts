import { computeFibonacciInWorker } from './index';

describe('12-cluster-worker-threads', () => {
  it('computes a value inside a worker thread and returns it to the main thread', async () => {
    const result = await computeFibonacciInWorker(10);
    expect(result).toBe(55);
  }, 15000); // worker startup can be slow in CI/first-run, so extend the timeout
});
