<!--
  CLAUDE.md is read automatically by Claude Code at the start of every session
  in this directory. Use it to tell Claude (or any teammate) what this project
  is, how it's organized, and any conventions to follow — so you don't have to
  repeat that context in every conversation.
-->

# agent-sdk-learning

A topic-by-topic exploration of the **Claude Agent SDK** for TypeScript
(`@anthropic-ai/claude-agent-sdk`) — the programmatic SDK for building agents
on Claude Code's own engine (not the plain Messages API). Structured the same
way as the sibling `node-learning/` project: one folder per topic, a runnable
example, and a test.

## Structure

- `src/<NN-topic>/index.ts` — the runnable example/demo for that topic
- `src/<NN-topic>/*.ts` — supporting pure-logic files a topic needs, kept
  separate from `index.ts` so they're unit-testable without a live API call
  (e.g. `messageParsing.ts`)
- `src/<NN-topic>/index.test.ts` — Jest tests for that topic's *pure* logic
- `.claude/settings.json` — shared Claude Code project settings (checked in)
- Root config: `package.json`, `tsconfig.json`, `jest.config.ts`, `.gitignore`, `.env.example`

## Conventions

- Topics are numbered (`01-`, `02-`, ...) in a rough learning order, oldest/simplest first.
- Every topic is self-contained: reading just that one folder should explain the concept.
- Language: TypeScript, run directly via `ts-node` (no separate build step needed day-to-day).
- **The SDK is ESM-only**, while this project compiles to CommonJS to stay
  consistent with `node-learning/`'s setup. So `index.ts` files load it via a
  dynamic `await import('@anthropic-ai/claude-agent-sdk')` inside `main()`,
  not a static top-level `import` — Node's CommonJS loader can't `require()`
  an ESM-only package. Type-only imports (`import type { SDKMessage } from
  '@anthropic-ai/claude-agent-sdk'`) are fine anywhere — they're erased at
  compile time and never hit the runtime loader.
- **Tests never call the SDK's `query()` live** — every real call is a
  billed API request against the account's `ANTHROPIC_API_KEY`, which is
  unacceptable in an automated test run (cost, network flakiness, secrets in
  CI). Instead, keep any logic worth testing (parsing SDK messages, building
  options objects, etc.) in a separate pure file the test imports directly,
  the same way `index.test.ts` in `01-basic-query` only imports
  `messageParsing.ts`, never `index.ts` (whose `main()` runs unconditionally
  and makes the real call).
- Running an example (`npm run start:<topic>`) *does* make a real, billed
  call — that's expected and is how you actually see the SDK work.
- **`options.tools` restricts which tools exist; `options.allowedTools` does
  not.** `tools` sets the real, available set for the session (omitted = every
  built-in tool; `[]` = none). `allowedTools` only skips the permission
  prompt for tools that are *already* available — it never adds or removes
  any. When a topic's intent is "only this tool should exist," use `tools`
  (see `04-list-tools`, which proves the difference with real output);
  `allowedTools` alone leaves every other built-in tool reachable, just
  gated behind a prompt. Note `AgentDefinition.tools` (for subagents,
  passed via the `agents` option) is a different field that already IS a
  real restriction, unlike the top-level `allowedTools`.

## Common commands

```bash
npm install                    # install dependencies
cp .env.example .env           # then fill in a real ANTHROPIC_API_KEY
npm run start:<topic>          # run one topic's example, e.g. npm run start:01-basic-query
npm test                       # run all tests (pure logic only, no live calls)
npm run test:watch             # run tests in watch mode
npm run typecheck              # type-check without emitting files
```

## Adding a new topic

1. Create `src/<NN-topic-name>/index.ts`, a pure-logic file if there's
   anything worth unit-testing, and `index.test.ts` testing only that pure
   file.
2. Add a matching `start:<NN-topic-name>` script to `package.json`.
3. Add a one-line description to the topic list in `README.md`.
