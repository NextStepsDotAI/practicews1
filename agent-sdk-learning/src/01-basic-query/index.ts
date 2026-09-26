// TOPIC: Basic query
//
// query() is the Agent SDK's core entry point: give it a prompt, get back
// an async iterable of messages as Claude thinks, optionally calls tools,
// and produces a final response. This example asks one plain question with
// no tools enabled, then prints just the assistant's text and the final
// result status.
//
// Run with: npm run start:01-basic-query
// Requires: ANTHROPIC_API_KEY set in the environment (see .env.example) —
// this makes a real, billed API call.
//
// The SDK ships as an ESM-only package, while this project (like the rest
// of the repo) compiles to CommonJS for consistency with node-learning/'s
// setup — so it's loaded via a dynamic import() here rather than a static
// `import`, which Node's CommonJS loader can't resolve for an ESM-only
// package.
//
// Note: `tools: []` (not `allowedTools: []`) is what actually disables
// every built-in tool here — `allowedTools` only skips the permission
// prompt for tools that are already available, it doesn't restrict which
// ones exist. See topic 04 for the full explanation, proven with real output.

import 'dotenv/config';
import { extractAssistantText } from './messageParsing';

async function main() {
  const { query } = await import('@anthropic-ai/claude-agent-sdk');

  for await (const message of query({
    prompt: 'In one sentence, what is Node.js?',
    options: { tools: [] }, // no tools needed for a plain Q&A
  })) {
    const text = extractAssistantText(message);
    if (text) console.log(text);

    if (message.type === 'result') {
      console.log(`\n[done: ${message.subtype}]`);
    }
  }
}

main();
