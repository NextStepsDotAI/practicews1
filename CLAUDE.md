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
  `changelog-writer`)
- `changelog/<branch>/<short-sha>.md` — a changelog entry per push, committed
  to git (unlike `logs/`, this ships with the repo)

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
