# agent-sdk-learning

A topic-by-topic exploration of the [Claude Agent SDK](https://code.claude.com/docs/en/agent-sdk/typescript)
for TypeScript (`@anthropic-ai/claude-agent-sdk`) — the programmatic SDK for
building agents on Claude Code's own engine. Structured like the sibling
`node-learning/` project: each folder under `src/` is a self-contained
example of one SDK concept, with a runnable demo and a Jest test for its
pure logic. See `CLAUDE.md` for conventions, in particular around why the
SDK is loaded via dynamic `import()` and why tests never call it live.

## Getting started

```bash
npm install
cp .env.example .env              # fill in a real ANTHROPIC_API_KEY
npm test                          # run all tests (no live API calls)
npm run start:01-basic-query      # run a topic's example (makes a real, billed call)
```

## Topics

| Folder | Covers |
| --- | --- |
| `01-basic-query` | `query()` — the SDK's core entry point: send one prompt, stream messages back, print the assistant's text |
| `02-query-lifecycle` | Every stage a `query()` run goes through — session start, assistant text/tool-call, tool result, session end — and the metadata each stage carries |
| `03-custom-tool` | Two ways to go beyond built-in tools: a custom tool via `tool()`/`createSdkMcpServer()`, and a subagent via the `agents` option + Task tool |
| `04-list-tools` | Prints the real, current list of built-in tools from the session's own `system`/`init` message, instead of a hardcoded list that could go stale |

## Scripts

- `npm run start:<topic>` — run one topic's `index.ts` directly via ts-node
- `npm test` / `npm run test:watch` — run all Jest tests
- `npm run typecheck` — type-check the whole project without emitting output

## Claude Code boilerplate in this project

- **`CLAUDE.md`** — project context Claude Code reads automatically every session.
- **`.claude/settings.json`** — shared, checked-in project settings (currently a small
  permissions allowlist).
- **`.claude/settings.local.json`** (gitignored, not created by default) — where your own
  personal/local overrides would go, without affecting other contributors.
