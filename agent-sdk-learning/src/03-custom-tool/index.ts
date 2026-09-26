// TOPIC: Custom tools and subagents
//
// Every earlier topic used a *built-in* tool (Read). This one shows the
// two ways to extend what an agent can do beyond the built-ins:
//
//   A. A CUSTOM TOOL — a small function you write yourself (tools.ts),
//      wrapped with tool() and registered via createSdkMcpServer(). Claude
//      calls it exactly like a built-in tool — it just doesn't know or
//      care that you wrote the code behind it.
//
//   B. A SUBAGENT — a separate, focused mini-agent (its own system prompt,
//      its own allowed tools) that the main session can hand a sub-task to
//      via the Task tool. Defined with the `agents` option. It runs its
//      own full lifecycle (init -> ... -> result) and reports back.
//
// Run with: npm run start:03-custom-tool
// Requires: ANTHROPIC_API_KEY set in the environment (see .env.example) —
// this makes two real, billed API calls.
//
// Note the two different fields below: `tools` restricts which tools
// actually EXIST in the session (so the main thread can't reach for Read/
// Bash/etc. instead); `allowedTools` just skips the permission prompt for
// what's left available. See topic 04 for a side-by-side proof of the
// difference. AgentDefinition.tools (on the subagent below) is unlike the
// top-level allowedTools — it's already a real restriction on its own.

import 'dotenv/config';
import type { SDKMessage } from '@anthropic-ai/claude-agent-sdk';
import { buildUnitConverterServer, CONVERT_TEMPERATURE_TOOL_NAME } from './tools';

// A short one-line log per message — deliberately simpler than topic
// 02's full lifecycle inspector, since the point here is seeing WHERE a
// custom tool call and a subagent hand-off show up in the stream, not
// re-explaining every message type again.
function logStep(step: number, message: SDKMessage) {
  const loose = message as unknown as Record<string, unknown>;
  const subagentTag = loose.subagent_type ? ` [subagent: ${loose.subagent_type}]` : ' [main]';
  const subtype = loose.subtype ? `/${loose.subtype}` : '';
  console.log(`[${step}]${subagentTag} type=${message.type}${subtype}`);
}

async function main() {
  const sdk = await import('@anthropic-ai/claude-agent-sdk');
  const unitConverterServer = buildUnitConverterServer(sdk);

  console.log('=== A. Claude calls the custom tool directly ===\n');
  let step = 0;
  for await (const message of sdk.query({
    prompt: 'Convert 100 degrees Celsius to Fahrenheit using the available tool.',
    options: {
      tools: [], // disable every built-in tool — only our custom one should exist here
      allowedTools: [CONVERT_TEMPERATURE_TOOL_NAME], // skip the permission prompt for it
      mcpServers: { 'unit-converter': unitConverterServer },
    },
  })) {
    step += 1;
    logStep(step, message);
  }

  console.log('\n=== B. Claude delegates to a subagent, which uses the same tool ===\n');
  step = 0;
  for await (const message of sdk.query({
    prompt: 'Ask the unit-converter-agent to convert 0 degrees Celsius to Fahrenheit.',
    options: {
      tools: ['Task'], // main thread may ONLY delegate — Read/Bash/etc. don't exist here
      allowedTools: ['Task'], // skip the permission prompt for delegating
      mcpServers: { 'unit-converter': unitConverterServer },
      agents: {
        'unit-converter-agent': {
          description: 'Converts temperatures between Celsius and Fahrenheit using the unit-converter tool.',
          prompt: 'You convert temperatures. Always use the convert_temperature tool rather than doing the math yourself.',
          tools: [CONVERT_TEMPERATURE_TOOL_NAME],
        },
      },
    },
  })) {
    step += 1;
    logStep(step, message);
  }
}

main();
