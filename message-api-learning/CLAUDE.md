<!--
  CLAUDE.md is read automatically by Claude Code at the start of every session
  in this directory. Use it to tell Claude (or any teammate) what this project
  is, how it's organized, and any conventions to follow — so you don't have to
  repeat that context in every conversation.
-->

# message-api-learning

A topic-by-topic exploration of the **Claude Messages API** for TypeScript
(`@anthropic-ai/sdk`) — the raw way to talk to Claude: one request to
`POST /v1/messages`, one response back. No agent loop, no built-in tools —
you own the whole loop yourself. Structured the same way as the sibling
`node-learning/` and `agent-sdk-learning/` projects: one folder per topic, a
runnable example, and a test.

See the sibling `agent-sdk-learning/` project for the Claude **Agent SDK**
(a different, higher-level product built on top of this same API) — that
project is where agent-loop/built-in-tool concepts belong, not here.

## Structure

- `src/<NN-topic>/index.ts` — the runnable example/demo for that topic
- `src/<NN-topic>/*.ts` — supporting pure-logic files a topic needs, kept
  separate from `index.ts` so they're unit-testable without a live API call
  (e.g. `responseParsing.ts`)
- `src/<NN-topic>/index.test.ts` — Jest tests for that topic's *pure* logic
- `.claude/settings.json` — shared Claude Code project settings (checked in)
- Root config: `package.json`, `tsconfig.json`, `jest.config.ts`, `.gitignore`, `.env.example`

## Conventions

- Topics are numbered (`01-`, `02-`, ...) in a rough learning order, oldest/simplest first.
- Every topic is self-contained: reading just that one folder should explain the concept.
- Language: TypeScript, run directly via `ts-node` (no separate build step needed day-to-day).
- Auth is a real `ANTHROPIC_API_KEY` (pay-per-token billing) — unlike the
  Agent SDK sibling project, the Messages API has no subscription/OAuth-token
  path. `new Anthropic()` reads the key from the environment automatically.
- **Tests never call `client.messages.create()` live** — every real call is
  a billed API request, which is unacceptable in an automated test run
  (cost, network flakiness, secrets in CI). Instead, keep any logic worth
  testing (parsing a response's content blocks, building request params,
  etc.) in a separate pure file the test imports directly, the same way
  `index.test.ts` in `01-core-message-api` only imports
  `responseParsing.ts`, never `index.ts` (whose `main()` runs unconditionally
  and makes the real call).
- Running an example (`npm run start:<topic>`) *does* make a real, billed
  call — that's expected and is how you actually see the API work.

## Common commands

```bash
npm install                        # install dependencies
cp .env.example .env               # then fill in a real ANTHROPIC_API_KEY
npm run start:<topic>              # run one topic's example, e.g. npm run start:01-core-message-api
npm test                           # run all tests (pure logic only, no live calls)
npm run test:watch                 # run tests in watch mode
npm run typecheck                  # type-check without emitting files
```

## Adding a new topic

1. Create `src/<NN-topic-name>/index.ts`, a pure-logic file if there's
   anything worth unit-testing, and `index.test.ts` testing only that pure
   file.
2. Add a matching `start:<NN-topic-name>` script to `package.json`.
3. Add a one-line description to the topic list in `README.md`.
