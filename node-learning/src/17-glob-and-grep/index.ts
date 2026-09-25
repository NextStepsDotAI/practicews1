// TOPIC: Glob and Grep — finding files by pattern, then searching their contents
//
// "Glob" matches file PATHS against a wildcard pattern, e.g. `src/*/index.ts`
// matches every topic's index.ts. Node has built-in glob support —
// `fs.globSync` / `fs.promises.glob` — added in Node 22+, so no dependency
// is needed for this half.
//
// "Grep" (the classic Unix tool) searches file CONTENTS for a pattern, line
// by line. Node has no built-in grep — this implements a small one directly,
// which is genuinely how you'd do it without shelling out to a real `grep`
// (see 11-child-process for the shelling-out approach, for comparison).

import * as fs from 'fs';
import * as path from 'path';

export function findFiles(pattern: string, cwd: string): string[] {
  // A pattern like `**/*` matches directories as well as files — filter down
  // to files only, since that's what callers (and grepFiles below) expect.
  return fs
    .globSync(pattern, { cwd })
    .map((relativePath) => path.join(cwd, relativePath))
    .filter((absolutePath) => fs.statSync(absolutePath).isFile());
}

export interface GrepMatch {
  file: string;
  lineNumber: number;
  line: string;
}

// `pattern` should not use the global (`g`) flag — a shared global RegExp is
// stateful across .test() calls (it remembers lastIndex), which would silently
// skip matches here. Use a plain pattern like /TODO/ or /TODO/i instead.
export function grepFiles(files: string[], pattern: RegExp): GrepMatch[] {
  const matches: GrepMatch[] = [];
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    content.split('\n').forEach((line, index) => {
      if (pattern.test(line)) {
        matches.push({ file, lineNumber: index + 1, line: line.trim() });
      }
    });
  }
  return matches;
}

if (require.main === module) {
  // Find every topic's index.ts under src/, then grep them for a pattern —
  // the same two-step pipeline (find files, then search their contents) that
  // tools like ripgrep or `grep -r` do internally.
  const repoRoot = path.join(__dirname, '..', '..');
  const files = findFiles('src/*/index.ts', repoRoot);
  console.log(`Found ${files.length} files matching src/*/index.ts`);

  const matches = grepFiles(files, /require\.main === module/);
  console.log(`\nFound require.main === module in ${matches.length} files:`);
  matches.forEach((m) => console.log(`  ${path.relative(repoRoot, m.file)}:${m.lineNumber}`));
}
