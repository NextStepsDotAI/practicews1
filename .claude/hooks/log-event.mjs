#!/usr/bin/env node
// .claude/hooks/log-event.mjs
//
// Universal handler wired to all 33 Claude Code hook events. Appends one
// compact log line per event to events/<session_id>.log — classic
// timestamped log format (à la Apache Commons Logging / log4j):
//
//   2026-09-25 17:55:53,809 INFO  [PreToolUse] tool_name=Bash tool_input={"command":"npm test"}
//
// Rather than hand-writing a field extractor for all 33 events' different
// schemas, this strips the fields common to every event (session_id,
// transcript_path, cwd, scratchpad_dir, permission_mode, hook_event_name,
// prompt_id, effort) and prints whatever's left — which is exactly each
// event's distinguishing/critical information (tool_name+tool_input for
// PreToolUse, stop_reason for Stop, session_start_reason for SessionStart,
// notification_type for Notification, etc.), without needing to know each
// event's exact schema in advance.
//
// Never blocks, modifies, or comments on anything — pure observation. Must
// stay completely silent on stdout: several events (PreToolUse, PostToolUse,
// UserPromptSubmit, Stop, ...) treat exit-0 stdout as context/messages
// Claude sees, and this fires on every tool call — any stdout here would
// flood every single turn with noise. All errors are swallowed for the same
// reason logging must never break the actual session.

import { readFileSync } from 'node:fs';
import { mkdir, appendFile } from 'node:fs/promises';
import path from 'node:path';

const COMMON_FIELDS = new Set([
  'session_id',
  'transcript_path',
  'cwd',
  'scratchpad_dir',
  'permission_mode',
  'hook_event_name',
  'prompt_id',
  'effort',
]);

const MAX_FIELD_LENGTH = 150;

function formatTimestamp(date) {
  const pad = (n, len = 2) => String(n).padStart(len, '0');
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())},${pad(date.getMilliseconds(), 3)}`
  );
}

function levelFor(eventName) {
  return /Failure|Denied/i.test(eventName) ? 'WARN ' : 'INFO ';
}

// Events fired inside an agent context carry agent_id. Real subagents
// dispatched via the Agent tool also get a non-empty agent_type (e.g.
// "changelog-writer"). The app's own internal helper agents (session-title
// generation, etc.) carry agent_id but leave agent_type empty — that's the
// only signal distinguishing them from user-dispatched subagent work, and
// it can show up on any of the 33 event types those agents trigger, not
// just SubagentStart/SubagentStop.
function isInternalAgentEvent(input) {
  return Boolean(input.agent_id) && !input.agent_type;
}

function formatDetails(input) {
  const parts = [];
  for (const [key, value] of Object.entries(input)) {
    if (COMMON_FIELDS.has(key)) continue;
    let text = typeof value === 'string' ? value : JSON.stringify(value);
    if (text.length > MAX_FIELD_LENGTH) {
      text = `${text.slice(0, MAX_FIELD_LENGTH)}...`;
    }
    parts.push(`${key}=${text}`);
  }
  return parts.length > 0 ? parts.join(' ') : '(no additional fields)';
}

async function main() {
  const projectDir = process.argv[2];
  if (!projectDir) {
    return;
  }

  const raw = readFileSync(0, 'utf-8'); // fd 0 = stdin
  const input = JSON.parse(raw);

  const { session_id: sessionId, hook_event_name: eventName } = input;
  if (!sessionId || !eventName) {
    return;
  }

  const dir = path.join(projectDir, 'events');
  await mkdir(dir, { recursive: true });

  const filePath = path.join(dir, `${sessionId}.log`);
  const tag = isInternalAgentEvent(input) ? `${eventName}:internal` : eventName;
  const line = `${formatTimestamp(new Date())} ${levelFor(eventName)} [${tag}] ${formatDetails(input)}\n`;

  await appendFile(filePath, line, 'utf-8');
}

main()
  .catch(() => {
    // Logging must never block or fail the actual session.
  })
  .finally(() => {
    process.exit(0);
  });
