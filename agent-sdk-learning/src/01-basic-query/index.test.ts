import type { SDKMessage } from '@anthropic-ai/claude-agent-sdk';
import { extractAssistantText } from './messageParsing';

// These tests exercise only the pure parsing logic — they never call
// query() itself, since that makes a real, billed API request. See
// CLAUDE.md for this project's testing convention.
describe('01-basic-query: extractAssistantText', () => {
  it('extracts text from an assistant message', () => {
    const message = {
      type: 'assistant',
      message: { content: [{ type: 'text', text: 'Hello!' }] },
    } as unknown as SDKMessage;

    expect(extractAssistantText(message)).toBe('Hello!');
  });

  it('joins multiple text blocks', () => {
    const message = {
      type: 'assistant',
      message: {
        content: [
          { type: 'text', text: 'Node.js is ' },
          { type: 'text', text: 'a JS runtime.' },
        ],
      },
    } as unknown as SDKMessage;

    expect(extractAssistantText(message)).toBe('Node.js is a JS runtime.');
  });

  it('returns null for a non-assistant message', () => {
    const message = { type: 'result', subtype: 'success' } as unknown as SDKMessage;
    expect(extractAssistantText(message)).toBeNull();
  });

  it('returns null when the assistant message has no text blocks', () => {
    const message = {
      type: 'assistant',
      message: { content: [{ type: 'tool_use', name: 'Read', input: {} }] },
    } as unknown as SDKMessage;

    expect(extractAssistantText(message)).toBeNull();
  });
});
