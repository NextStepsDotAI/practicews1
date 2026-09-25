import { OrderTracker } from './index';

describe('03-events', () => {
  it('notifies listeners when an order is placed', () => {
    const tracker = new OrderTracker();
    const handler = jest.fn();

    tracker.on('order:placed', handler);
    tracker.placeOrder('ORD-42');

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(expect.objectContaining({ id: 'ORD-42' }));
  });

  it('supports multiple independent listeners for the same event', () => {
    const tracker = new OrderTracker();
    const first = jest.fn();
    const second = jest.fn();

    tracker.on('order:placed', first);
    tracker.on('order:placed', second);
    tracker.placeOrder('ORD-43');

    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
  });
});
