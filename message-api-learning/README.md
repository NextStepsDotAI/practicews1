# message-api-learning

A topic-by-topic exploration of the [Claude Messages API](https://platform.claude.com/docs)
for TypeScript (`@anthropic-ai/sdk`) — the raw way to talk to Claude: send
one request, get one response back, no agent loop or built-in tools
included. Structured like the sibling `node-learning/` and
`agent-sdk-learning/` projects: each folder under `src/` is a self-contained
example of one API concept, with a runnable demo and a Jest test for its
pure logic. See `CLAUDE.md` for conventions.

## Getting started

```bash
npm install
cp .env.example .env                    # fill in a real ANTHROPIC_API_KEY
npm test                                # run all tests (no live API calls)
npm run start:01-core-message-api       # run a topic's example (makes a real, billed call)
```

## Topics

| Folder | Covers |
| --- | --- |
| `01-core-message-api` | The core of the Messages API: one `client.messages.create()` call — one user message in, one assistant message (a single turn) out, authenticated with `ANTHROPIC_API_KEY` |

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
