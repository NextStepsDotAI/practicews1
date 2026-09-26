// Pure helpers for pulling readable text out of Agent SDK messages, kept
// separate from index.ts so they're testable without making a live API call.
//
// Type-only import: erased at compile time, so it never triggers a runtime
// require() of the SDK (which ships ESM-only — see index.ts for how the
// actual runtime call handles that).
import type { SDKMessage } from '@anthropic-ai/claude-agent-sdk';

// Returns the assistant's text for a message, or null if this message isn't
// an assistant text message (e.g. a tool call, a system/result event).
export function extractAssistantText(message: SDKMessage): string | null {
  if (message.type !== 'assistant') return null;

  const blocks = message.message?.content;
  if (!Array.isArray(blocks)) return null;

  const text = blocks.map((block) => (block.type === 'text' ? block.text : '')).join('');

  return text.length > 0 ? text : null;
}
