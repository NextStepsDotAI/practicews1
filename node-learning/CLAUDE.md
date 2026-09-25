<!--
  CLAUDE.md is read automatically by Claude Code at the start of every session
  in this directory. Use it to tell Claude (or any teammate) what this project
  is, how it's organized, and any conventions to follow — so you don't have to
  repeat that context in every conversation.
-->

# node-learning

A topic-by-topic Node.js + TypeScript learning lab. Each folder under `src/`
covers one Node.js concept in isolation, with a runnable example (`index.ts`)
and a matching test (`index.test.ts`). This repo doubles as a sandbox for
practicing Claude Code itself (editing, running tests, custom commands, etc).

## Structure

- `src/<NN-topic>/index.ts` — the runnable example/demo for that topic
- `src/<NN-topic>/index.test.ts` — Jest tests exercising that topic's code
- `src/<NN-topic>/*.ts` — any helper files a topic needs (e.g. a worker script)
- `.claude/settings.json` — shared Claude Code project settings (checked in)
- `.claude/commands/` — custom slash commands scoped to this project
- Root config: `package.json`, `tsconfig.json`, `jest.config.ts`, `.gitignore`, `.env.example`

## Conventions

- Topics are numbered (`01-`, `02-`, ...) in a rough learning order, oldest/simplest first.
- Every topic is self-contained: reading just that one folder should explain the concept.
- Keep examples short and heavily commented — this is a teaching repo, not production code.
- Language: TypeScript, run directly via `ts-node` (no separate build step needed day-to-day).
- Tests: Jest + ts-jest. Every topic should have at least one passing test.

## Common commands

```bash
npm install                    # install dependencies
npm run start:<topic>          # run one topic's example, e.g. npm run start:03-events
npm test                       # run all tests
npm run test:watch             # run tests in watch mode
npm run typecheck              # type-check without emitting files
```

## Adding a new topic

1. Create `src/<NN-topic-name>/index.ts` and `src/<NN-topic-name>/index.test.ts`.
2. Add a matching `start:<NN-topic-name>` script to `package.json`.
3. Add a one-line description to the topic list in `README.md`.

(There's also a `.claude/commands/new-topic.md` custom command that scaffolds
steps 1–2 for you — try `/new-topic <NN-topic-name>` in Claude Code.)
