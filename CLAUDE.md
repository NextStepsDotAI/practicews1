<!--
  Repo-root CLAUDE.md — read automatically by Claude Code for any session
  rooted at practicews1 (including inside node-learning/, unless that
  subfolder's own CLAUDE.md takes precedence for topics specific to it).
-->

# practicews1

A practice/learning workspace. Currently contains:

- `node-learning/` — a Node.js + TypeScript learning lab (see its own `CLAUDE.md`)
- `.claude/skills/` — custom Claude Code skills usable across this whole repo
- `.claude/agents/` — custom subagents usable across this whole repo (e.g.
  `changelog-writer`, `pr-reviewer`)
- `changelog/<branch>/<short-sha>.md` — a changelog entry per push, committed
  to git (unlike `logs/`, this ships with the repo)
- `reviews/<branch>/<short-sha>.md` — a code review per PR, written by the
  `pr-reviewer` subagent and gated on by the `pr-merge` skill before it will
  merge. Unlike `changelog/`, this is gitignored like `logs/` — it can't
  cleanly ride along with the push it reviews (review runs *after* push, in
  the background, and can take minutes), and `pr-merge` only ever needs to
  read it locally, never from GitHub

`git-branch-pr` creates/pushes branches and opens PRs; `pr-merge` (a
separate skill) is what actually merges one, after checking CI status and a
current, non-stale `pr-reviewer` review with no unresolved blocking
findings.

## Prompt and event logging (Claude Code hooks, not git hooks)

`.claude/settings.json` wires two Claude Code hooks (fire on Claude's own
lifecycle events, configured in `settings.json` — a different mechanism
from the git `pre-push` hook below, which fires on `git push` via
`core.hooksPath`; don't confuse the two):

- **`UserPromptSubmit`** → `.claude/hooks/log-prompt.mjs` — appends every
  prompt you submit to `prompt/<session_id>.md`, one file per session.
- **All 33 hook events** → `.claude/hooks/log-event.mjs`, registered once
  per event name (with the matcher field omitted everywhere, which defaults
  to "match all" — so this works uniformly across events that support a
  matcher and ones that don't) — appends one compact log line per event to
  `events/<session_id>.log`, classic timestamped format (à la Apache
  Commons Logging / log4j): `timestamp LEVEL [EventName] key=value ...`.
  Fields common to every event (session_id, cwd, transcript_path, etc.) are
  stripped so only each event's distinguishing info shows; `Failure`/
  `Denied` events log at `WARN`, everything else at `INFO`. This grows
  fast: `PreToolUse` and `PostToolUse` alone fire on every single tool call.

Both scripts are deliberately silent on stdout and always exit 0 — several
events treat exit-0 stdout as context/messages Claude sees, and firing on
every tool call means any output here would flood every turn. `prompt/` and
`events/` are both gitignored, same reasoning as `logs/`: local only, since
both can contain anything, including sensitive content.

## One-time setup per clone: activate the pre-push hook

```bash
git config core.hooksPath .githooks
```

This repo tracks a `pre-push` hook (`.githooks/pre-push`) that refuses to
push any non-`main` branch whose new commits don't touch `changelog/`
anywhere — a hard, git-level guarantee that a changelog entry can never be
left permanently orphaned behind a push. Git doesn't auto-activate tracked
hooks on clone (that's a git limitation, not a choice), so this one command
has to be run once per clone/machine before it takes effect. Without it,
pushes work exactly as before, just without that safety net.

## Convention: every skill logs its runs

Every skill under `.claude/skills/<skill-name>/` must write a log file each
time it actually performs its actions (not just when it's merely consulted/
read) to:

```
./logs/<skill-name>/<uuid>.md
```

- `<uuid>` is a fresh random UUID generated at the start of that run (e.g.
  `node -e "console.log(require('crypto').randomUUID())"`, or
  `[guid]::NewGuid().ToString()` in PowerShell if Node isn't available).
- The log is Markdown: what was done, key results (branch names, commit
  SHAs, URLs, etc.), and any errors or unexpected recoveries — enough that
  reading it later tells you what happened without re-deriving it from git
  history or chat scrollback.
- `logs/` is gitignored (see `.gitignore`) — it's a local audit trail for
  whoever is running Claude Code here, not something that ships in commits
  or PRs. If you want a given skill's logs tracked in git instead, say so
  explicitly and update that skill's instructions plus `.gitignore`.

`.claude/skills/git-branch-pr/SKILL.md` is the reference implementation of
this pattern — copy its "Logging" section's shape when writing a new skill.
