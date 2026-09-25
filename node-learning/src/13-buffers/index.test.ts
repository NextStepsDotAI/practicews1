import { stringToBuffer, bufferToBase64, base64ToString, concatBuffers } from './index';

describe('13-buffers', () => {
  it('converts a string to a Buffer of the expected byte length', () => {
    const buf = stringToBuffer('hi');
    expect(buf).toBeInstanceOf(Buffer);
    expect(buf.length).toBe(2);
  });

  it('round-trips a string through base64 encoding', () => {
    const buf = stringToBuffer('round trip');
    const base64 = bufferToBase64(buf);
    expect(base64ToString(base64)).toBe('round trip');
  });

  it('concatenates two buffers', () => {
    const result = concatBuffers(Buffer.from('foo'), Buffer.from('bar'));
    expect(result.toString('utf-8')).toBe('foobar');
  });
});
