<!--
  Files under .claude/commands/ become custom slash commands in Claude Code,
  scoped to this project. This file defines the `/new-topic` command.
  The filename (minus .md) is the command name; the body below is the prompt
  Claude receives when you run it, with $ARGUMENTS substituted for whatever
  you typed after the command.
-->

Scaffold a new Node.js learning topic in this repo, named "$ARGUMENTS" (a
kebab-case folder name like `17-streams-backpressure`).

Do the following:

1. Create `src/$ARGUMENTS/index.ts` containing a small, heavily-commented,
   runnable example that demonstrates the concept named in the folder name.
2. Create `src/$ARGUMENTS/index.test.ts` with at least one Jest test that
   exercises the code in `index.ts`.
3. Add a `"start:$ARGUMENTS": "ts-node src/$ARGUMENTS/index.ts"` script to
   `package.json`, keeping the scripts list sorted the same way the existing
   ones are.
4. Add a one-line bullet describing the new topic to the topic list in
   `README.md`.
5. Run `npm test` and `npm run typecheck` to confirm everything passes before
   reporting back.
