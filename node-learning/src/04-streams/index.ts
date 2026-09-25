// TOPIC: Streams
//
// Streams process data piece-by-piece instead of loading it all into memory at
// once — essential for large files/network data. A Transform stream both reads
// and writes, letting you modify data as it flows through.

import { Transform, Readable } from 'stream';

export function createUppercaseTransform(): Transform {
  return new Transform({
    transform(chunk, _encoding, callback) {
      // `this.push` sends data downstream; `callback` signals "ready for more".
      this.push(chunk.toString().toUpperCase());
      callback();
    },
  });
}

export function collectStream(readable: Readable): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    readable.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    readable.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    readable.on('error', reject);
  });
}

if (require.main === module) {
  const source = Readable.from(['hello ', 'streaming ', 'world']);
  const upper = createUppercaseTransform();

  collectStream(source.pipe(upper)).then((result) => {
    console.log('Transformed output:', result);
  });
}
