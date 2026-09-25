import { delayCallback, delayPromise, delayAsyncAwait } from './index';

describe('05-async', () => {
  it('supports the classic error-first callback style', (done) => {
    delayCallback(5, (err, result) => {
      expect(err).toBeNull();
      expect(result).toContain('callback');
      done();
    });
  });

  it('supports Promise style', async () => {
    await expect(delayPromise(5)).resolves.toContain('promise');
  });

  it('supports async/await style built on top of Promises', async () => {
    const result = await delayAsyncAwait(5);
    expect(result).toContain('async/await');
  });
});
