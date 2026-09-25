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

## Steps

Work through these in order. Stop and confirm with the user before step 5 and
step 6 — pushing and opening a PR are visible to others and worth a quick
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

5. **Push the branch**, after confirming with the user. Run
   `git push -u origin <type>/<description>`.

6. **Open the PR**, after confirming title/body with the user. Use the `gh`
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

7. **Report back** with the PR URL once created (`gh pr create` prints it).

## Notes

- `gh` must be authenticated (`gh auth status`) for steps 5-6 to work — if
  it's not, tell the user rather than trying workarounds.
- If the branch name would collide with one that already exists locally or on
  `origin`, append `-2`, `-3`, etc. rather than force-overwriting anything.
- Never use `git push --force` in this workflow — these are always fresh
  branches, so a normal push is sufficient.
