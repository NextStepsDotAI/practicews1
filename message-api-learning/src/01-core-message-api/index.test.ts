import type Anthropic from '@anthropic-ai/sdk';
import { extractResponseText } from './responseParsing';

// These tests exercise only the pure parsing logic — they never call
// client.messages.create() itself, since that makes a real, billed API
// request. See CLAUDE.md for this project's testing convention.
describe('01-core-message-api: extractResponseText', () => {
  it('extracts text from a single text block', () => {
    const response = {
      content: [{ type: 'text', text: 'Hello!' }],
    } as unknown as Anthropic.Message;

    expect(extractResponseText(response)).toBe('Hello!');
  });

  it('joins multiple text blocks', () => {
    const response = {
      content: [
        { type: 'text', text: 'The Messages API is ' },
        { type: 'text', text: 'a single request/response call.' },
      ],
    } as unknown as Anthropic.Message;

    expect(extractResponseText(response)).toBe(
      'The Messages API is a single request/response call.',
    );
  });

  it('returns an empty string when there are no text blocks', () => {
    const response = {
      content: [{ type: 'tool_use', id: 'toolu_1', name: 'get_weather', input: {} }],
    } as unknown as Anthropic.Message;

    expect(extractResponseText(response)).toBe('');
  });
});
