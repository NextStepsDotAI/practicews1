import { getConfig } from './index';

describe('08-process-env', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('falls back to defaults when env vars are unset', () => {
    delete process.env.PORT;
    delete process.env.API_KEY;

    const config = getConfig();

    expect(config.port).toBe(3000);
    expect(config.apiKey).toContain('not set');
  });

  it('reads values from process.env when present', () => {
    process.env.PORT = '4000';
    process.env.API_KEY = 'test-key';

    const config = getConfig();

    expect(config.port).toBe(4000);
    expect(config.apiKey).toBe('test-key');
  });
});
