import { sha256, hmac, randomToken } from './index';

describe('14-crypto', () => {
  it('produces a deterministic sha256 hash', () => {
    expect(sha256('hello')).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
  });

  it('produces different hashes for different input', () => {
    expect(sha256('a')).not.toBe(sha256('b'));
  });

  it('produces an hmac that depends on the secret', () => {
    const a = hmac('message', 'secret1');
    const b = hmac('message', 'secret2');
    expect(a).not.toBe(b);
    expect(a).toHaveLength(64); // sha256 hex digest is always 64 chars
  });

  it('generates random tokens of the requested byte length', () => {
    const token = randomToken(16);
    expect(token).toHaveLength(32); // 16 bytes -> 32 hex chars
    expect(randomToken()).not.toBe(randomToken()); // astronomically unlikely to collide
  });
});
