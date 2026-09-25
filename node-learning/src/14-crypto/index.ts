// TOPIC: Crypto
//
// Node's built-in `crypto` module covers hashing, HMACs, random values, and
// full encryption. Below: one-way hashing (e.g. for checksums — NOT for
// passwords, see note), HMAC (verifying a message came from someone with a
// shared secret), and generating random tokens.

import * as crypto from 'crypto';

export function sha256(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}

// NOTE: for real password storage, use a slow, salted algorithm like bcrypt or
// argon2 — sha256 is fast, which makes it bad for passwords (easy to brute-force)
// but fine for things like file-integrity checksums.

export function hmac(message: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(message).digest('hex');
}

export function randomToken(bytes = 16): string {
  return crypto.randomBytes(bytes).toString('hex');
}

if (require.main === module) {
  console.log('sha256("hello"):', sha256('hello'));
  console.log('hmac:', hmac('hello', 'shared-secret'));
  console.log('random token:', randomToken());
}
