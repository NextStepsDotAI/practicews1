#!/usr/bin/env node
// .claude/hooks/log-event.mjs
//
// Universal handler wired to all 33 Claude Code hook events. Appends every
// event that fires, across the whole session, to events/<session_id>.md —
// one running log per session. Logs the full raw JSON payload rather than
// hand-picking fields per event, since the 33 events don't share a
// consistent event-specific schema (PreToolUse has tool_name/tool_input,
// Stop has stop_reason, SessionStart has session_start_reason, etc.).
//
// Never blocks, modifies, or comments on anything — pure observation. Must
// stay completely silent on stdout: several events (PreToolUse, PostToolUse,
// UserPromptSubmit, Stop, ...) treat exit-0 stdout as context/messages
// Claude sees, and this fires on EVERY tool call — any stdout here would
// flood every single turn with noise. All errors are swallowed for the same
// reason logging must never break the actual session.
//
// Known limitation: concurrent events (hooks "run in parallel when an event
// fires" per the docs) each spawn a separate node process appending to the
// same file — appendFile is not cross-process-atomic, so rapid concurrent
// events could rarely interleave. Acceptable for a debug/observability log;
// not something to build file locking for here.

import { existsSync, readFileSync } from 'node:fs';
import { mkdir, appendFile } from 'node:fs/promises';
import path from 'node:path';

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

  const filePath = path.join(dir, `${sessionId}.md`);
  const isNew = !existsSync(filePath);
  const timestamp = new Date().toISOString();

  let entry = '';
  if (isNew) {
    entry += `# Event log — session ${sessionId}\n`;
  }
  entry += `\n## ${timestamp} — ${eventName}\n\n\`\`\`json\n${JSON.stringify(input, null, 2)}\n\`\`\`\n`;

  await appendFile(filePath, entry, 'utf-8');
}

main()
  .catch(() => {
    // Logging must never block or fail the actual session.
  })
  .finally(() => {
    process.exit(0);
  });
