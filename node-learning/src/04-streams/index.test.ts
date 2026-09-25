import { Readable } from 'stream';
import { createUppercaseTransform, collectStream } from './index';

describe('04-streams', () => {
  it('uppercases data as it flows through a Transform stream', async () => {
    const source = Readable.from(['hello ', 'streams']);
    const upper = createUppercaseTransform();

    const result = await collectStream(source.pipe(upper));

    expect(result).toBe('HELLO STREAMS');
  });

  it('collects a plain readable stream unchanged', async () => {
    const source = Readable.from(['a', 'b', 'c']);

    const result = await collectStream(source);

    expect(result).toBe('abc');
  });
});
