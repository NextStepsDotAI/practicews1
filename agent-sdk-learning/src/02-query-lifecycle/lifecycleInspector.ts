// Pure logic for turning any SDKMessage into a short, human-readable summary
// of which lifecycle stage it represents. Kept separate from index.ts so
// it's testable with synthetic messages, without a live API call.
//
// The full SDKMessage union has 30+ members (hook events, task events,
// plugin events, ...) — most only ever appear in advanced setups (custom
// tools, subagents, plugins). This covers the stages every query() call
// goes through, plus a fallback for everything else.
import type { SDKMessage } from '@anthropic-ai/claude-agent-sdk';

export type LifecycleStage =
  | 'session-start'
  | 'assistant-text'
  | 'assistant-tool-call'
  | 'tool-result'
  | 'session-end'
  | 'other';

export interface MessageSummary {
  stage: LifecycleStage;
  label: string;
  detail: string;
}

// Best-effort readable text out of a content field that may be a plain
// string, or an array of content blocks (each usually shaped { text: ... }).
function contentToText(content: unknown): string {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content
      .map((block) =>
        block && typeof block === 'object' && 'text' in block
          ? String((block as { text: unknown }).text)
          : JSON.stringify(block),
      )
      .join('');
  }
  return JSON.stringify(content);
}

export function describeMessage(message: SDKMessage): MessageSummary {
  switch (message.type) {
    case 'system': {
      if (message.subtype === 'init') {
        return {
          stage: 'session-start',
          label: 'Session started',
          detail:
            `session_id=${message.session_id} model=${message.model} ` +
            `tools=[${message.tools.join(', ')}] permissionMode=${message.permissionMode}`,
        };
      }
      return { stage: 'other', label: `system:${message.subtype}`, detail: '(uncovered system subtype)' };
    }

    case 'assistant': {
      const blocks = message.message?.content ?? [];
      const textParts: string[] = [];
      const toolCalls: string[] = [];

      for (const block of blocks) {
        if (block.type === 'text') {
          textParts.push(block.text);
        } else if (block.type === 'tool_use') {
          toolCalls.push(`${block.name}(${JSON.stringify(block.input)})`);
        }
      }

      if (toolCalls.length > 0) {
        return {
          stage: 'assistant-tool-call',
          label: 'Assistant requested a tool',
          detail: toolCalls.join('; '),
        };
      }

      return {
        stage: 'assistant-text',
        label: 'Assistant replied',
        detail: textParts.join('') || '(no text in this message)',
      };
    }

    case 'user': {
      // A tool's result comes back as a 'user' message whose content
      // includes a tool_result block — this is the SDK feeding Claude's
      // own tool call output back in, not something a human typed.
      const content = message.message?.content;
      const blocks: unknown[] = Array.isArray(content) ? content : [];
      const toolResults = blocks.filter(
        (block) => typeof block === 'object' && block !== null && (block as { type?: string }).type === 'tool_result',
      ) as Array<{ content?: unknown }>;

      if (toolResults.length > 0) {
        const detail = toolResults.map((block) => contentToText(block.content)).join('; ');
        return { stage: 'tool-result', label: 'Tool result returned', detail: detail || '(empty result)' };
      }

      return { stage: 'other', label: 'user (no tool_result block)', detail: contentToText(content) };
    }

    case 'result': {
      if (message.subtype === 'success') {
        return {
          stage: 'session-end',
          label: 'Session finished: success',
          detail:
            `duration_ms=${message.duration_ms} turns=${message.num_turns} ` +
            `cost_usd=${message.total_cost_usd.toFixed(6)} final_text="${message.result}"`,
        };
      }
      return {
        stage: 'session-end',
        label: `Session finished: ${message.subtype}`,
        detail: `duration_ms=${message.duration_ms} errors=${JSON.stringify(message.errors)}`,
      };
    }

    default: {
      // One of the 30+ other message types (hook/task/plugin/notification
      // events, etc.) — not covered here, only common in more advanced
      // setups than a plain single-turn query.
      return {
        stage: 'other',
        label: (message as { type: string }).type,
        detail: '(not covered by this example)',
      };
    }
  }
}
