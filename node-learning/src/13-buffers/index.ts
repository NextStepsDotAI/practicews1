// TOPIC: Buffers
//
// A Buffer is Node's way of handling raw binary data (before it's decoded as
// text, or instead of ever being text — images, file bytes, network packets).
// Strings in JS are UTF-16 internally; Buffers let you work at the byte level.

export function stringToBuffer(text: string): Buffer {
  return Buffer.from(text, 'utf-8');
}

export function bufferToBase64(buf: Buffer): string {
  return buf.toString('base64');
}

export function base64ToString(base64: string): string {
  return Buffer.from(base64, 'base64').toString('utf-8');
}

export function concatBuffers(a: Buffer, b: Buffer): Buffer {
  return Buffer.concat([a, b]);
}

if (require.main === module) {
  const buf = stringToBuffer('Hello, Buffers!');
  console.log('Buffer bytes:', buf); // e.g. <Buffer 48 65 6c 6c 6f ...>
  console.log('As base64:', bufferToBase64(buf));
  console.log('Round-tripped:', base64ToString(bufferToBase64(buf)));
}
