// Pure conversion logic (unit-testable on its own) + the wiring that turns
// it into a custom tool Claude can call, exactly like a built-in tool.
//
// tool() and createSdkMcpServer() are runtime VALUES from the SDK, not
// just types — and the SDK is an ESM-only package, so a static top-level
// `import { tool } from '@anthropic-ai/claude-agent-sdk'` would break this
// project's CommonJS build (see CLAUDE.md). So this file takes the
// already-loaded SDK module as a parameter instead, built by index.ts's
// dynamic import().
import { z } from 'zod';

export function celsiusToFahrenheit(celsius: number): number {
  return celsius * (9 / 5) + 32;
}

// Claude Code's naming convention for referencing an MCP tool in
// allowedTools/agent.tools: mcp__<server-name>__<tool-name>.
export const CONVERT_TEMPERATURE_TOOL_NAME = 'mcp__unit-converter__convert_temperature';

export function buildUnitConverterServer(sdk: typeof import('@anthropic-ai/claude-agent-sdk')) {
  const convertTemperature = sdk.tool(
    'convert_temperature',
    'Converts a temperature from Celsius to Fahrenheit.',
    { celsius: z.number().describe('Temperature in Celsius') },
    async ({ celsius }) => {
      const fahrenheit = celsiusToFahrenheit(celsius);
      return { content: [{ type: 'text' as const, text: `${celsius}°C is ${fahrenheit}°F` }] };
    },
  );

  return sdk.createSdkMcpServer({ name: 'unit-converter', tools: [convertTemperature] });
}
