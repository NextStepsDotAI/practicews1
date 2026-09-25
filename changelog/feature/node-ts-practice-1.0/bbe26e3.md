# feature/node-ts-practice-1.0 — bbe26e3

- **Date:** 2026-09-25
- **Base:** main
- **Commits:** 21

bbe26e3 Rework event logger to a single-line-per-event format, not raw JSON
c89d9b8 Add changelog entry for the universal event logger
38cadcf Add universal event logger wired to all 33 Claude Code hook events
debfd68 Add changelog entry for the prompt-logging hook
e0014b1 Add UserPromptSubmit hook logging prompts to prompt/<session_id>.md
3b5311a Add changelog entry for the glob-and-grep topic
f3394c7 Add 17-glob-and-grep topic
095c32f Add changelog entry for the review-findings fixes
13feb17 Fix two issues pr-reviewer found in its first real run
a43cb06 Add changelog entry for pr-reviewer and pr-merge
4f8b8a8 Add pr-reviewer subagent and pr-merge skill
ec18059 Add changelog entry for the hook documentation
108a625 Document the pre-push hook setup and reference it from git-branch-pr
e58dcb6 Add changelog entry for the pre-push hook
bfb5abe Add pre-push hook enforcing every push carries a changelog entry
75ee515 Add changelog entry for the workflow-ordering fix
b62b1d3 Fix changelog-writer being dispatched after push, not before
7c6d692 Add changelog entry for the changelog-writer/node-tutor push
72de8a0 Add node-tutor skill, changelog-writer agent, and first changelog entry
a856c09 Add repo-wide skill-logging convention
6e87ea4 Harden git-branch-pr skill with lessons from its first real run
0901840 Add node-learning TypeScript practice project and git-branch-pr skill

## Summary
- Reworked `.claude/hooks/log-event.mjs`'s output from a pretty-printed
  JSON block per event to a single timestamped log line per event (log4j/
  Apache-Commons-Logging style: `2026-09-25 23:30:57,427 INFO  [PreToolUse]
  tool_name=Bash tool_input={...}`), stripping fields common to every event
  (`session_id`, `cwd`, `transcript_path`, `scratchpad_dir`,
  `permission_mode`, `hook_event_name`, `prompt_id`, `effort`) and printing
  whatever's left, plus truncating any single field beyond 150 chars — so
  each event's distinguishing info surfaces without a hand-written field
  map for all 33 events' differing schemas. Failure/Denied events log at
  WARN, everything else at INFO. Output moved from `events/<session_id>.md`
  to `events/<session_id>.log` accordingly, and `CLAUDE.md` was updated to
  match.
- Stood up the `node-learning` TypeScript practice lab (Jest, tsconfig,
  package.json/lock) along with 17 topic folders (`01-modules` through
  `17-glob-and-grep`) each pairing an implementation file with its test,
  covering modules, fs, events, streams, async, HTTP servers, Express,
  env/config, error handling, Jest testing, child processes, cluster/worker
  threads, buffers, crypto, timers/event loop, npm packages, and glob/grep.
- Built out the repo's Claude Code tooling: the `git-branch-pr` skill for
  branching/pushing/PRs (later hardened from real-run lessons), the
  `node-tutor` skill for the practice lab, the `changelog-writer` subagent,
  and a `pr-reviewer` subagent plus `pr-merge` skill that gates merges on a
  current, non-stale review — with two bugs it found in its own first real
  run subsequently fixed.
- Added a `pre-push` git hook (`.githooks/pre-push`) that hard-blocks any
  non-`main` push whose commits don't touch `changelog/`, closing the gap
  where a changelog entry could be pushed after the fact or skipped
  entirely, plus documentation of the one-time `core.hooksPath` setup, and
  fixed a workflow-ordering bug where `changelog-writer` was being invoked
  after the push instead of before.
- Added Claude Code hook instrumentation: `log-prompt.mjs` (logs
  `UserPromptSubmit` prompts to `prompt/<session_id>.md`) and
  `log-event.mjs`, a universal logger wired to all 33 Claude Code hook
  events, plus the accompanying `.claude/settings.json` wiring.
- Established the repo-wide conventions documented in `CLAUDE.md`: every
  skill logs its runs to `logs/<skill-name>/<uuid>.md` (gitignored), and
  every push carries a `changelog/<branch>/<short-sha>.md` entry (tracked).
  Each commit in this push has its own corresponding changelog entry file.

## Files changed
68 files changed, 8021 insertions(+). Breakdown:
- **Repo-level tooling (`.claude/`, `.githooks/`, root):** `CLAUDE.md`,
  `.gitignore`, `.gitattributes`, `.claude/agents/changelog-writer.md`,
  `.claude/agents/pr-reviewer.md`, `.claude/hooks/log-event.mjs` (reworked
  in this push's newest commit), `.claude/hooks/log-prompt.mjs`,
  `.claude/settings.json`, `.claude/skills/git-branch-pr/SKILL.md`,
  `.claude/skills/pr-merge/SKILL.md`, `.githooks/pre-push`.
- **Changelog entries:** 10 files under
  `changelog/feature/node-ts-practice-1.0/` (one per prior push in this
  branch).
- **`node-learning/` practice lab:** config/scaffolding (`.env.example`,
  `.gitignore`, `CLAUDE.md`, `README.md`, `jest.config.ts`, `package.json`,
  `package-lock.json`, `tsconfig.json`), Claude tooling
  (`.claude/commands/new-topic.md`, `.claude/settings.json`,
  `.claude/skills/node-tutor/SKILL.md`), and 17 topic folders under `src/`
  (`01-modules` through `17-glob-and-grep`), each with an implementation
  file and a matching `*.test.ts`.
