// TOPIC: File System (fs)
//
// Node's `fs` module reads/writes files. Most functions come in three flavors:
// sync (blocks the event loop, returns directly), callback (classic Node style),
// and promise-based (via fs/promises — usually the best choice today).

import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

const tempFile = path.join(os.tmpdir(), 'node-learning-02-fs.txt');

export function writeAndReadSync(): string {
  fs.writeFileSync(tempFile, 'Hello from fs (sync)!', 'utf-8');
  return fs.readFileSync(tempFile, 'utf-8');
}

export async function writeAndReadAsync(): Promise<string> {
  await fsPromises.writeFile(tempFile, 'Hello from fs (async/promises)!', 'utf-8');
  return fsPromises.readFile(tempFile, 'utf-8');
}

export async function cleanup(): Promise<void> {
  await fsPromises.rm(tempFile, { force: true });
}

if (require.main === module) {
  console.log('sync result:', writeAndReadSync());
  writeAndReadAsync()
    .then((result) => console.log('async result:', result))
    .finally(() => cleanup());
}
