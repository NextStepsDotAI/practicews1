// Pure helper for pulling readable text out of a Messages API response,
// kept separate from index.ts so it's testable without making a live call.
//
// Type-only import: erased at compile time, so importing it here never
// requires the SDK's runtime code to run.
import type Anthropic from '@anthropic-ai/sdk';

// Concatenates every text block in a response's content array. A response's
// `content` is a list of blocks (it could carry text, a tool call, etc.) —
// this single-turn example never asks for tools, so in practice there's
// exactly one text block, but the join here is correct even if that changes.
export function extractResponseText(response: Anthropic.Message): string {
  return response.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map((block) => block.text)
    .join('');
}
