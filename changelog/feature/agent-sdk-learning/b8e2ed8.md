# feature/agent-sdk-learning — b8e2ed8

- **Date:** 2026-09-26
- **Base:** main
- **Commits:** 1

b8e2ed8 Add agent-sdk-learning: a Claude Agent SDK exploration project

## Summary
- Adds a new sibling project, `agent-sdk-learning/`, alongside `node-learning/`, dedicated to hands-on exploration of `@anthropic-ai/claude-agent-sdk`.
- Covers the core `query()` entry point (`01-basic-query`) and helper message-parsing logic.
- Walks through every message-type stage a `query()` run goes through via a lifecycle inspector (`02-query-lifecycle`).
- Demonstrates extending an agent with a custom tool and a subagent (`03-custom-tool`).
- Discovers and documents the real built-in tool list, and contrasts `tools` vs `allowedTools` behavior with actual output examples (`04-list-tools`).
- Project is fully scaffolded with its own `package.json`, `tsconfig.json`, `jest.config.ts`, `.env.example`, `.gitignore`, `README.md`, and `CLAUDE.md`, each topic paired with its own test file.

## Files changed
21 files changed, 7145 insertions(+). The bulk is `agent-sdk-learning/package-lock.json` (6352 lines, dependency lockfile); the rest is project scaffolding (config, README, CLAUDE.md) plus four topic folders under `src/` (01-basic-query, 02-query-lifecycle, 03-custom-tool, 04-list-tools), each with an implementation file and a test file.
