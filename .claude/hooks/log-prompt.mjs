#!/usr/bin/env node
// .claude/hooks/log-prompt.mjs
//
// UserPromptSubmit hook: appends every submitted prompt to
// prompt/<session_id>.md at the repo root — a local, personal record of
// what was actually asked in each session (mirrors the logs/ convention:
// gitignored, not shipped with the repo, since prompts can contain
// anything, including sensitive content).
//
// This never blocks or modifies the prompt — pure logging. A failure here
// must never break the actual conversation, so every error path still
// exits 0 rather than propagating.

import { existsSync, readFileSync } from 'node:fs';
import { mkdir, appendFile } from 'node:fs/promises';
import path from 'node:path';

async function main() {
  const projectDir = process.argv[2];
  if (!projectDir) {
    return; // nothing we can do without knowing where to write
  }

  const raw = readFileSync(0, 'utf-8'); // fd 0 = stdin
  const input = JSON.parse(raw);

  const { session_id: sessionId, prompt_id: promptId, prompt } = input;
  if (!sessionId || typeof prompt !== 'string') {
    return;
  }

  const dir = path.join(projectDir, 'prompt');
  await mkdir(dir, { recursive: true });

  const filePath = path.join(dir, `${sessionId}.md`);
  const isNew = !existsSync(filePath);
  const timestamp = new Date().toISOString();

  let entry = '';
  if (isNew) {
    entry += `# Prompt log — session ${sessionId}\n`;
  }
  entry += `\n## ${timestamp} (prompt_id: ${promptId})\n\n${prompt}\n`;

  await appendFile(filePath, entry, 'utf-8');
}

main()
  .catch(() => {
    // Logging must never block or fail the actual prompt.
  })
  .finally(() => {
    process.exit(0);
  });
