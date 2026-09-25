---
name: git-branch-pr
description: >
  Creates a correctly-named git branch off main, switches to it, commits any
  pending work, pushes it, and opens a pull request back into main via the gh
  CLI. Use this whenever the user wants to start new work on its own branch,
  ship/submit a change, "open a PR", "put this up for review", "push this to
  a branch", or says something like "let's branch this off" or "create a PR
  for X" — even if they don't spell out every step (naming, pushing, PR
  creation) explicitly. Also use it proactively after finishing a chunk of
  work in this repo when the user asks to save/share/submit it, rather than
  just committing to main directly.
---

# git-branch-pr

A repeatable workflow for taking work in this repo from "changes on disk" to
"a pull request open against `main`" — with a consistent branch naming
convention so history stays readable.

## Branch naming convention

`<type>/<kebab-case-description>`

- `type` is one of: `feature`, `fix`, `chore`, `docs`, `refactor`, `test`
  - `feature` — new functionality
  - `fix` — bug fix
  - `chore` — maintenance, deps, tooling, config
  - `docs` — documentation only
  - `refactor` — code change with no behavior change
  - `test` — adding/adjusting tests only
- `description` is 2-6 words, lowercase, hyphen-separated, no ticket numbers
  or dates — just enough to identify the change at a glance.

Examples: `feature/add-login-page`, `fix/null-pointer-in-parser`,
`chore/update-jest-config`, `docs/readme-setup-steps`.

If it's not obvious from context which `type` fits, or the description would
be ambiguous, ask the user in one short question rather than guessing.

## Logging

This skill follows the repo-wide convention (see root `CLAUDE.md`): every
run gets logged to `./logs/git-branch-pr/<uuid>.md`, relative to the repo
root (`git rev-parse --show-toplevel`), so there's a record of what actually
happened without having to dig through chat scrollback or git history later.

At the **start** of a run, generate a fresh UUID —
`node -e "console.log(require('crypto').randomUUID())"` (Node is available
in this repo), or `[guid]::NewGuid().ToString()` in PowerShell as a fallback
— and hold onto it for the log filename. Create `logs/git-branch-pr/` if it
doesn't exist yet. Write the log file as the **last step** of the run (step
8 below), once the outcome is known — including on partial failure, so a
failed run is captured too, not just successful ones. Use this template:

```markdown
# git-branch-pr run — <uuid>

- **Started:** <ISO 8601 timestamp>
- **Branch:** <type>/<description>
- **Base:** main @ <sha main was branched from>
- **Status:** success | partial | failed

## Steps taken
<short bullet list of what actually happened, in order>

## Result
- Commit(s): <sha> — <first line of commit message>
- Pushed to: origin/<branch> (or "not pushed" if the user declined)
- Pull request: <url> (or "not created" / "declined")

## Issues encountered
<any errors, unexpected states, or recoveries — or "none">
```

## Steps

Work through these in order. Stop and confirm with the user before step 5 and
step 7 — pushing and opening a PR are visible to others and worth a quick
sanity check first, even though they asked for this workflow.

1. **Check repo state.** Run `git status`. If there are uncommitted changes,
   that's expected — they're what this branch will carry. If the working tree
   is completely clean and there's nothing new relative to `main`, stop and
   tell the user there's nothing to branch/PR yet.

2. **Sync main.** Run `git fetch origin` then check whether the local `main`
   is behind `origin/main`. If the current branch is already `main` and it's
   behind, update it (`git pull`) before branching, so the new branch starts
   from the latest code. If there are uncommitted changes sitting on top of a
   stale `main`, don't force a pull that could conflict — branch off first
   (step 3), then rebase later only if the user asks.

3. **Create and switch to the branch.** Pick `<type>/<description>` per the
   convention above, from the nature of the change (or what the user just
   asked for). Run `git checkout -b <type>/<description>`.

4. **Commit the work**, if it isn't already committed. Follow this repo's
   normal commit process: review `git status`/`git diff` for what's staged
   vs. not, stage the relevant files by name (not `git add -A`), and write a
   commit message describing *why*, not just *what*. Skip this step entirely
   if everything is already committed.

   After running the commit, don't assume it succeeded just because the
   command was issued — confirm it with `git log -1 --oneline`. If a commit
   (or any git command) gets interrupted mid-write, it can leave `.git/HEAD`
   or a `refs/heads/<branch>` file corrupted (seen in practice: truncated to
   null bytes), which makes git report "not a git repository" on the very
   next command — looking like the whole repo is gone. It usually isn't: run
   `git fsck --full` and check `.git/logs/HEAD` (the reflog) and the other
   branch refs (e.g. `main`'s) first — they're stored as separate files and
   often survive untouched. If `main` (or another known-good ref) still
   resolves, you can typically repair the broken file by hand (write
   `ref: refs/heads/<branch>` into `HEAD`, or the last-known commit SHA from
   the reflog into the branch's ref file) rather than concluding work was
   lost. Re-run `git fsck` after repairing to confirm the repo is sound
   before continuing.

5. **Push the branch**, after confirming with the user. Run
   `git push -u origin <type>/<description>`. If this fails with something
   like `could not read Username for 'https://github.com'` or
   `terminal prompts disabled`, git isn't wired to use `gh`'s stored login —
   run `gh auth setup-git` once (safe to run any time, it just points git's
   credential helper at `gh`) and retry the same push. Don't try other
   interactive-auth workarounds; this is almost always the actual cause on a
   machine where `gh auth status` already shows a logged-in account.

6. **Kick off a changelog entry.** Right after the push succeeds, dispatch
   the `changelog-writer` subagent (Agent tool, `subagent_type:
   changelog-writer`) with the branch name, base branch (`main`), and repo
   root — it writes `changelog/<type>/<description>/<short-sha>.md` on its
   own. Run it in the background (`run_in_background: true`) — nothing later
   in this workflow depends on it, so there's no reason to block the PR step
   waiting for it. Mention in the final report (step 9) that it's running
   and will land shortly; don't fabricate its result before it actually
   finishes.

   Note: this agent type takes a moment to become dispatchable right after
   its `.claude/agents/*.md` file is first created or edited in a session —
   if `subagent_type: changelog-writer` is rejected as unknown, fall back to
   `subagent_type: general-purpose` with a prompt telling it to read and
   follow `.claude/agents/changelog-writer.md`'s instructions exactly; retry
   the direct `changelog-writer` type on the next push.

7. **Open the PR**, after confirming title/body with the user. Use the `gh`
   CLI:
   ```bash
   gh pr create --base main --head <type>/<description> --title "<title>" --body "<body>"
   ```
   - Title: short, imperative, under ~70 chars (e.g. "Add login page").
   - Body: a `## Summary` with 1-3 bullets on what changed and why, and if
     there's a sensible way to verify the change, a `## Test plan` checklist.
     Base this on the actual commit(s) on the branch (`git log main..HEAD`),
     not on guesses.
   - End the body with the attribution line this session uses for PR
     descriptions, if one is configured.

8. **Report back** with the PR URL once created (`gh pr create` prints it),
   and note that the changelog entry from step 6 is generating in the
   background if it hasn't reported back yet.

9. **Write the run log** described above under "Logging", then let the user
   know it was written (path is enough, no need to print the whole contents
   unless they ask).

## Notes

- `gh` must be authenticated (`gh auth status`) for steps 5 and 7 to work —
  if it's not, tell the user rather than trying workarounds.
- If the branch name would collide with one that already exists locally or on
  `origin`, append `-2`, `-3`, etc. rather than force-overwriting anything.
- Never use `git push --force` in this workflow — these are always fresh
  branches, so a normal push is sufficient.
