// The actual code that runs inside the worker thread (a separate V8 instance
// with its own event loop, communicating with the main thread via messages).

import { parentPort, workerData } from 'worker_threads';

function fibonacci(n: number): number {
  // Deliberately naive/recursive — CPU-heavy work like this is exactly what
  // worker_threads exists for: it won't block the main thread's event loop.
  return n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2);
}

const result = fibonacci(workerData.n);
parentPort?.postMessage(result);
