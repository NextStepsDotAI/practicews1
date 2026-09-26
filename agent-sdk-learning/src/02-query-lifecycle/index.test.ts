import type { SDKMessage } from '@anthropic-ai/claude-agent-sdk';
import { describeMessage } from './lifecycleInspector';

// These synthetic messages mirror the real SDK message shapes closely
// enough to exercise the parsing logic, without ever calling query()
// itself (that makes a real, billed API request — see CLAUDE.md).
describe('02-query-lifecycle: describeMessage', () => {
  it('describes the session-start (system/init) message', () => {
    const message = {
      type: 'system',
      subtype: 'init',
      session_id: 'sess-123',
      model: 'claude-sonnet-5',
      tools: ['Read'],
      permissionMode: 'default',
    } as unknown as SDKMessage;

    const summary = describeMessage(message);
    expect(summary.stage).toBe('session-start');
    expect(summary.detail).toContain('session_id=sess-123');
    expect(summary.detail).toContain('model=claude-sonnet-5');
    expect(summary.detail).toContain('tools=[Read]');
  });

  it('describes a plain assistant text reply', () => {
    const message = {
      type: 'assistant',
      message: { content: [{ type: 'text', text: 'The name is agent-sdk-learning.' }] },
    } as unknown as SDKMessage;

    const summary = describeMessage(message);
    expect(summary.stage).toBe('assistant-text');
    expect(summary.detail).toBe('The name is agent-sdk-learning.');
  });

  it('describes an assistant message that requests a tool', () => {
    const message = {
      type: 'assistant',
      message: {
        content: [{ type: 'tool_use', name: 'Read', input: { file_path: 'package.json' } }],
      },
    } as unknown as SDKMessage;

    const summary = describeMessage(message);
    expect(summary.stage).toBe('assistant-tool-call');
    expect(summary.detail).toContain('Read(');
    expect(summary.detail).toContain('package.json');
  });

  it('describes a tool result fed back in as a user message', () => {
    const message = {
      type: 'user',
      message: {
        content: [{ type: 'tool_result', tool_use_id: 'tu_1', content: '{"name":"agent-sdk-learning"}' }],
      },
    } as unknown as SDKMessage;

    const summary = describeMessage(message);
    expect(summary.stage).toBe('tool-result');
    expect(summary.detail).toContain('agent-sdk-learning');
  });

  it('describes a successful session-end result', () => {
    const message = {
      type: 'result',
      subtype: 'success',
      duration_ms: 1234,
      num_turns: 3,
      total_cost_usd: 0.0042,
      result: 'The name is agent-sdk-learning.',
    } as unknown as SDKMessage;

    const summary = describeMessage(message);
    expect(summary.stage).toBe('session-end');
    expect(summary.label).toContain('success');
    expect(summary.detail).toContain('duration_ms=1234');
    expect(summary.detail).toContain('turns=3');
    expect(summary.detail).toContain('agent-sdk-learning');
  });

  it('describes an error session-end result', () => {
    const message = {
      type: 'result',
      subtype: 'error_max_turns',
      duration_ms: 500,
      errors: ['exceeded max turns'],
    } as unknown as SDKMessage;

    const summary = describeMessage(message);
    expect(summary.stage).toBe('session-end');
    expect(summary.label).toContain('error_max_turns');
    expect(summary.detail).toContain('exceeded max turns');
  });

  it('falls back to a generic summary for message types it does not special-case', () => {
    const message = { type: 'status', status: 'compacting' } as unknown as SDKMessage;

    const summary = describeMessage(message);
    expect(summary.stage).toBe('other');
    expect(summary.label).toBe('status');
  });
});
