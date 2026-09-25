// TOPIC: Events (EventEmitter)
//
// EventEmitter is the pub/sub primitive that much of Node's core (streams,
// HTTP servers, etc.) is built on. You subscribe with .on(), fire with .emit().

import { EventEmitter } from 'events';

export class OrderTracker extends EventEmitter {
  placeOrder(id: string): void {
    // Any code holding a reference to this tracker can react to 'order:placed'
    // without OrderTracker needing to know who's listening — that's the decoupling
    // events give you.
    this.emit('order:placed', { id, placedAt: new Date().toISOString() });
  }
}

if (require.main === module) {
  const tracker = new OrderTracker();

  tracker.on('order:placed', (order) => {
    console.log('Listener A received order:', order.id);
  });
  tracker.on('order:placed', (order) => {
    console.log('Listener B is also notified:', order.id);
  });

  tracker.placeOrder('ORD-1');
}
