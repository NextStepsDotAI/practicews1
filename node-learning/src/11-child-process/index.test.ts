import { getNodeVersionSync, getNodeVersionAsync, runNodeEval } from './index';

describe('11-child-process', () => {
  it('gets the Node version synchronously', () => {
    expect(getNodeVersionSync()).toMatch(/^v\d+\.\d+\.\d+$/);
  });

  it('gets the Node version asynchronously', async () => {
    const version = await getNodeVersionAsync();
    expect(version).toMatch(/^v\d+\.\d+\.\d+$/);
  });

  it('streams output from a spawned child process', async () => {
    const result = await runNodeEval('console.log(2 + 2)');
    expect(result).toBe('4');
  });
});
