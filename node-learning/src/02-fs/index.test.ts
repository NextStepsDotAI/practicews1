import { writeAndReadSync, writeAndReadAsync, cleanup } from './index';

describe('02-fs', () => {
  afterAll(async () => {
    await cleanup();
  });

  it('writes and reads a file synchronously', () => {
    expect(writeAndReadSync()).toBe('Hello from fs (sync)!');
  });

  it('writes and reads a file with fs/promises', async () => {
    await expect(writeAndReadAsync()).resolves.toBe('Hello from fs (async/promises)!');
  });
});
