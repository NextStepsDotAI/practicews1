# node-learning

A topic-by-topic Node.js + TypeScript learning lab. Each folder under `src/`
is a self-contained example of one Node.js concept, with a runnable demo and
a Jest test. Also used as a sandbox for practicing Claude Code features (see
`CLAUDE.md` and `.claude/` for the Claude Code-specific setup).

## Getting started

```bash
npm install
cp .env.example .env   # optional, used by 08-process-env
npm test                # run every topic's tests
npm run start:01-modules  # run a single topic's example (swap the suffix)
```

## Topics

| Folder | Covers |
| --- | --- |
| `01-modules` | ES module `import`/`export` vs CommonJS `require` |
| `02-fs` | Reading/writing files, sync vs promise-based APIs |
| `03-events` | `EventEmitter`, pub/sub |
| `04-streams` | Readable/Transform streams, `.pipe()` |
| `05-async` | Callbacks vs Promises vs async/await |
| `06-http-server` | Node's built-in `http` module |
| `07-express-api` | Routing, middleware, JSON APIs with Express |
| `08-process-env` | `process.env`, config, `dotenv` |
| `09-error-handling` | Custom error classes, sync/async try-catch |
| `10-testing-jest` | Jest matchers, mocks, lifecycle hooks, async assertions |
| `11-child-process` | Shelling out with `execFile`/`spawn` |
| `12-cluster-worker-threads` | Offloading CPU work to a `worker_threads` thread |
| `13-buffers` | Binary data, encodings, `Buffer` |
| `14-crypto` | Hashing, HMAC, random tokens via `crypto` |
| `15-timers-eventloop` | Execution order of `nextTick`/Promises/timers |
| `16-npm-packages` | `package.json`, semver, using a real dependency (`nanoid`) |

## Scripts

- `npm run start:<topic>` — run one topic's `index.ts` directly via ts-node
- `npm test` / `npm run test:watch` — run all Jest tests
- `npm run typecheck` — type-check the whole project without emitting output

## Claude Code boilerplate in this project

- **`CLAUDE.md`** — project context Claude Code reads automatically every session.
- **`.claude/settings.json`** — shared, checked-in project settings (currently a small
  permissions allowlist). It's plain JSON so it can't hold comments directly — this
  README and CLAUDE.md are the documentation for what's in it.
- **`.claude/commands/new-topic.md`** — a custom slash command; run `/new-topic <name>`
  in Claude Code to scaffold a new topic folder following this repo's conventions.
- **`.claude/settings.local.json`** (gitignored, not created by default) — where your own
  personal/local overrides would go, without affecting other contributors.
