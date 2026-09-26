// TOPIC: Query lifecycle
//
// 01-basic-query showed the shortest possible lifecycle: init -> assistant
// -> result. This topic asks a question that requires reading a file, so
// Claude has to use a tool to answer it — which surfaces every core stage
// of a query() run:
//
//   1. system/init      -> session started (session_id, model, tools, ...)
//   2. assistant         -> Claude asks to use a tool (tool_use block)
//   3. user               -> the tool's result is fed back in (tool_result block)
//   4. assistant         -> Claude's final answer, now that it has the info
//   5. result             -> session finished (success/error, cost, timing)
//
// Run with: npm run start:02-query-lifecycle
// Requires: ANTHROPIC_API_KEY set in the environment (see .env.example) —
// this makes a real, billed API call.

import 'dotenv/config';
import { describeMessage } from './lifecycleInspector';

async function main() {
  const { query } = await import('@anthropic-ai/claude-agent-sdk');

  let step = 0;

  for await (const message of query({
    prompt: 'Read package.json in the current directory and tell me the value of its "name" field, in one short sentence.',
    options: { allowedTools: ['Read'] },
  })) {
    step += 1;
    const { stage, label, detail } = describeMessage(message);
    console.log(`[${step}] (${stage}) ${label}\n    ${detail}\n`);
  }
}

main();
