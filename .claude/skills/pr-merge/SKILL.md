---
name: pr-merge
description: >
  Merges an open pull request into main, but only after checking it's
  actually safe to: verifies CI/mergeable status via gh, requires a current
  (non-stale) pr-reviewer review log with no unresolved blocking findings,
  confirms the merge strategy with the user, then merges and cleans up
  (deletes the branch, updates local main). Use this whenever the user wants
  to merge, land, ship, or close out a PR — "merge this PR", "it's approved,
  ship it", "land this branch", "this looks good, merge it". Don't use
  git-branch-pr for this — that skill only creates/pushes branches and opens
  PRs, it doesn't merge them.
---

# pr-merge

Landing a PR is a visible, semi-irreversible action on shared state (it
changes `main` for everyone), so this skill is deliberately more cautious
than `git-branch-pr`: it won't merge past a stale or missing review, and it
won't merge past a blocking finding without the user explicitly overriding
it.

## Logging

Per the repo-wide convention (root `CLAUDE.md`): log every run to
`./logs/pr-merge/<uuid>.md`, relative to the repo root. Generate the UUID at
the start (`node -e "console.log(require('crypto').randomUUID())"`), create
the folder if needed, and write the log as the **last step**, including on
a run that stops short of merging (e.g. blocked by a failing check or a
declined override) — that's still a meaningful outcome to record. Shape:

```markdown
# pr-merge run — <uuid>

- **Started:** <ISO 8601 timestamp>
- **PR:** <number/url>
- **Branch:** <branch> → main
- **Status:** merged | blocked | declined-by-user

## Checks
- **CI/mergeable:** <result>
- **Review:** <verdict from the review log, or "none found">

## Result
<merge commit sha + cleanup done, or why it stopped short>
```

## Steps

1. **Identify the PR.** If the user names it, use that; otherwise use the
   current branch (`git branch --show-current`) and `gh pr view` to find its
   PR. If there's no open PR for the current branch and none was named, ask
   which one.

2. **Check CI and mergeable status.** `gh pr view <n> --json state,mergeable,
   statusCheckRollup,reviewDecision`. If `state` isn't `OPEN`, or
   `mergeable` isn't `MERGEABLE`, or any required CI check is failing, stop
   and tell the user exactly what's blocking it — don't try to work around a
   failing check.

3. **Get a current review.** Compute the branch's current short SHA
   (`git rev-parse --short <branch>`) and look for
   `reviews/<branch>/<short-sha>.md`. If it exists and matches the current
   SHA, read it. If it's missing, or its SHA doesn't match current HEAD
   (stale — new commits landed since it was written), dispatch the
   `pr-reviewer` subagent yourself, **in the foreground**
   (`run_in_background: false`) — the very next step depends on its result,
   so there's nothing to gain from backgrounding it here, unlike when
   `git-branch-pr` kicks it off speculatively.

4. **Enforce the verdict.**
   - **Clean** or **Advisory only**: proceed.
   - **Blocking issues found**: stop. Show the user the blocking findings
     from the review file (not just "there are issues" — the actual list).
     Only proceed if the user explicitly says to override and merge anyway;
     record that override in the run log if it happens. Never merge past a
     blocking finding silently.

5. **Confirm the merge strategy with the user** before doing anything
   irreversible. Default to **squash** (this repo's branches tend to
   accumulate small fixup commits — e.g. separate "add changelog entry"
   commits per `git-branch-pr`'s workflow — so squashing keeps `main`'s
   history one entry per logical change). Offer merge/rebase as
   alternatives if they'd rather preserve the individual commits.

6. **Merge.** `gh pr merge <n> --squash --delete-branch` (or `--merge`/
   `--rebase` per the confirmed strategy). `--delete-branch` removes the
   remote branch; it does not touch the local one.

7. **Clean up locally.** Switch to `main`, `git pull`, then delete the local
   branch (`git branch -d <branch>`) if it still exists — use `-d` (not
   `-D`) so git itself refuses if the branch somehow isn't fully merged,
   which is a useful safety check rather than something to route around.

8. **Report back**: the merge commit, that the branch was cleaned up
   (remote + local), and a one-line pointer to the review log that gated it.

9. **Write the run log** described above.

## Notes

- This skill never runs `git push --force` or force-deletes a branch
  (`-D`) — if step 7's plain delete is refused, tell the user rather than
  overriding it.
- If the user asks to merge without any of the checks (e.g. "just merge it,
  skip the review"), that's their call to make explicitly — but still tell
  them what you're skipping before you do it, don't silently comply.
