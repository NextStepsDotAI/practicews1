// TOPIC: worker_threads & cluster
//
// Node is single-threaded for your JS code by default. Two ways to use more
// CPU cores:
//   - worker_threads: run CPU-heavy JS in a background thread, message the
//     result back (see worker.ts). Good for one process needing parallel work.
//   - cluster: fork multiple copies of your whole process (each with its own
//     event loop) and load-balance incoming connections across them. Good for
//     scaling an HTTP server across CPU cores. Not demonstrated with a runnable
//     test here (it forks OS processes, which is heavier/flakier in a test
//     suite) — but the shape is: `cluster.fork()` in a `if (cluster.isPrimary)`
//     block, with workers running your normal server code.

import { Worker } from 'worker_threads';
import * as path from 'path';

export function computeFibonacciInWorker(n: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.join(__dirname, 'worker.ts'), {
      workerData: { n },
      execArgv: ['-r', 'ts-node/register'], // lets the worker load a .ts file directly
    });

    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}

if (require.main === module) {
  computeFibonacciInWorker(20).then((result) => {
    console.log('fibonacci(20) computed in a worker thread:', result);
  });
}
