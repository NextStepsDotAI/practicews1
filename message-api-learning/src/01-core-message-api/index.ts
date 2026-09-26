// TOPIC: Core Messages API — a single turn, authenticated with an API key
//
// This is the rawest way to talk to Claude: one call to
// client.messages.create() (which sends POST /v1/messages) sends one user
// message and gets back one assistant message. That's the whole "turn" —
// no agent loop, no built-in tools, no looping code. Compare this with the
// sibling agent-sdk-learning/src/01-basic-query, which asks a similar
// question but through the higher-level Agent SDK's query() instead.
//
// Auth: new Anthropic() reads ANTHROPIC_API_KEY from the environment (see
// .env.example) — there's no subscription/OAuth-token option here, unlike
// the Agent SDK. Running this makes a real, billed API call.
//
// Run with: npm run start:01-core-message-api

import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';
import { extractResponseText } from './responseParsing';

async function main() {
  const client = new Anthropic(); // reads ANTHROPIC_API_KEY from the environment

  const response = await client.messages.create({
    model: 'claude-opus-5',
    max_tokens: 1024, // this one-sentence answer is short by design, so a low cap is fine here
    messages: [
      { role: 'user', content: 'In one sentence, what is the Claude Messages API?' },
    ],
  });

  console.log(extractResponseText(response));
  console.log(`\n[stop_reason: ${response.stop_reason}]`);
  console.log(`[usage: ${response.usage.input_tokens} in / ${response.usage.output_tokens} out]`);
}

main();
