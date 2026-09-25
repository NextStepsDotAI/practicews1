// TOPIC: npm & packages
//
// Key package.json concepts:
//   - "dependencies": needed at runtime (e.g. express, dotenv, nanoid — used by other topics)
//   - "devDependencies": only needed for development/testing (e.g. jest, typescript, ts-node)
//   - semver ranges: "^1.2.3" allows 1.x.x upgrades but not 2.0.0; "~1.2.3" allows only patch upgrades
//   - package-lock.json: pins the *exact* resolved versions of every dependency (direct + transitive)
//     so `npm install` is reproducible across machines — always commit it.
//
// This file demonstrates actually using a third-party package: `nanoid`,
// a small dependency for generating unique, URL-safe IDs.

import { nanoid } from 'nanoid';

export function generateId(size?: number): string {
  return nanoid(size);
}

if (require.main === module) {
  console.log('Generated ID:', generateId());
  console.log('Shorter ID (8 chars):', generateId(8));
}
