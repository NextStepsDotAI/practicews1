import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { findFiles, grepFiles } from './index';

describe('17-glob-and-grep', () => {
  // Use isolated temp fixture files rather than this repo's own src/ files,
  // so the test doesn't depend on (or break from) unrelated future changes
  // to other topics.
  let tmpDir: string;

  beforeAll(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'node-learning-17-glob-grep-'));
    fs.mkdirSync(path.join(tmpDir, 'a'));
    fs.mkdirSync(path.join(tmpDir, 'b'));
    fs.writeFileSync(path.join(tmpDir, 'a', 'index.ts'), 'export const a = 1;\n// TODO: refine a\n');
    fs.writeFileSync(path.join(tmpDir, 'b', 'index.ts'), 'export const b = 2;\n');
    fs.writeFileSync(path.join(tmpDir, 'a', 'notes.md'), '# TODO: write notes\n');
  });

  afterAll(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('finds files matching a glob pattern', () => {
    const files = findFiles('*/index.ts', tmpDir);
    expect(files).toHaveLength(2);
    expect(files.map((f) => path.basename(path.dirname(f))).sort()).toEqual(['a', 'b']);
  });

  it('grep-matches file contents across multiple files', () => {
    const files = findFiles('**/*', tmpDir);
    const matches = grepFiles(files, /TODO/);

    expect(matches).toHaveLength(2);
    expect(matches.map((m) => path.basename(m.file)).sort()).toEqual(['index.ts', 'notes.md']);
  });

  it('reports the correct line number for a match', () => {
    const files = findFiles('a/index.ts', tmpDir);
    const matches = grepFiles(files, /TODO/);

    expect(matches).toHaveLength(1);
    expect(matches[0].lineNumber).toBe(2);
    expect(matches[0].line).toBe('// TODO: refine a');
  });

  it('returns no matches when the pattern is absent', () => {
    const files = findFiles('*/index.ts', tmpDir);
    const matches = grepFiles(files, /NONEXISTENT_PATTERN/);

    expect(matches).toHaveLength(0);
  });
});
