import { observeExecutionOrder } from './index';

describe('15-timers-eventloop', () => {
  it('runs synchronous code first, then microtasks, then timer/check phases', async () => {
    const order = await observeExecutionOrder();

    expect(order[0]).toBe('synchronous code');
    // Both microtasks (nextTick, Promise) must run before either macrotask.
    const microtaskIndexes = [order.indexOf('process.nextTick'), order.indexOf('promise microtask')];
    const macrotaskIndexes = [order.indexOf('setTimeout'), order.indexOf('setImmediate')];

    expect(Math.max(...microtaskIndexes)).toBeLessThan(Math.min(...macrotaskIndexes));
  });
});
