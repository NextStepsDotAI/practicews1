// TOPIC: Timers & the Event Loop
//
// Node runs your code, then processes queued work in a specific order each
// "tick": microtasks (process.nextTick, then Promise callbacks) run first —
// before control returns to the event loop — followed by macrotask phases
// like timers (setTimeout/setInterval) and check (setImmediate).

export function observeExecutionOrder(): Promise<string[]> {
  const order: string[] = [];

  return new Promise((resolve) => {
    setTimeout(() => {
      order.push('setTimeout');
    }, 0);

    setImmediate(() => {
      order.push('setImmediate');
    });

    Promise.resolve().then(() => {
      order.push('promise microtask');
    });

    process.nextTick(() => {
      order.push('process.nextTick');
    });

    order.push('synchronous code');

    // Give the timer/immediate phases time to run before we resolve.
    setTimeout(() => resolve(order), 10);
  });
}

if (require.main === module) {
  observeExecutionOrder().then((order) => {
    console.log('Execution order:', order);
  });
}
