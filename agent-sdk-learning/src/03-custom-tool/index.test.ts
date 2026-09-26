import { celsiusToFahrenheit } from './tools';

// Only the pure conversion math is tested here. buildUnitConverterServer
// needs the real (ESM-only) SDK module loaded via dynamic import, and it's
// just a thin pass-through to sdk.tool()/sdk.createSdkMcpServer() with
// nothing of our own left to verify — see CLAUDE.md for why tests avoid
// touching the SDK/network.
describe('03-custom-tool: celsiusToFahrenheit', () => {
  it('converts the freezing point of water', () => {
    expect(celsiusToFahrenheit(0)).toBe(32);
  });

  it('converts the boiling point of water', () => {
    expect(celsiusToFahrenheit(100)).toBe(212);
  });

  it('converts a negative temperature', () => {
    expect(celsiusToFahrenheit(-40)).toBe(-40);
  });
});
