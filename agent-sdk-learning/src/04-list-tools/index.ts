// TOPIC: Discovering the built-in tool list — and `tools` vs `allowedTools`
//
// There's no fixed, hardcoded list of built-in tools in the SDK's types —
// tool names are just typed as `string[]`, because Anthropic can add,
// remove, or rename tools across versions without breaking the types. The
// one reliable source of truth is the very first message query() ever
// sends: the system/init message (see topic 02), whose `tools` field
// lists every tool actually available in that exact running session.
//
// This also proves a distinction that's easy to get backwards:
//   - `options.tools`         -> the REAL set of tools available at all.
//                                Omitted (or a preset) = every built-in
//                                tool; `[]` = none of them.
//   - `options.allowedTools`  -> of whatever IS available, which tools
//                                skip the permission prompt. It never
//                                adds or removes availability.
//
// Run A below with default options (nothing restricted) and run B with
// `tools: []` — same `allowedTools` (none set in either), very different
// `message.tools` output. That's the proof, not just a claim.
//
// Run with: npm run start:04-list-tools
// Requires: ANTHROPIC_API_KEY set in the environment (see .env.example) —
// this makes two small, real, billed API calls (each stops right after
// its first message, so both are cheap).

import 'dotenv/config';
import { formatToolList } from './toolListFormatting';

async function main() {
  const { query } = await import('@anthropic-ai/claude-agent-sdk');

  console.log('=== A. Default options — every built-in tool is available ===\n');
  for await (const message of query({ prompt: 'hi', options: {} })) {
    if (message.type === 'system' && message.subtype === 'init') {
      console.log(formatToolList(message.tools));
      break; // we have what we came for — no need to let the turn finish
    }
  }

  console.log('\n=== B. options: { tools: [] } — every built-in tool disabled ===\n');
  for await (const message of query({ prompt: 'hi', options: { tools: [] } })) {
    if (message.type === 'system' && message.subtype === 'init') {
      console.log(formatToolList(message.tools));
      break;
    }
  }
}

main();
